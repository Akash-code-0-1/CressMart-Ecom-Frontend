"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MoreVertical,
  Edit,
  Printer,
  FileText,
  RefreshCw,
  UserX,
  Trash2,
  ChevronLeft,
  X,
  Loader2,
  User,
  MapPin,
  Package,
  Info,
  Clock,
  CheckCircle2,
  PauseCircle,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";

import DataTable from "../common/DataTable";
import Pagination2 from "../common/Pagination2";
import TableTabs from "./TableTabs";
import TrackIcon from "@/components/store-front/svg/svg/TrackIcon";

import {
  getAllOrdersService,
  updateOrderStatusService,
  fetchOrderCounts,
} from "@/services-api/orderService";
import { customerApi } from "@/services-api/customerService";
import { useRouter } from "next/navigation";
import { InvoicePrint } from "./InvoicePrint";
import { useReactToPrint } from "react-to-print";

type UpdateOrderStatusPayload = {
  status: string;
  courierName?: string;
  trackingCode?: string;
};

type User = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_image: string;
  avatar?: string;
  phone?: string;
};

const getStatusConfig = (status: string) => {
  const upper = status?.toUpperCase() || "";
  switch (upper) {
    case "PENDING":
      return {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        iconColor: "text-amber-500",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className: "bg-blue-50 text-[#1DA1F2] border-blue-200 hover:bg-blue-100",
        iconColor: "text-[#1DA1F2]",
      };
    case "ON_HOLD":
      return {
        label: "On Hold",
        icon: PauseCircle,
        className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        iconColor: "text-orange-500",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        icon: Truck,
        className: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
        iconColor: "text-purple-500",
      };
    case "SENT_TO_COURIER":
      return {
        label: "Sent to Courier",
        icon: Truck,
        className: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        iconColor: "text-indigo-500",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        icon: PackageCheck,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        iconColor: "text-emerald-500",
      };
    case "CANCELED":
      return {
        label: "Canceled",
        icon: XCircle,
        className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        iconColor: "text-rose-500",
      };
    case "RETURNED":
      return {
        label: "Returned",
        icon: RotateCcw,
        className: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        iconColor: "text-gray-500",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        icon: RefreshCw,
        className: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
        iconColor: "text-teal-500",
      };
    default:
      return {
        label: status.replace(/_/g, " "),
        icon: Info,
        className: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
        iconColor: "text-gray-400",
      };
  }
};

type OrderItem = {
  id: string;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_image: string;
  customer_address: string;
  customer_note?: string;
  source: string;
  user_id: string;
  order_items: OrderItem[];
  status: string;
  payment_status: string;
  shipping_fee: number;
  discount_amount: number;
  advance_amount?: number | string;
  total_amount: number;
  total_amount_due: number;
  total_bill?: number;
  totalDue?: number | string;
  created_at: string;
  user?: {
    profile?: {
      image?: string;
    };
  };
};

export default function OrderTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = [
    "All order",
    "Pending",
    "Confirmed",
    "Delivered",
    "Canceled",
    "Returned",
  ];

  // Action Menu States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    opensUpward: false,
  });
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Modal States
  const [shippedModal, setShippedModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });

  // 🚀 Logic for fetching profile image in Details Modal
  const [fetchedCustomer, setFetchedCustomer] = useState<User | null>(null);

  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<Order | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [courierInfo, setCourierInfo] = useState({
    courierName: "",
    trackingCode: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  // --- HELPERS ---
  const openDetails = (order: Order) => {
    setDetailsModal({ open: true, order });
    setActiveMenuId(null);
  };

  const getImgUrl = (rawImg: string) => {
    const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
    return cleanImg !== ""
      ? cleanImg.startsWith("http")
        ? cleanImg
        : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`
      : "/images/products/product2.png";
  };

  // 🚀 Logic to find customer profile when Modal opens
  useEffect(() => {
    const checkCustomer = async () => {
      if (detailsModal.open && detailsModal.order) {
        try {
          const res = await customerApi.getAll(
            1,
            1,
            detailsModal.order.customer_phone,
          );
          const user = res?.data?.data?.[0];
          if (user && user.phone === detailsModal.order.customer_phone) {
            setFetchedCustomer(user);
          } else {
            setFetchedCustomer(null);
          }
        } catch (e) {
          setFetchedCustomer(null);
        }
      } else {
        setFetchedCustomer(null);
      }
    };
    checkCustomer();
  }, [detailsModal.open, detailsModal.order]);

  // --- PRINT LOGIC ---
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${selectedOrderForPrint?.order_number || "Order"}`,
    onAfterPrint: () => setSelectedOrderForPrint(null),
  });

  useEffect(() => {
    if (selectedOrderForPrint && invoiceRef.current) {
      handlePrint();
    }
  }, [selectedOrderForPrint, handlePrint]);

  // --- FETCH DATA ---
  const { data: serverData, isLoading } = useQuery({
    queryKey: ["admin-orders", activeTab, page, searchQuery],
    queryFn: () => {
      const status =
        tabs[activeTab] === "All order" ? "" : tabs[activeTab].toUpperCase();
      return getAllOrdersService({
        page,
        limit: 10,
        status,
        search: searchQuery,
        refresh: true,
      });
    },
  });

  const { data: tabCountsData } = useQuery({
    queryKey: ["order-tab-counts"],
    queryFn: () => fetchOrderCounts(tabs),
    refetchOnWindowFocus: true,
  });

  const orderList = serverData?.data?.data || [];
  const meta = serverData?.data?.meta || { totalPages: 1, total: 0 };
  const counts =
    tabCountsData?.reduce(
      (acc: Record<string, number>, curr: { tab: string; count: number }) => ({
        ...acc,
        [curr.tab]: curr.count,
      }),
      {},
    ) || {};

  // --- MUTATIONS ---
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderStatusPayload;
    }) => updateOrderStatusService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
      toast.success("Sync successful.");
      setActiveMenuId(null);
      setShippedModal({ open: false, id: null });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      customerApi.updateStatus(userId, "blocked"),
    onSuccess: () => {
      toast.success("Blocked.");
      setActiveMenuId(null);
    },
  });

  const handleSmartBlockUser = async (order: Order) => {
    if (!confirm(`Block ${order.customer_name}?`)) return;
    if (order.source === "admin_panel") {
      const res = await customerApi.getAll(1, 1, order.customer_phone);
      const target = res?.data?.data?.[0];
      if (target?.id) blockUserMutation.mutate({ userId: target.id });
      else toast.error("No account found.");
    } else {
      blockUserMutation.mutate({ userId: order.user_id });
    }
  };

  const handleSearch = debounce((val: string) => {
    setSearchQuery(val);
    setPage(1);
  }, 500);

  useEffect(() => {
    const close = () => {
      setActiveMenuId(null);
      setShowStatusMenu(false);
    };
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, []);

  const columns = [
    {
      header: "Order Id",
      key: "order_number",
      render: (item: Order) => (
        <span
          onClick={() => openDetails(item)}
          className="font-medium text-[14px] cursor-pointer hover:text-[#1DA1F2] transition-colors"
        >
          {item.order_number}
        </span>
      ),
    },
    {
      header: "Product",
      key: "product",
      render: (item: Order) => {
        const firstItem = item.order_items?.[0];
        return (
          <div
            onClick={() => openDetails(item)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Image
              src={getImgUrl(firstItem?.product?.images?.[0])}
              alt="product image"
              width={40}
              height={40}
              unoptimized
              className="rounded-lg object-cover bg-gray-50 p-1 group-hover:border-[#1DA1F2] transition-all"
            />
            <div className="flex flex-col">
              <span className="truncate max-w-[150px] text-[14px] font-medium text-black group-hover:text-[#1DA1F2] transition-colors">
                {firstItem?.product_name || "Untitled"}
              </span>
              {item.order_items?.length > 1 && (
                <span className="text-[10px] text-[#1DA1F2] font-bold">
                  +{item.order_items.length - 1} more items
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      key: "customer",
      render: (item: Order) => (
        <div onClick={() => openDetails(item)} className="cursor-pointer">
          <p className="font-medium text-[14px] text-black">
            {item.customer_name}
          </p>
          <p className="text-[12px] text-gray-500">{item.customer_phone}</p>
        </div>
      ),
    },
    {
      header: "Date",
      key: "date",
      render: (item: Order) => (
        <div
          onClick={() => openDetails(item)}
          className="text-[13px] text-black cursor-pointer"
        >
          <p>{new Date(item.created_at).toLocaleDateString()}</p>
          <p className="text-gray-400 font-normal">
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (item: Order) => {
        const totalValue =
          Number(item.total_bill) ||
          Number(item.total_amount_due || 0) +
            Number(item.advance_amount || 0) +
            Number(item.discount_amount || 0) ||
          Number(item.total_amount || 0);
        const remainingDue = Number(item.total_amount_due);

        return (
          <div
            onClick={() => openDetails(item)}
            className="cursor-pointer space-y-0.5"
          >
            <span className="font-semibold text-[14px] text-black block">
              ৳{totalValue}
            </span>
            {remainingDue > 0 && remainingDue !== totalValue && (
              <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                Due: ৳{remainingDue}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (item: Order) => {
        const config = getStatusConfig(item.status);
        const IconComponent = config.icon;
        return (
          <div
            onClick={() => openDetails(item)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[13px] font-semibold cursor-pointer transition-all ${config.className}`}
          >
            <IconComponent size={15} className={config.iconColor} />
            <span className="capitalize">{config.label}</span>
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      render: (order: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const menuHeight = 240;
            const spaceBelow = window.innerHeight - rect.bottom;
            const opensUpward = spaceBelow < menuHeight;
            const top = opensUpward
              ? Math.max(10, rect.top - menuHeight)
              : rect.bottom + 8;
            const left = Math.max(
              10,
              Math.min(window.innerWidth - 220, rect.left - 165),
            );
            setMenuPos({ top, left, opensUpward });
            setActiveMenuId(activeMenuId === order.id ? null : order.id);
            setShowStatusMenu(false);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <MoreVertical size={20} />
        </button>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#1DA1F2]" />
        <span className="text-xs text-gray-400">Loading order dataset...</span>
      </div>
    );

  return (
    <div className="w-full font-lato">
      <div className="bg-white rounded-lg mt-4 relative">
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <TableTabs
            tabs={tabs.map((t) => `${t} (${counts[t] || 0})`)}
            activeTab={activeTab}
            setActiveTab={(idx) => {
              setActiveTab(idx);
              setPage(1);
            }}
          />
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-[316px]">
              <input
                type="text"
                placeholder="Search order report"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-[#F9FAFB] rounded-lg py-2.5 pl-4 pr-10 text-[14px] text-black border border-transparent focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] outline-none transition-all"
              />
              <Search
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]"
                size={20}
              />
            </div>
          </div>
        </div>

        <DataTable data={orderList} columns={columns} rowKey="id" />

        <div className="py-5">
          <Pagination2
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {activeMenuId && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-100 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] py-2 z-[9999] w-[210px] font-lato animate-in fade-in zoom-in duration-150 text-left"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {/* Group 1: Core Actions */}
          <div className="px-2 pb-1.5 border-b border-gray-50 mb-1.5">
            <button
              onClick={() =>
                router.push(`/admin/dashboard/order/add?id=${activeMenuId}`)
              }
              className="cursor-pointer w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
            >
              <Edit
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">Edit Order</span>
            </button>

            {/* <button 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
      >
        <Percent size={16} className="text-gray-400 group-hover:text-[#1DA1F2]" /> 
        <span className="font-medium">Apply Discount</span>
      </button> */}
          </div>

          {/* Group 2: View & Output */}
          <div className="px-2 pb-1.5 border-b border-gray-50 mb-1.5">
            <button
              onClick={() => {
                const o = orderList.find((x: Order) => x.id === activeMenuId);
                setSelectedOrderForPrint(o);
                setActiveMenuId(null);
              }}
              className="cursor-pointer w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
            >
              <Printer
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">Print Invoice</span>
            </button>

            <button
              onClick={() => {
                const o = orderList.find((x: Order) => x.id === activeMenuId);
                openDetails(o);
              }}
              className="cursor-pointer w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
            >
              <FileText
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">View Details</span>
            </button>

            {/* <button 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
      >
        <Copy size={16} className="text-gray-400 group-hover:text-[#1DA1F2]" /> 
        <span className="font-medium">Duplicate Order</span>
      </button> */}
          </div>

          {/* Group 3: Status Management */}
          <div className="px-2 pb-1.5 border-b border-gray-50 mb-1.5">
            <div className="relative group/status">
              <button
                onMouseEnter={() => setShowStatusMenu(true)}
                className={`w-full cursor-pointer flex items-center justify-between px-3 py-2 text-[14px] rounded-lg transition-colors ${showStatusMenu ? "bg-blue-50 text-[#1DA1F2]" : "text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2]"}`}
              >
                <div className="flex items-center gap-3">
                  <RefreshCw
                    size={16}
                    className={
                      showStatusMenu ? "text-[#1DA1F2]" : "text-gray-400"
                    }
                  />
                  <span className="font-medium">Update Status</span>
                </div>
                <ChevronLeft size={14} className="opacity-50" />
              </button>

              {showStatusMenu && (
                <div
                  className={`absolute right-full mr-2 w-[180px] bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[10000] animate-in fade-in slide-in-from-right-2 duration-150 ${
                    menuPos.opensUpward ? "bottom-0" : "top-[-10px]"
                  }`}
                  onMouseLeave={() => setShowStatusMenu(false)}
                >
                  <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Select Status
                  </p>
                  {[
                    "PENDING",
                    "CONFIRMED",
                    "ON_HOLD",
                    "SHIPPED",
                    "SENT_TO_COURIER",
                    "DELIVERED",
                    "CANCELED",
                    "RETURNED",
                    "REFUNDED",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        s === "SENT_TO_COURIER"
                          ? setShippedModal({ open: true, id: activeMenuId })
                          : statusMutation.mutate({
                              id: activeMenuId!,
                              payload: { status: s },
                            })
                      }
                      className="w-full cursor-pointer text-left px-4 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1DA1F2] transition-colors"
                    >
                      {s.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Group 4: Dangerous Actions */}
          <div className="px-2">
            <button
              onClick={() => {
                const o = orderList.find((x: Order) => x.id === activeMenuId);
                if (o) handleSmartBlockUser(o);
              }}
              className="w-full cursor-pointer text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg flex items-center gap-3 transition-colors group"
            >
              <UserX
                size={16}
                className="text-gray-400 group-hover:text-amber-600"
              />
              <span className="font-medium">Block User</span>
            </button>

            <button className="w-full cursor-pointer text-left px-3 py-2.5 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors group mt-0.5">
              <Trash2
                size={16}
                className="text-rose-400 group-hover:text-rose-600"
              />
              <span className="font-bold">Delete Order</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden component for printing */}
      <div className="hidden">
        <InvoicePrint
          ref={invoiceRef}
          order={selectedOrderForPrint}
          baseStorageUrl={baseStorageUrl}
        />
      </div>

      {/* --- DETAILS MODAL WITH CUSTOMER IMAGE --- */}
      {detailsModal.open &&
        detailsModal.order &&
        (console.log(detailsModal.order),
        (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden font-lato flex flex-col text-left">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1DA1F2]/10 p-2 rounded-lg text-[#1DA1F2]">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#023337]">
                      Order Summary
                    </h3>
                    <p className="text-xs text-gray-500 font-medium font-poppins">
                      #{detailsModal.order.order_number}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailsModal({ open: false, order: null })}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 🚀 Updated Customer Card with Profile Image */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0">
                      {fetchedCustomer?.avatar ? (
                        <Image
                          src={getImgUrl(fetchedCustomer.avatar)}
                          className="w-11 h-11 object-cover"
                          width={100}
                          height={100}
                          alt="profile"
                          unoptimized
                        />
                      ) : (
                        <div className="w-11 h-11 flex items-center justify-center text-blue-500">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Customer
                      </p>
                      <p className="font-bold text-[#023337]">
                        {detailsModal.order.customer_name}
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">
                        {detailsModal.order.customer_phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-500">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Address
                      </p>
                      <p className="text-sm font-medium text-gray-700 leading-tight">
                        {detailsModal.order.customer_address}
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-purple-500">
                      <Info size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        Status
                      </p>
                      <p className="text-sm font-bold text-purple-700 uppercase">
                        {detailsModal.order.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        via {detailsModal.order.source}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Table and Financials ... (unchanged logic) */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F9FAFB] text-sm font-medium text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Price</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {detailsModal.order.order_items.map((item: OrderItem) => (
                        <tr key={item.id} className="text-sm">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <Image
                              src={getImgUrl(item.product?.images?.[0])}
                              className="w-10 h-10 rounded-md border object-cover"
                              width={100}
                              height={100}
                              alt="profile"
                              unoptimized
                            />
                            <span className="font-bold text-gray-700">
                              {item.product_name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-poppins">
                            ৳{item.unit_price}
                          </td>
                          <td className="px-4 py-3 text-center font-bold font-poppins">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#1DA1F2] font-poppins">
                            ৳{Number(item.unit_price) * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col md:row justify-between gap-6">
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-tighter">
                      Internal Note
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {detailsModal.order.customer_note || "N/A"}
                    </p>
                  </div>
                  <div className="w-full md:w-80 space-y-2 font-poppins">
                    {/* Payment Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">
                        Payment Status
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          detailsModal.order.payment_status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : detailsModal.order.payment_status === "PARTIAL"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {detailsModal.order.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-black">
                        ৳
                        {detailsModal.order.order_items.reduce(
                          (acc, item) =>
                            acc + Number(item.unit_price) * item.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className="font-bold text-black">
                        ৳{detailsModal.order.shipping_fee}
                      </span>
                    </div>
                    <div className="flex justify-between text-rose-500">
                      <span>Discount</span>
                      <span className="font-bold">
                        - ৳{detailsModal.order.discount_amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#023337] border-t pt-2 mt-2">
                      <span>Total Due</span>
                      <span>৳{detailsModal.order.total_amount_due}</span>
                    </div>
                    {Number(detailsModal.order.advance_amount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Advance Paid</span>
                        <span className="font-bold">
                          ৳{detailsModal.order.advance_amount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Shipped Modal ... (unchanged logic) */}
      {shippedModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#023337] mb-5">
              Dispatch to Courier
            </h3>
            <div className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Select Provider
                </label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                  value={courierInfo.courierName}
                  onChange={(e) =>
                    setCourierInfo({
                      ...courierInfo,
                      courierName: e.target.value,
                    })
                  }
                >
                  <option value="">-- Choose Courier --</option>
                  <option value="STEADFAST">Steadfast (Automatic)</option>
                  <option value="PATHAO">Pathao (Automatic)</option>
                  <option value="REDX">RedX (Automatic)</option>
                  <option value="MANUAL">Manual Entry</option>
                </select>
              </div>
              {courierInfo.courierName === "MANUAL" && (
                <div className="space-y-1 animate-in slide-in-from-top-1 text-left">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Manual Tracking Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
                    onChange={(e) =>
                      setCourierInfo({
                        ...courierInfo,
                        trackingCode: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShippedModal({ open: false, id: null })}
                  className="cursor-pointer flex-1 py-3 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    !courierInfo.courierName || statusMutation.isPending
                  }
                  onClick={() =>
                    statusMutation.mutate({
                      id: shippedModal.id!,
                      payload: { status: "SENT_TO_COURIER", ...courierInfo },
                    })
                  }
                  className="cursor-pointer flex-1 py-3 bg-[#1DA1F2] text-white rounded-lg font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300"
                >
                  {statusMutation.isPending ? (
                    <Loader2 className="animate-spin mx-auto" size={20} />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

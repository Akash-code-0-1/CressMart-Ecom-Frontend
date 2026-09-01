"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
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
  ExternalLink,
  MessageSquareText,
  UserCheck,
  Ban,
} from "lucide-react";
import Image from "next/image";
import { extractImageUrl } from "@/utils/image";
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
import {
  deleteIncompleteOrderService,
  getAllIncompleteOrdersService,
} from "@/services-api/incompleteOrderService";
import { apiFetch } from "@/utils/api";
import React from "react";

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
  // 🚀 Safe check to prevent "Cannot read properties of undefined (reading 'replace')"
  if (!status) {
    return {
      label: "Unknown",
      icon: Info,
      className: "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100",
      iconColor: "text-gray-400",
    };
  }

  const upper = status.toUpperCase();
  switch (upper) {
    case "PENDING":
      return {
        label: "Pending",
        icon: Clock,
        className:
          "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        iconColor: "text-amber-500",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className:
          "bg-blue-50 text-[#1DA1F2] border-blue-200 hover:bg-blue-100",
        iconColor: "text-[#1DA1F2]",
      };
    case "ON_HOLD":
      return {
        label: "On Hold",
        icon: PauseCircle,
        className:
          "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        iconColor: "text-orange-500",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        icon: Truck,
        className:
          "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
        iconColor: "text-purple-500",
      };
    case "SENT_TO_COURIER":
      return {
        label: "Sent to Courier",
        icon: Truck,
        className:
          "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        iconColor: "text-indigo-500",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        icon: PackageCheck,
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
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
        className:
          "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
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
        label: status ? status.replace(/_/g, " ") : "N/A",
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

export const BulkInvoicePrint = React.forwardRef(
  ({ orders, baseStorageUrl }: any, ref: any) => {
    return (
      <div ref={ref} className="p-0">
        {orders.map((order: any, index: number) => (
          <div key={order.id} style={{ pageBreakAfter: "always" }}>
            <InvoicePrint order={order} baseStorageUrl={baseStorageUrl} />
          </div>
        ))}
      </div>
    );
  },
);
BulkInvoicePrint.displayName = "BulkInvoicePrint";

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
    "Incomplete",
    "Delivered",
    "Canceled",
    "Returned",
  ];

  // Helper logic to prevent routing errors
  const isIncompleteTab = tabs[activeTab] === "Incomplete";

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
    targetStatus?: string | null;
  }>({ open: false, id: null });
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    order: any | null;
  }>({ open: false, order: null });

  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<
    any | null
  >(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  // --- HELPERS ---
  const openDetails = (order: any) => {
    setDetailsModal({ open: true, order });
    setActiveMenuId(null);
  };

  // 1. Identify the products that need to be fetched for the modal
  const modalItems = useMemo(() => {
    if (!detailsModal.open || !detailsModal.order || !isIncompleteTab)
      return [];
    return detailsModal.order.cart_items || [];
  }, [detailsModal.open, detailsModal.order, isIncompleteTab]);

  // 2. Fetch details for each item
  const resolvedModalProducts = useQueries({
    queries: modalItems.map((item: any) => ({
      queryKey: ["product-metadata", item.productId],
      queryFn: async () => {
        const res = await apiFetch(`/products/${item.productId}`, {
          method: "GET",
        });
        const json = await res.json();
        // Ensure we return an object, even if empty, to satisfy the type
        return (json.data || json) as Record<string, any>;
      },
      enabled: detailsModal.open && !!item.productId,
    })),
  });

  // 3. THE FIX: Cast query.data as any or a specific type to access .id
  const productDetailsMap = useMemo(() => {
    const map: Record<string, any> = {};
    resolvedModalProducts.forEach((query) => {
      // Use type assertion (as any) or check if it's an object with id
      const product = query.data as Record<string, any>;
      if (product && product.id) {
        map[product.id] = product;
      }
    });
    return map;
  }, [resolvedModalProducts]);

  const getImgUrl = (rawImg: any) => {
    return extractImageUrl(rawImg) || "/images/products/product2.png";
  };

  const fetchedCustomer = detailsModal.order
    ? {
        avatar:
          detailsModal.order.customer_image ||
          detailsModal.order.customer?.profile?.image ||
          detailsModal.order.customer?.avatar ||
          undefined,
        name: detailsModal.order.customer_name,
        phone: detailsModal.order.customer_phone,
      }
    : null;

  // --- FETCH DATA ---
  // const { data: serverData, isLoading } = useQuery({
  //   queryKey: ["admin-orders", tabs[activeTab], page, searchQuery],
  //   queryFn: async () => {
  //     if (isIncompleteTab) {
  //       // Hits: /incomplete-orders -> Returns { meta, data }
  //       return await getAllIncompleteOrdersService({ page, limit: 10 });
  //     }

  //     // Hits: /orders -> Returns { data: { meta, data } }
  //     const status =
  //       tabs[activeTab] === "All order" ? "" : tabs[activeTab].toUpperCase();
  //     return await getAllOrdersService({
  //       page,
  //       limit: 10,
  //       status,
  //       search: searchQuery,
  //       refresh: true,
  //     });
  //   },
  //   // This keeps the UI stable while switching tabs
  //   placeholderData: (previousData) => previousData,
  // });

  const { data: serverData, isLoading } = useQuery({
    queryKey: ["admin-orders", tabs[activeTab], page, searchQuery],
    queryFn: async () => {
      // 🔥 Simplified: All tabs now use the same service
      const currentTabText = tabs[activeTab];
      let status = "";

      if (currentTabText === "All order") {
        status = ""; // Backend returns all including Incomplete
      } else {
        status = currentTabText.toUpperCase();
      }

      return await getAllOrdersService({
        page,
        limit: 10,
        status: status,
        search: searchQuery,
        refresh: true,
      });
    },
    placeholderData: (previousData) => previousData,
  });

  // 🚀 THE FIX: Universal Data Extractor
  // This logic looks for the array [...] no matter where the API hides it.
  const orderList = useMemo(() => {
    if (!serverData) return [];

    // 1. Check if it's the Regular Order structure: serverData.data.data
    if (serverData.data && Array.isArray(serverData.data.data)) {
      return serverData.data.data;
    }

    // 2. Check if it's the Incomplete Order structure: serverData.data
    if (Array.isArray(serverData.data)) {
      return serverData.data;
    }

    // 3. Fallback if the whole object is the array (unlikely but safe)
    if (Array.isArray(serverData)) {
      return serverData;
    }

    return []; // Always return an array to prevent .map() crash
  }, [serverData]);

  // 🚀 THE FIX: Universal Meta Extractor
  const meta = useMemo(() => {
    // Look for meta in serverData.data (Regular) or serverData (Incomplete)
    const m = serverData?.data?.meta || serverData?.meta;
    return m || { totalPages: 1, total: 0 };
  }, [serverData]);

  // --- FIXED FETCH TAB COUNTS ---
  // const { data: tabCountsData } = useQuery({
  //   queryKey: ["order-tab-counts"],
  //   queryFn: async () => {
  //     // 1. Fetch standard counts from the regular Order Service
  //     const standardTabs = tabs.filter((t) => t !== "Incomplete");
  //     const standardCounts = await fetchOrderCounts(standardTabs);

  //     // 2. Fetch Incomplete count from the Incomplete Order Service
  //     // We set limit to 1 because we only care about the meta.total field
  //     let incompleteCount = 0;
  //     try {
  //       const leadRes = await getAllIncompleteOrdersService({
  //         page: 1,
  //         limit: 1,
  //       });
  //       // Based on your backend, total is inside meta
  //       incompleteCount =
  //         leadRes?.meta?.total || leadRes?.data?.meta?.total || 0;
  //     } catch (e) {
  //       console.error("Failed to fetch incomplete counts", e);
  //     }

  //     // 3. Return the merged array
  //     return [...standardCounts, { tab: "Incomplete", count: incompleteCount }];
  //   },
  //   refetchOnWindowFocus: true,
  // });

  // Update the counts fetcher to be simpler
  const { data: tabCountsData } = useQuery({
    queryKey: ["order-tab-counts"],
    queryFn: () => fetchOrderCounts(tabs), // Uses the updated service above
    refetchOnWindowFocus: true,
  });

  // This converts the array into a Map so the UI can find the counts easily
  // const counts = useMemo(() => {
  //   return (
  //     tabCountsData?.reduce(
  //       (acc: any, curr: any) => ({
  //         ...acc,
  //         [curr.tab]: curr.count,
  //       }),
  //       {},
  //     ) || {}
  //   );
  // }, [tabCountsData]);

  const counts = useMemo(() => {
    return (
      tabCountsData?.reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr.tab]: curr.count,
        }),
        {},
      ) || {}
    );
  }, [tabCountsData]);

  // --- MUTATIONS ---
  const statusMutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateOrderStatusService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
      toast.success("Sync successful.");
      setActiveMenuId(null);
      setShippedModal({ open: false, id: null });
    },
  });

  const handleSearch = debounce((val: string) => {
    setSearchQuery(val);
    setPage(1);
  }, 500);

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteIncompleteOrderService(id),
    onSuccess: () => {
      // Refresh the list and the counts
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
      toast.success("Lead removed successfully");
      setActiveMenuId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete");
    },
  });

  const [courierMethod, setCourierMethod] = useState<"AUTO" | "MANUAL">("AUTO");

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // Note: newer versions use contentRef instead of content
    documentTitle: `Invoice_${selectedOrderForPrint?.order_number || "Order"}`,
    onAfterPrint: () => setSelectedOrderForPrint(null),
  });

  useEffect(() => {
    // Only trigger if we have an order AND the ref is actually attached to a DOM element
    if (selectedOrderForPrint && invoiceRef.current) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 250); // Increased delay slightly to ensure DOM is ready
      return () => clearTimeout(timer);
    }
  }, [selectedOrderForPrint, handlePrint]);

  const getTrackingUrl = (code: string, provider: string) => {
    if (!code) return null;
    const p = provider?.toLowerCase() || "";
    if (p.includes("steadfast")) return `https://steadfast.com.bd/t/${code}`;
    if (p.includes("pathao"))
      return `https://pathao.com/courier-tracking?tracking_code=${code}`;
    if (p.includes("redx"))
      return `https://redx.com.bd/track-order/?trackingId=${code}`;
    if (p.includes("paperfly"))
      return `https://www.paperfly.com.bd/tracking.php?tracking_number=${code}`;
    return null;
  };

  const isLead = (item: any) => !!item.cart_items && !item.order_items;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
        setShowStatusMenu(false);
      }
    };

    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  // 1. Add Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 2. Add Toggle Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === orderList.length) setSelectedIds([]);
    else setSelectedIds(orderList.map((o: any) => o.id));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 3. Setup Bulk Printing
  const bulkInvoiceRef = useRef<HTMLDivElement>(null);
  const handleBulkPrint = useReactToPrint({
    contentRef: bulkInvoiceRef,
    documentTitle: "Bulk_Invoices",
  });


  // 1. Add new state for Comment Modal
const [commentModal, setCommentModal] = useState<{
  open: boolean;
  id: string | null;
  text: string;
}>({ open: false, id: null, text: "" });

// 2. Define the save handler
const handleSaveComment = () => {
  if (commentModal.id) {
    statusMutation.mutate({
      id: commentModal.id,
      payload: { order_comment: commentModal.text },
    });
    setCommentModal({ open: false, id: null, text: "" });
  }
};

const userStatusMutation = useMutation({
  mutationFn: ({ userId, status }: { userId: string; status: string }) =>
    customerApi.updateStatus(userId, status),
  onSuccess: () => {
    // This tells React Query to delete the old data and ask the server for new data
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    toast.success("User status updated");
    setActiveMenuId(null);
  },
});


  const columns: any[] = [
    {
      header: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={
            selectedIds.length === orderList.length && orderList.length > 0
          }
        />
      ),
      key: "checkbox",
      render: (item: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => toggleSelectRow(item.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      header: "No.",
      key: "index",
      render: (_: any, index: number) => (
        <span className="text-gray-500 font-medium">
          {(page - 1) * 10 + index + 1}
        </span>
      ),
    },
    // {
    //   header: isIncompleteTab ? "Lead ID" : "Order Id",
    //   key: "id",
    //   render: (item: any) => (
    //     <span
    //       onClick={() => openDetails(item)}
    //       className="font-bold text-[13px] cursor-pointer text-gray-800 hover:text-[#1DA1F2]"
    //     >
    //       {isIncompleteTab ? `LEAD-${item.id.slice(0, 8)}` : item.order_number}
    //     </span>
    //   ),
    // },

{
  header: isIncompleteTab ? "Lead ID" : "Order Id",
  key: "id",
  render: (item: any) => (
    <div className="flex items-center gap-2">
      <span
        onClick={() => openDetails(item)}
        className="font-bold text-[13px] cursor-pointer text-gray-800 hover:text-[#1DA1F2]"
      >
        {isIncompleteTab ? `LEAD-${item.id.slice(0, 8)}` : item.order_number}
      </span>
      
      {/* Show an icon if a comment exists */}
      {item.order_comment && (
        <div title={item.order_comment} className="cursor-help">
          <Info size={14} className="text-amber-500" />
        </div>
      )}
    </div>
  ),
},
{
  header: "Product",
  key: "product",
  render: (item: any) => {
    // 🚀 FIX: Look for order_items first. If empty, try cart_items.
    // This ensures it works even if the backend structure varies.
    const items = (item.order_items && item.order_items.length > 0) 
      ? item.order_items 
      : (item.cart_items || []);

    const first = items[0];
    
    // If no items at all, show placeholder
    if (!first) return <span className="text-gray-400 text-[12px]">No Items</span>;

    const productInfo = first?.product || {};

    // Comprehensive image fallback
    const img =
      productInfo.images?.[0] ||
      productInfo.featuredImage ||
      first?.product_image || // standard
      first?.image ||         // fallback
      first?.external_image || // lead/incomplete
      first?.externalImage ||  // lead/incomplete
      first?.variant?.images?.[0];

    // Comprehensive name fallback
    const name =
      productInfo.name ||
      first?.product_name ||
      first?.externalName ||
      first?.external_name ||
      "Untitled Product";

    return (
      <div className="flex items-center gap-2">
        <Image
          src={getImgUrl(img)}
          alt="p"
          width={38}
          height={38}
          unoptimized
          className="rounded bg-white p-0.5 border border-gray-100"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate max-w-[130px] text-[12px] font-bold text-gray-700">
            {name}
          </span>
          {items.length > 1 && (
            <span className="text-[10px] text-[#1DA1F2] font-bold">
              +{items.length - 1} more items
            </span>
          )}
        </div>
      </div>
    );
  },
},
    // {
    //   header: "Customer Info",
    //   key: "customer",
    //   render: (item: any) => (
    //     <div className="text-[12px]">
    //       <p className="font-bold text-gray-900 leading-tight">
    //         {item.customer_name || "Guest"}
    //       </p>
    //       <p className="text-gray-500">{item.customer_phone || "N/A"}</p>
    //     </div>
    //   ),
    // },

{
  header: "Customer Info",
  key: "customer",
  render: (item: any) => {
    const isBlocked = item.user?.status === "blocked";
    return (
      <div className="text-[12px]">
        <div className="flex items-center gap-1.5">
          <p className={`font-bold leading-tight ${isBlocked ? "text-rose-600" : "text-gray-900"}`}>
            {item.customer_name || "Guest"}
          </p>
          {/* 🔥 This is the visual indication */}
          {isBlocked && (
            <span className="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
              Blocked
            </span>
          )}
        </div>
        <p className="text-gray-500">{item.customer_phone || "N/A"}</p>
      </div>
    );
  },
},
    {
      header: "Date",
      key: "created_at",
      render: (item: any) => (
        <div className="text-[11px] leading-tight text-gray-600">
          <p className="font-bold text-gray-800">
            {new Date(item.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      key: "amount",
      render: (item: any) => {
        // 1. Check total_amount_due (Standard for regular orders)
        // 2. Check total_amount (Standard for incomplete leads)
        // 3. Check total_bill (Standard for some calculated views)
        const displayPrice = Number(item.total_amount_due || 0);

        return (
          <span className="font-bold text-[13px] text-gray-900 font-poppins">
            ৳{displayPrice.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Supplier",
      key: "supplier",
      render: (item: any) => {
        const items = isIncompleteTab
          ? item.cart_items || []
          : item.order_items || [];

        const firstItem = items[0];

        // 1. Identify the Supplier name
        let supplierName = "Own Product"; // Default

        if (isIncompleteTab) {
          // Check metadata fetched for incomplete leads
          const resolved = productDetailsMap[firstItem?.productId];
          if (resolved?.isExternal || firstItem?.isExternal) {
            supplierName = resolved?.supplier_name || "Mohashagor";
          }
        } else {
          // Check regular order items
          // In your backend, external items usually have external_product_id
          if (firstItem?.external_product_id || firstItem?.isExternal) {
            supplierName = firstItem?.supplier_name || "Mohashagor";
          } else if (
            item.source &&
            !["direct", "admin_panel", "system"].includes(
              item.source.toLowerCase(),
            )
          ) {
            // If the source itself is the supplier name
            supplierName = item.source;
          }
        }

        // 2. Define colors based on supplier type
        const isOwn =
          supplierName.toLowerCase() === "own product" ||
          supplierName.toLowerCase() === "system";

        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
              isOwn
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "bg-orange-50 text-orange-600 border border-orange-100"
            }`}
          >
            {supplierName}
          </span>
        );
      },
    },
    // {
    //   header: "Status",
    //   key: "status",
    //   render: (item: any) => {
    //     const config = getStatusConfig(
    //       isIncompleteTab ? "PENDING" : item.status,
    //     );
    //     return (
    //       <div
    //         className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${config.className}`}
    //       >
    //         <config.icon size={12} className={config.iconColor} />
    //         <span>{isIncompleteTab ? "Abandoned" : config.label}</span>
    //       </div>
    //     );
    //   },
    // },

    {
      header: "Status",
      key: "status",
      render: (item: any) => {
        // Check if the individual item is incomplete, regardless of which tab you are in
        const isActuallyIncomplete = item.status === "INCOMPLETE";

        if (isActuallyIncomplete) {
          return (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold bg-gray-50 text-gray-400 border-gray-200">
              <Clock size={12} className="text-gray-400" />
              <span>Incomplete</span>
            </div>
          );
        }

        const config = getStatusConfig(item.status);
        return (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${config.className}`}
          >
            <config.icon size={12} className={config.iconColor} />
            <span>{config.label}</span>
          </div>
        );
      },
    },
    {
      header: "Track ID",
      key: "tracking_code",
      render: (item: any) => {
        const code = item.tracking_code || item.trackingCode;
        const url = getTrackingUrl(code, item.courier_name || item.courierName);
        if (!code) return <span className="text-gray-300 text-[11px]">-</span>;
        return (
          <a
            href={url || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#1DA1F2] hover:underline font-bold text-[12px]"
          >
            {code} <ExternalLink size={10} />
          </a>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      render: (order: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPos({
              top: rect.bottom + 8,
              left: rect.left - 165,
              opensUpward: false,
            });
            setActiveMenuId(activeMenuId === order.id ? null : order.id);
            setShowStatusMenu(false);
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} className="text-gray-400" />
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

          {/* --- CONDITIONALLY HIDE SEARCH BAR --- */}
          {!isIncompleteTab && (
            <div className="relative flex-grow lg:w-[316px] animate-in fade-in duration-200">
              <input
                type="text"
                placeholder="Search orders..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-[#F9FAFB] rounded-lg py-2.5 pl-4 pr-10 text-[14px] text-black border border-transparent focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] outline-none transition-all"
              />
              <Search
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          )}
        </div>

        <DataTable data={orderList} columns={columns} rowKey="id" />

        {/* <div className="py-5">
          <Pagination2
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div> */}

        <div className="py-5">
          <Pagination2
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            selectedCount={selectedIds.length}
            onPrintMultiple={handleBulkPrint}
          />
        </div>

        {/* Hidden Bulk Print Component */}
        <div style={{ display: "none" }}>
          <BulkInvoicePrint
            ref={bulkInvoiceRef}
            orders={orderList.filter((o: any) => selectedIds.includes(o.id))}
            baseStorageUrl={baseStorageUrl}
          />
        </div>
      </div>

      {/* --- PROFESSIONAL ACTION MENU --- */}
      {activeMenuId && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-[9999] w-[210px] animate-in fade-in zoom-in duration-150"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {/* Group 1: Core Actions */}
          {!isIncompleteTab && (
            <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
              <button
                onClick={() =>
                  router.push(`/admin/dashboard/order/add?id=${activeMenuId}`)
                }
                className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-gray-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <Edit
                  size={16}
                  className="text-gray-400 group-hover:text-[#1DA1F2]"
                />
                <span className="font-medium">Edit Order</span>
              </button>
            </div>
          )}

<button
  onClick={() => {
    const o = orderList.find((x: any) => x.id === activeMenuId);
    setCommentModal({
      open: true,
      id: activeMenuId,
      text: o?.order_comment || "",
    });
    setActiveMenuId(null);
  }}
  className="w-full ml-2 text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-gray-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
>
  <MessageSquareText 
    size={18} 
    className="text-gray-400 group-hover:text-[#1DA1F2] transition-colors" 
  />
  <span className="font-medium">Comment</span>
</button>

          {/* Group 2: View & Output */}
          <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
            {!isIncompleteTab && (
              <button
                onClick={() => {
                  const o = orderList.find((x: any) => x.id === activeMenuId);
                  if (o) setSelectedOrderForPrint(o);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-gray-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <Printer
                  size={16}
                  className="text-gray-400 group-hover:text-[#1DA1F2]"
                />
                <span className="font-medium">Print Invoice</span>
              </button>
            )}

            <button
              onClick={() => {
                const o = orderList.find((x: any) => x.id === activeMenuId);
                openDetails(o);
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-gray-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <FileText
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">View Details</span>
            </button>
          </div>

          {/* Group 3: Status Management (With Hover-Out logic) */}
          {!isIncompleteTab && (
            <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
              <div
                className="relative"
                onMouseLeave={() => setShowStatusMenu(false)} // Close when mouse leaves the entire area
              >
                <button
                  onMouseEnter={() => setShowStatusMenu(true)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[14px] rounded-lg transition-colors cursor-pointer ${
                    showStatusMenu
                      ? "bg-blue-50 text-[#1DA1F2]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
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
                  <ChevronLeft
                    size={14}
                    className={`transition-transform ${showStatusMenu ? "rotate-180 text-[#1DA1F2]" : "opacity-50"}`}
                  />
                </button>

                {showStatusMenu && (
                  <div className="absolute right-full top-[-8px] mr-1 w-[180px] bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-[10000] animate-in fade-in slide-in-from-right-2 duration-200">
                    {[
                      "PENDING",
                      "CONFIRMED",
                      "ON_HOLD",
                      "SHIPPED",
                      "DELIVERED",
                      "CANCELED",
                      "RETURNED",
                      "REFUNDED",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          if (s === "SHIPPED") {
                            setShippedModal({
                              open: true,
                              id: activeMenuId,
                              targetStatus: s,
                            });
                            setActiveMenuId(null);
                          } else {
                            statusMutation.mutate({
                              id: activeMenuId!,
                              payload: { status: s },
                            });
                            setActiveMenuId(null);
                          }
                          setShowStatusMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1DA1F2] cursor-pointer transition-colors font-medium"
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}



{(() => {
  // Ensure we find the order from the current 'orderList' which is updated after mutation
  const currentOrder = orderList.find((o: any) => o.id === activeMenuId);
  const userId = currentOrder?.user_id;
  
  // Use the status directly from the fresh user object returned by backend
  const userStatus = currentOrder?.user?.status; 

  if (!userId) return null;

  return (
    <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
      {userStatus === "blocked" ? (
        <button
          key="activate-btn"
          onClick={() => userStatusMutation.mutate({ userId, status: "active" })}
          className="w-full text-left px-3 py-2 text-[14px] text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-3 transition-colors font-medium cursor-pointer"
        >
          <UserCheck size={16} className="text-emerald-500" />
          <span>Activate Profile</span>
        </button>
      ) : (
        <button
          key="block-btn"
          onClick={() => {
            if (window.confirm("Block this user from future orders?")) {
              userStatusMutation.mutate({ userId, status: "blocked" });
            }
          }}
          className="w-full text-left px-3 py-2 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors font-medium cursor-pointer"
        >
          <UserX size={16} className="text-rose-400" />
          <span>Block User</span>
        </button>
      )}
    </div>
  );
})()}

          {/* Group 4: Delete */}
          <div className="px-2">
            <button
              onClick={() => {
                if (!activeMenuId) return;
                const msg = isIncompleteTab ? "Delete lead?" : "Delete order?";
                if (window.confirm(msg)) {
                  if (isIncompleteTab) deleteLeadMutation.mutate(activeMenuId);
                  else toast.error("Not implemented");
                }
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors font-bold cursor-pointer"
            >
              <Trash2 size={16} />
              <span>
                {deleteLeadMutation.isPending
                  ? "Deleting..."
                  : `Delete ${isIncompleteTab ? "Lead" : "Order"}`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden component for printing */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <InvoicePrint
          ref={invoiceRef}
          order={selectedOrderForPrint}
          baseStorageUrl={baseStorageUrl}
        />
      </div>

      {/* --- DETAILS MODAL --- */}
      {detailsModal.open && detailsModal.order && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden font-lato flex flex-col text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F9FAFB]">
              <div className="flex items-center gap-3">
                <div className="bg-[#1DA1F2]/10 p-2 rounded-lg text-[#1DA1F2]">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#023337]">
                    {detailsModal.order.cart_items
                      ? "Incomplete Lead Details"
                      : "Order Summary"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {detailsModal.order.order_number
                      ? `#${detailsModal.order.order_number}`
                      : `LEAD-${detailsModal.order.id.slice(0, 8)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailsModal({ open: false, order: null })}
                className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Card */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 w-11 h-11 flex items-center justify-center">
                    {/* FIXED fetchedCustomer check */}
                    {typeof fetchedCustomer !== "undefined" &&
                    fetchedCustomer?.avatar ? (
                      <Image
                        src={getImgUrl(fetchedCustomer.avatar)}
                        className="w-full h-full object-cover"
                        width={44}
                        height={44}
                        alt="avatar"
                        unoptimized
                      />
                    ) : (
                      <div className="text-blue-500">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Contact
                    </p>
                    <p className="font-bold text-[#023337]">
                      {detailsModal.order.customer_name || "Guest"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {detailsModal.order.customer_phone || "No Phone"}
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
                      {detailsModal.order.customer_address ||
                        "No address provided"}
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
                      {detailsModal.order.status || "Abandoned Cart"}
                    </p>
                    <p className="text-xs text-gray-500">
                      via {detailsModal.order.source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
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
                    {(isIncompleteTab
                      ? detailsModal.order.cart_items
                      : detailsModal.order.order_items || []
                    ).map((item: any, idx: number) => {
                      // --- RESOLUTION LOGIC ---
                      // Look up the fetched data from our useQueries map
                      const resolvedProduct =
                        productDetailsMap[item.productId || item.product?.id];

                      // Determine the Name: Resolved > Saved Name > Placeholder
                      const name =
                        resolvedProduct?.name ||
                        item.product_name ||
                        item.externalName ||
                        "Loading Product...";

                      // Determine the Image: Resolved > Saved Image > Placeholder
                      const img =
                        resolvedProduct?.featuredImage ||
                        resolvedProduct?.images?.[0] ||
                        item.image ||
                        item.product_image ||
                        item.product?.images?.[0] ||
                        item.variant?.images?.[0] ||
                        item.external_image ||
                        item.externalImage;

                      const price = Number(
                        item.price ||
                          item.unit_price ||
                          resolvedProduct?.sell_price ||
                          0,
                      );
                      const qty = Number(item.quantity || item.qty || 1);

                      return (
                        <tr
                          key={idx}
                          className="text-sm hover:bg-gray-50 transition-all"
                        >
                          <td className="px-4 py-3 flex items-center gap-3">
                            <div className="relative w-10 h-10">
                              {/* If loading, show a small spinner overlay on the image area */}
                              {resolvedModalProducts[idx]?.isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-md">
                                  <Loader2
                                    size={12}
                                    className="animate-spin text-blue-500"
                                  />
                                </div>
                              )}
                              <Image
                                src={getImgUrl(img)}
                                className={`w-10 h-10 rounded-md border object-cover transition-opacity ${resolvedModalProducts[idx]?.isLoading ? "opacity-30" : "opacity-100"}`}
                                width={40}
                                height={40}
                                alt="product"
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-700">
                                {name}
                              </span>
                              {resolvedProduct?.sku && (
                                <span className="text-[10px] text-gray-400">
                                  SKU: {resolvedProduct.sku}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-poppins">
                            ৳{price}
                          </td>
                          <td className="px-4 py-3 text-center font-bold font-poppins">
                            {qty}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#1DA1F2] font-poppins">
                            ৳{price * qty}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary */}
              <div className="flex flex-col md:flex-row justify-between gap-6 border-t pt-6 mt-4">
                <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-tighter">
                    Internal Note
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "{detailsModal.order.customer_note || "No notes available."}
                    "
                  </p>
                </div>
                <div className="w-full md:w-80 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">
                      ৳
                      {detailsModal.order.total_amount ||
                        detailsModal.order.total_bill ||
                        0}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#023337] border-t border-dashed pt-2 mt-2">
                    <span>
                      {detailsModal.order.order_number
                        ? "Total Due"
                        : "Estimated Total"}
                    </span>
                    <span>
                      ৳
                      {detailsModal.order.total_amount ||
                        detailsModal.order.total_amount_due ||
                        0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {shippedModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10002] p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl overflow-hidden text-left border border-gray-100">
            {/* Minimal Header */}
            <div className="px-6 py-5 flex justify-between items-center bg-white">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Courier Setup
              </h3>
              <button
                onClick={() => setShippedModal({ open: false, id: null })}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                statusMutation.mutate({
                  id: shippedModal.id,
                  payload: {
                    status: (shippedModal as any).targetStatus,
                    courierName: formData.get("courierName"),
                    trackingCode:
                      courierMethod === "MANUAL"
                        ? formData.get("trackingCode")
                        : "",
                  },
                });
              }}
              className="px-6 pb-8 space-y-6"
            >
              {/* Modern Pill Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCourierMethod("AUTO")}
                  className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                    courierMethod === "AUTO"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  Automatic
                </button>
                <button
                  type="button"
                  onClick={() => setCourierMethod("MANUAL")}
                  className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                    courierMethod === "MANUAL"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  Manual
                </button>
              </div>

              {/* Input Group */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Provider
                  </label>
                  <select
                    name="courierName"
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#FF7050] bg-gray-50/50 transition-all cursor-pointer"
                  >
                    <option value="Steadfast">Steadfast Courier</option>
                    <option value="Pathao">Pathao Courier</option>
                    <option value="RedX">RedX Logistics</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="Carrybee">Carrybee</option>
                    <option value="Manual">Others / Manual</option>
                  </select>
                </div>

                {courierMethod === "MANUAL" ? (
                  <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Tracking ID
                    </label>
                    <input
                      name="trackingCode"
                      type="text"
                      required
                      placeholder="Enter assignment code"
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#FF7050] bg-gray-50/50"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3 animate-in fade-in duration-300">
                    <Info size={14} className="text-[#FF7050]" />
                    <p className="text-[11px] text-[#FF7050] font-medium leading-tight">
                      Order will be booked via API. Tracking ID will auto-sync.
                    </p>
                  </div>
                )}
              </div>

              {/* Solid Action Button */}
              <button
                type="submit"
                disabled={statusMutation.isPending}
                className="w-full py-4 bg-[#FF7050] hover:bg-[#e05b3d] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:active:scale-100 cursor-pointer mt-2"
              >
                {statusMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Complete Assignment <Truck size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}


      {commentModal.open && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10005] p-4 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden text-left border border-gray-100">
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
        <h3 className="text-base font-bold text-gray-900">Internal Comment</h3>
        <button onClick={() => setCommentModal({ open: false, id: null, text: "" })}>
          <X size={18} className="text-gray-400" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <textarea
          className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all"
          placeholder="Write a note about this order..."
          value={commentModal.text}
          onChange={(e) => setCommentModal({ ...commentModal, text: e.target.value })}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setCommentModal({ open: false, id: null, text: "" })}
            className="flex-1 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveComment}
            disabled={statusMutation.isPending}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-[#1DA1F2] rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {statusMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

// "use client";
// import { useState, useRef, useEffect, useMemo } from "react";
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   useQueries,
// } from "@tanstack/react-query";
// import {
//   Search,
//   MoreVertical,
//   Edit,
//   Printer,
//   FileText,
//   RefreshCw,
//   Trash2,
//   ChevronLeft,
//   X,
//   Loader2,
//   User,
//   MapPin,
//   Package,
//   Info,
//   Clock,
//   CheckCircle2,
//   PauseCircle,
//   Truck,
//   PackageCheck,
//   XCircle,
//   RotateCcw,
//   ExternalLink,
// } from "lucide-react";
// import Image from "next/image";
// import { debounce } from "lodash";
// import { toast } from "react-hot-toast";

// import DataTable from "../common/DataTable";
// import Pagination2 from "../common/Pagination2";
// import TableTabs from "./TableTabs";

// import {
//   getAllOrdersService,
//   updateOrderStatusService,
//   fetchOrderCounts,
// } from "@/services-api/orderService";
// import { useRouter } from "next/navigation";
// import { InvoicePrint } from "./InvoicePrint";
// import {
//   deleteIncompleteOrderService,
//   getAllIncompleteOrdersService,
// } from "@/services-api/incompleteOrderService";
// import { apiFetch } from "@/utils/api";

// // --- Helper for Courier Tracking Links ---
// const getTrackingUrl = (code: string, provider: string) => {
//   if (!code) return null;
//   const p = provider?.toLowerCase() || "";
//   if (p.includes("steadfast")) return `https://steadfast.com.bd/t/${code}`;
//   if (p.includes("pathao"))
//     return `https://pathao.com/courier-tracking?tracking_code=${code}`;
//   if (p.includes("redx"))
//     return `https://redx.com.bd/track-order/?trackingId=${code}`;
//   if (p.includes("paperfly"))
//     return `https://www.paperfly.com.bd/tracking.php?tracking_number=${code}`;
//   return null;
// };

// const getStatusConfig = (status: string) => {
//   if (!status) {
//     return {
//       label: "Unknown",
//       icon: Info,
//       className: "bg-gray-50 text-gray-500 border-gray-200",
//       iconColor: "text-gray-400",
//     };
//   }
//   const upper = status.toUpperCase();
//   switch (upper) {
//     case "PENDING":
//       return {
//         label: "Pending",
//         icon: Clock,
//         className: "bg-amber-50 text-amber-700 border-amber-200",
//         iconColor: "text-amber-500",
//       };
//     case "CONFIRMED":
//       return {
//         label: "Confirmed",
//         icon: CheckCircle2,
//         className: "bg-blue-50 text-[#1DA1F2] border-blue-200",
//         iconColor: "text-[#1DA1F2]",
//       };
//     case "SHIPPED":
//       return {
//         label: "Shipped",
//         icon: Truck,
//         className: "bg-purple-50 text-purple-700 border-purple-200",
//         iconColor: "text-purple-500",
//       };
//     case "DELIVERED":
//       return {
//         label: "Delivered",
//         icon: PackageCheck,
//         className: "bg-emerald-50 text-emerald-700 border-emerald-200",
//         iconColor: "text-emerald-500",
//       };
//     case "CANCELED":
//       return {
//         label: "Canceled",
//         icon: XCircle,
//         className: "bg-rose-50 text-rose-700 border-rose-200",
//         iconColor: "text-rose-500",
//       };
//     case "SENT_TO_COURIER":
//       return {
//         label: "To Courier",
//         icon: Truck,
//         className: "bg-indigo-50 text-indigo-700 border-indigo-200",
//         iconColor: "text-indigo-500",
//       };
//     default:
//       return {
//         label: status.replace(/_/g, " "),
//         icon: Info,
//         className: "bg-gray-50 text-gray-600 border-gray-200",
//         iconColor: "text-gray-400",
//       };
//   }
// };

// export default function OrderTable() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");

//   const tabs = [
//     "All order",
//     "Pending",
//     "Confirmed",
//     "Incomplete",
//     "Delivered",
//     "Canceled",
//     "Returned",
//   ];
//   const isIncompleteTab = tabs[activeTab] === "Incomplete";

//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
//   const [menuPos, setMenuPos] = useState({
//     top: 0,
//     left: 0,
//     opensUpward: false,
//   });
//   const [showStatusMenu, setShowStatusMenu] = useState(false);
//   const [shippedModal, setShippedModal] = useState<{
//     open: boolean;
//     id: string | null;
//     targetStatus?: string | null;
//   }>({ open: false, id: null });
//   const [detailsModal, setDetailsModal] = useState<{
//     open: boolean;
//     order: any | null;
//   }>({ open: false, order: null });
//   const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<
//     any | null
//   >(null);
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const baseStorageUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
//     "http://localhost:8082";

//   // --- DATA FETCHING ---
//   const { data: serverData, isLoading } = useQuery({
//     queryKey: ["admin-orders", tabs[activeTab], page, searchQuery],
//     queryFn: async () => {
//       if (isIncompleteTab)
//         return await getAllIncompleteOrdersService({ page, limit: 10 });
//       const status =
//         tabs[activeTab] === "All order" ? "" : tabs[activeTab].toUpperCase();
//       return await getAllOrdersService({
//         page,
//         limit: 10,
//         status,
//         search: searchQuery,
//         refresh: true,
//       });
//     },
//     placeholderData: (previousData) => previousData,
//   });

//   const orderList = useMemo(() => {
//     if (!serverData) return [];
//     if (serverData.data && Array.isArray(serverData.data.data))
//       return serverData.data.data;
//     if (Array.isArray(serverData.data)) return serverData.data;
//     return [];
//   }, [serverData]);

//   const meta = useMemo(() => {
//     const m = serverData?.data?.meta || serverData?.meta;
//     return m || { totalPages: 1, total: 0 };
//   }, [serverData]);

//   const { data: tabCountsData } = useQuery({
//     queryKey: ["order-tab-counts"],
//     queryFn: async () => {
//       const standardCounts = await fetchOrderCounts(
//         tabs.filter((t) => t !== "Incomplete"),
//       );
//       let incompleteCount = 0;
//       try {
//         const leadRes = await getAllIncompleteOrdersService({
//           page: 1,
//           limit: 1,
//         });
//         incompleteCount =
//           leadRes?.meta?.total || leadRes?.data?.meta?.total || 0;
//       } catch (e) {}
//       return [...standardCounts, { tab: "Incomplete", count: incompleteCount }];
//     },
//   });

//   const counts = useMemo(
//     () =>
//       tabCountsData?.reduce(
//         (acc: any, curr: any) => ({ ...acc, [curr.tab]: curr.count }),
//         {},
//       ) || {},
//     [tabCountsData],
//   );

//   // --- MUTATIONS ---
//   const statusMutation = useMutation({
//     mutationFn: ({ id, payload }: any) => updateOrderStatusService(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
//       toast.success("Status updated.");
//       setActiveMenuId(null);
//       setShippedModal({ open: false, id: null });
//     },
//   });

//   const deleteLeadMutation = useMutation({
//     mutationFn: (id: string) => deleteIncompleteOrderService(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
//       toast.success("Removed successfully");
//       setActiveMenuId(null);
//     },
//   });

//   const handleSearch = debounce((val: string) => {
//     setSearchQuery(val);
//     setPage(1);
//   }, 500);

//   const getImgUrl = (rawImg: any) => {
//     const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
//     return cleanImg !== ""
//       ? cleanImg.startsWith("http")
//         ? cleanImg
//         : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`
//       : "/images/products/product2.png";
//   };

//   // --- RESOLVING METADATA FOR MODAL ---
//   const modalItems = useMemo(
//     () =>
//       detailsModal.open && detailsModal.order && isIncompleteTab
//         ? detailsModal.order.cart_items || []
//         : [],
//     [detailsModal],
//   );
//   const resolvedModalProducts = useQueries({
//     queries: modalItems.map((item: any) => ({
//       queryKey: ["product-metadata", item.productId],
//       queryFn: async () => {
//         const res = await apiFetch(`/products/${item.productId}`);
//         const json = await res.json();
//         return json.data || json;
//       },
//       enabled: detailsModal.open && !!item.productId,
//     })),
//   });

//   const productDetailsMap = useMemo(() => {
//     const map: Record<string, any> = {};
//     resolvedModalProducts.forEach((query) => {
//       const product = query.data as Record<string, any>;
//       if (product?.id) map[product.id] = product;
//     });
//     return map;
//   }, [resolvedModalProducts]);

//   // --- TABLE COLUMNS ---
//   const columns = [
//     {
//       header: "No.",
//       key: "index",
//       render: (_: any, index: number) => (
//         <span className="text-gray-500 font-medium">
//           {(page - 1) * 10 + index + 1}
//         </span>
//       ),
//     },
//     {
//       header: isIncompleteTab ? "Lead ID" : "Order Id",
//       key: "id",
//       render: (item: any) => (
//         <span
//           onClick={() => setDetailsModal({ open: true, order: item })}
//           className="font-bold text-[13px] cursor-pointer text-gray-800 hover:text-[#1DA1F2]"
//         >
//           {isIncompleteTab ? `LEAD-${item.id.slice(0, 8)}` : item.order_number}
//         </span>
//       ),
//     },
//     {
//       header: "Product",
//       key: "product",
//       render: (item: any) => {
//         const items = isIncompleteTab
//           ? item.cart_items || []
//           : item.order_items || [];
//         const first = items[0];
//         const productInfo = first?.product || {};
//         const img =
//           productInfo.images?.[0] ||
//           productInfo.featuredImage ||
//           first?.image ||
//           first?.externalImage;
//         const name =
//           productInfo.name ||
//           first?.product_name ||
//           first?.externalName ||
//           "Product";
//         return (
//           <div className="flex items-center gap-2">
//             <Image
//               src={getImgUrl(img)}
//               alt="p"
//               width={38}
//               height={38}
//               unoptimized
//               className="rounded border bg-white p-0.5"
//             />
//             <div className="flex flex-col">
//               <span className="truncate max-w-[130px] text-[12px] font-bold text-gray-700">
//                 {name}
//               </span>
//               {items.length > 1 && (
//                 <span className="text-[10px] text-[#1DA1F2] font-bold">
//                   +{items.length - 1} more
//                 </span>
//               )}
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Customer Info",
//       key: "customer",
//       render: (item: any) => (
//         <div className="text-[12px]">
//           <p className="font-bold text-gray-900 leading-tight">
//             {item.customer_name || "Guest"}
//           </p>
//           <p className="text-gray-500">{item.customer_phone || "N/A"}</p>
//         </div>
//       ),
//     },
//     {
//       header: "Date",
//       key: "created_at",
//       render: (item: any) => (
//         <div className="text-[11px] leading-tight text-gray-600">
//           <p className="font-bold text-gray-800">
//             {new Date(item.created_at).toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })}
//           </p>
//           <p>
//             {new Date(item.created_at).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: "Price",
//       key: "amount",
//       render: (item: any) => (
//         <span className="font-bold text-[13px] text-gray-900 font-poppins">
//           ৳{Number(item.total_bill || item.total_amount || 0).toLocaleString()}
//         </span>
//       ),
//     },
//     {
//       header: "Supplier",
//       key: "supplier",
//       render: (item: any) => (
//         <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-tighter">
//           {item.courier_name || item.source || "System"}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (item: any) => {
//         const config = getStatusConfig(
//           isIncompleteTab ? "PENDING" : item.status,
//         );
//         const Icon = config.icon;
//         return (
//           <div
//             className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${config.className}`}
//           >
//             <Icon size={12} className={config.iconColor} />
//             <span>{isIncompleteTab ? "Abandoned" : config.label}</span>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Track ID",
//       key: "tracking_code",
//       render: (item: any) => {
//         const code = item.tracking_code || item.trackingCode;
//         const url = getTrackingUrl(code, item.courier_name || item.courierName);
//         if (!code) return <span className="text-gray-300 text-[11px]">-</span>;
//         return (
//           <a
//             href={url || "#"}
//             target="_blank"
//             rel="noreferrer"
//             className="flex items-center gap-1 text-[#1DA1F2] hover:underline font-bold text-[12px]"
//           >
//             {code} <ExternalLink size={10} />
//           </a>
//         );
//       },
//     },
//     {
//       header: "Action",
//       key: "action",
//       render: (order: any) => (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             const rect = e.currentTarget.getBoundingClientRect();
//             setMenuPos({
//               top: rect.bottom + 8,
//               left: rect.left - 165,
//               opensUpward: false,
//             });
//             setActiveMenuId(activeMenuId === order.id ? null : order.id);
//             setShowStatusMenu(false);
//           }}
//           className="p-1 hover:bg-gray-100 rounded-full"
//         >
//           <MoreVertical size={20} className="text-gray-400" />
//         </button>
//       ),
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="h-64 flex flex-col items-center justify-center gap-2">
//         <Loader2 className="animate-spin text-[#1DA1F2]" />
//         <span className="text-xs text-gray-400">Loading order dataset...</span>
//       </div>
//     );

//   return (
//     <div className="w-full font-lato">
//       <div className="bg-white rounded-lg mt-4 shadow-sm border border-gray-100">
//         <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
//           <TableTabs
//             tabs={tabs.map((t) => `${t} (${counts[t] || 0})`)}
//             activeTab={activeTab}
//             setActiveTab={(idx) => {
//               setActiveTab(idx);
//               setPage(1);
//             }}
//           />
//           {!isIncompleteTab && (
//             <div className="relative lg:w-[316px]">
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full bg-gray-50 rounded-lg py-2.5 pl-4 pr-10 text-[14px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#1DA1F2]/20"
//               />
//               <Search
//                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//             </div>
//           )}
//         </div>

//         <DataTable data={orderList} columns={columns} rowKey="id" />

//         <div className="py-5">
//           <Pagination2
//             currentPage={page}
//             totalPages={meta.totalPages}
//             onPageChange={setPage}
//           />
//         </div>
//       </div>

//       {/* --- ACTION MENU --- */}
//       {activeMenuId && (
//         <div
//           ref={menuRef}
//           className="fixed bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[9999] w-[210px] animate-in fade-in zoom-in duration-150"
//           style={{ top: menuPos.top, left: menuPos.left }}
//         >
//           <div className="px-2 pb-1.5 border-b border-gray-50 mb-1.5">
//             {!isIncompleteTab && (
//               <button
//                 onClick={() =>
//                   router.push(`/admin/dashboard/order/add?id=${activeMenuId}`)
//                 }
//                 className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
//               >
//                 <Edit size={16} /> Edit Order
//               </button>
//             )}
//             <button
//               onClick={() => {
//                 const o = orderList.find((x: any) => x.id === activeMenuId);
//                 setDetailsModal({ open: true, order: o });
//                 setActiveMenuId(null);
//               }}
//               className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
//             >
//               <FileText size={16} /> View Details
//             </button>
//           </div>
//           {!isIncompleteTab && (
//             <div className="px-2 pb-1.5 border-b border-gray-50 mb-1.5">
//               <button
//                 onClick={() => {
//                   const o = orderList.find((x: any) => x.id === activeMenuId);
//                   setSelectedOrderForPrint(o);
//                   setActiveMenuId(null);
//                 }}
//                 className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3"
//               >
//                 <Printer size={16} /> Print Invoice
//               </button>
//               <div className="relative">
//                 <button
//                   onMouseEnter={() => setShowStatusMenu(true)}
//                   className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
//                 >
//                   <div className="flex items-center gap-3">
//                     <RefreshCw size={16} /> Status
//                   </div>
//                   <ChevronLeft size={14} />
//                 </button>
//                 {showStatusMenu && (
//                   <div className="absolute right-full top-0 mr-2 w-[170px] bg-white border border-gray-100 rounded-xl shadow-2xl py-2">
//                     {[
//                       "PENDING",
//                       "CONFIRMED",
//                       "SHIPPED",
//                       "DELIVERED",
//                       "CANCELED",
//                       "RETURNED",
//                       "SENT_TO_COURIER",
//                     ].map((s) => (
//                       <button
//                         key={s}
//                         onClick={() => {
//                           if (s === "SENT_TO_COURIER" || s === "SHIPPED") {
//                             setShippedModal({
//                               open: true,
//                               id: activeMenuId,
//                               targetStatus: s,
//                             });
//                             setActiveMenuId(null);
//                           } else {
//                             statusMutation.mutate({
//                               id: activeMenuId!,
//                               payload: { status: s },
//                             });
//                           }
//                         }}
//                         className="w-full text-left px-4 py-1.5 text-xs font-bold hover:bg-blue-50 hover:text-[#1DA1F2] uppercase"
//                       >
//                         {s.replace(/_/g, " ")}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           <div className="px-2">
//             <button
//               onClick={() => {
//                 if (window.confirm("Confirm delete?"))
//                   isIncompleteTab
//                     ? deleteLeadMutation.mutate(activeMenuId!)
//                     : toast.error("Not implemented");
//               }}
//               className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 font-bold flex items-center gap-3"
//             >
//               <Trash2 size={16} /> Delete
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- INVOICE PRINT (HIDDEN) --- */}
//       <div className="hidden">
//         <InvoicePrint
//           ref={invoiceRef}
//           order={selectedOrderForPrint}
//           baseStorageUrl={baseStorageUrl}
//         />
//       </div>

//       {/* --- DETAILS MODAL --- */}
//       {detailsModal.open && detailsModal.order && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden font-lato flex flex-col text-left">
//             <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
//               <div className="flex items-center gap-3">
//                 <Package className="text-[#1DA1F2]" />
//                 <div>
//                   <h3 className="text-lg font-bold text-[#023337]">
//                     {detailsModal.order.cart_items
//                       ? "Incomplete Lead"
//                       : "Order Summary"}
//                   </h3>
//                   <p className="text-xs text-gray-500 font-medium">
//                     {detailsModal.order.order_number ||
//                       `LEAD-${detailsModal.order.id.slice(0, 8)}`}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setDetailsModal({ open: false, order: null })}
//                 className="p-2 hover:bg-gray-200 rounded-full"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
//                   <User className="text-blue-500" size={20} />
//                   <div>
//                     <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
//                       Customer
//                     </p>
//                     <p className="font-bold text-[#023337]">
//                       {detailsModal.order.customer_name || "Guest"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {detailsModal.order.customer_phone}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3">
//                   <MapPin className="text-emerald-500" size={20} />
//                   <div>
//                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
//                       Address
//                     </p>
//                     <p className="text-sm font-medium text-gray-700 leading-tight">
//                       {detailsModal.order.customer_address || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="bg-purple-50 p-4 rounded-xl flex items-start gap-3">
//                   <Info className="text-purple-500" size={20} />
//                   <div>
//                     <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
//                       Status
//                     </p>
//                     <p className="text-sm font-bold text-purple-700 uppercase">
//                       {detailsModal.order.status || "Abandoned"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="border rounded-xl overflow-hidden">
//                 <table className="w-full text-left">
//                   <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
//                     <tr>
//                       <th className="px-4 py-3">Product</th>
//                       <th className="px-4 py-3 text-center">Price</th>
//                       <th className="px-4 py-3 text-center">Qty</th>
//                       <th className="px-4 py-3 text-right">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {(isIncompleteTab
//                       ? detailsModal.order.cart_items
//                       : detailsModal.order.order_items || []
//                     ).map((item: any, idx: number) => {
//                       const resolved =
//                         productDetailsMap[item.productId || item.product?.id];
//                       const price = Number(
//                         item.price ||
//                           item.unit_price ||
//                           resolved?.sell_price ||
//                           0,
//                       );
//                       const qty = Number(item.quantity || item.qty || 1);
//                       return (
//                         <tr key={idx} className="text-sm hover:bg-gray-50">
//                           <td className="px-4 py-3 flex items-center gap-3">
//                             <Image
//                               src={getImgUrl(
//                                 resolved?.featuredImage || item.image,
//                               )}
//                               width={36}
//                               height={36}
//                               unoptimized
//                               className="rounded border"
//                               alt="p"
//                             />
//                             <span className="font-bold text-gray-700">
//                               {resolved?.name ||
//                                 item.product_name ||
//                                 "Loading..."}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-center font-poppins">
//                             ৳{price}
//                           </td>
//                           <td className="px-4 py-3 text-center font-bold">
//                             {qty}
//                           </td>
//                           <td className="px-4 py-3 text-right font-bold text-[#1DA1F2] font-poppins">
//                             ৳{price * qty}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="flex justify-between items-end border-t pt-6">
//                 <div className="bg-gray-50 p-4 rounded-xl w-64">
//                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
//                     Internal Note
//                   </p>
//                   <p className="text-xs text-gray-600 italic">
//                     "{detailsModal.order.customer_note || "No notes."}"
//                   </p>
//                 </div>
//                 <div className="text-right space-y-1">
//                   <p className="text-xs text-gray-500 uppercase font-bold">
//                     Total Payable
//                   </p>
//                   <p className="text-3xl font-black text-[#023337] font-poppins">
//                     ৳
//                     {detailsModal.order.total_amount ||
//                       detailsModal.order.total_bill ||
//                       0}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- SHIPPED MODAL --- */}
//       {shippedModal.open && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10002] p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-gray-900 tracking-tight">
//                 Courier Assignment
//               </h3>
//               <button
//                 onClick={() => setShippedModal({ open: false, id: null })}
//                 className="text-gray-400"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const fd = new FormData(e.currentTarget);
//                 statusMutation.mutate({
//                   id: shippedModal.id,
//                   payload: {
//                     status: shippedModal.targetStatus,
//                     courierName: fd.get("c"),
//                     trackingCode: fd.get("t"),
//                   },
//                 });
//               }}
//               className="space-y-4"
//             >
//               <div>
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
//                   Provider
//                 </label>
//                 <select
//                   name="c"
//                   required
//                   className="w-full border rounded-xl p-3 text-sm bg-gray-50 outline-none focus:border-[#FF7050]"
//                 >
//                   <option value="Steadfast">Steadfast Courier</option>
//                   <option value="Pathao">Pathao Courier</option>
//                   <option value="RedX">RedX Logistics</option>
//                   <option value="Manual">Others / Manual</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
//                   Tracking ID (Manual)
//                 </label>
//                 <input
//                   name="t"
//                   type="text"
//                   placeholder="Enter code if manual"
//                   className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#FF7050]"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={statusMutation.isPending}
//                 className="w-full py-4 bg-[#FF7050] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
//               >
//                 {statusMutation.isPending ? (
//                   <Loader2 size={18} className="animate-spin" />
//                 ) : (
//                   "Confirm Shipment"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

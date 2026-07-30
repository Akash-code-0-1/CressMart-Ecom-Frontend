// // "use client";
// // import { useState } from "react";
// // import { Search, ArrowUpDown, MoreVertical } from "lucide-react";

// // import TableTabs from "./TableTabs";
// // import Image from "next/image";
// // import { TableColumn, Order } from "@/@types/order.type";
// // import TrackIcon from "@/components/store-front/svg/svg/TrackIcon";
// // import DataTable from "../common/DataTable";
// // import Pagination2 from "../common/Pagination2";
// // import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";

// // //  Define columns and their specific designs here
// // const columns: TableColumn<Order>[] = [
// //   {
// //     header: "No.",
// //     key: "id",
// //     className: "w-[50px] xl:w-[70px]",
// //     render: (order) => (
// //       <div className="flex items-center gap-2">
// //         <input
// //           type="checkbox"
// //           className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
// //         />
// //         <span className="text-[13px] xl:text-[15px] text-black font-normal">
// //           {order.id}
// //         </span>
// //       </div>
// //     ),
// //   },
// //   {
// //     header: "Order Id",
// //     key: "orderId",
// //     render: (order) => (
// //       <span className="text-[13px] xl:text-[15px] text-black">
// //         #{order.orderId}
// //       </span>
// //     ),
// //   },
// //   {
// //     header: "Product",
// //     key: "product",
// //     render: (order) => (
// //       <div className="flex items-center gap-2 xl:gap-3 max-w-[150px] 2xl:max-w-none">
// //         <Image
// //           src="/images/products/product.png"
// //           alt={order.product}
// //           width={40}
// //           height={40}
// //           className="border border-[#E5E7EB] p-[5px] rounded-[8px]"
// //         />
// //         <span
// //           className="text-[15px] text-black font-normal truncate"
// //           title={order.product}
// //         >
// //           {order.product}
// //         </span>
// //       </div>
// //     ),
// //   },
// //   {
// //     header: "Customer",
// //     key: "customerName",
// //     render: (order) => (
// //       <>
// //         <span className="text-[13px] xl:text-[15px] font-medium text-black block truncate max-w-[100px] xl:max-w-none">
// //           {order.customerName}
// //         </span>
// //         <span className="text-[11px] xl:text-[15px] text-black block">
// //           {order.customerPhone}
// //         </span>
// //       </>
// //     ),
// //   },
// //   {
// //     header: "Date",
// //     key: "date",
// //     className: "whitespace-nowrap",
// //     render: (order) => (
// //       <>
// //         <span className="text-[15px] text-black block">{order.date}</span>
// //         <span className="text-[15px] text-black block">{order.time}</span>
// //       </>
// //     ),
// //   },
// //   {
// //     header: "Price",
// //     key: "price",
// //     render: (order) => (
// //       <span className="text-[15px] font-normal text-black">{order.price}</span>
// //     ),
// //   },
// //   {
// //     header: "Payment",
// //     key: "payment",
// //     render: (order) => (
// //       <div className="flex items-center gap-1.5 text-[15px] font-normal">
// //         <div className="w-[8px] h-[8px] rounded-full bg-[#FF6A00] shrink-0" />
// //         <span className="truncate">{order.payment}</span>
// //       </div>
// //     ),
// //   },
// //   {
// //     header: "Fraud Checker",
// //     key: "fraudStatus",
// //     className: "whitespace-nowrap",
// //     render: (order) => (
// //       <>
// //         <span
// //           className="text-[15px] font-bold"
// //           style={{ color: fraudColor[order.fraudStatus] }}
// //         >
// //           {order.fraudStatus}
// //         </span>
// //         <span className="text-[15px] font-normal text-black">
// //           ({order.fraudScore}%)
// //         </span>
// //       </>
// //     ),
// //   },
// //   {
// //     header: "Status",
// //     key: "status",
// //     render: (order) => (
// //       <div className="flex items-center gap-1.5 text-[#26007F] w-fit">
// //         <TrackIcon />
// //         <span className="text-[15px] text-[#26007F] font-normal">
// //           {order.status}
// //         </span>
// //       </div>
// //     ),
// //   },
// //   {
// //     header: "Action",
// //     key: "action",
// //     render: () => (
// //       <button className="text-black p-1 transition-colors">
// //         <MoreVertical size={20} />
// //       </button>
// //     ),
// //   },
// // ];

// // const orders = [
// //   {
// //     id: 1,
// //     orderId: "OR1250",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Safe" as FraudStatus,
// //     fraudScore: 80,
// //     status: "Pending",
// //   },
// //   {
// //     id: 2,
// //     orderId: "OR1249",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// //   {
// //     id: 3,
// //     orderId: "OR1248",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Mediam" as FraudStatus,
// //     fraudScore: 50,
// //     status: "Pending",
// //   },
// //   {
// //     id: 4,
// //     orderId: "OR1247",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// //   {
// //     id: 5,
// //     orderId: "OR1246",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// //   {
// //     id: 6,
// //     orderId: "OR1245",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// //   {
// //     id: 7,
// //     orderId: "OR1244",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// //   {
// //     id: 8,
// //     orderId: "OR1243",
// //     product: "Wireless Bluetooth Headphones",
// //     customerName: "Imam Hoshen Ornob",
// //     customerPhone: "+88 01788-888888",
// //     date: "01-01-2025",
// //     time: "06:32 PM",
// //     price: "49.99",
// //     payment: "COD",
// //     fraudStatus: "Risky" as FraudStatus,
// //     fraudScore: 20,
// //     status: "Pending",
// //   },
// // ];

// // const tabs = [
// //   "All order (240)",
// //   "Pending (240)",
// //   "Delivered (240)",
// //   "Canceled (240)",
// //   "Returned (240)",
// // ];

// // const fraudColor = {
// //   Safe: "#085E00",
// //   Risky: "#DA0000",
// //   Mediam: "#FF9F1C",
// // } as const;

// // type FraudStatus = keyof typeof fraudColor;

// // const OrderTable = () => {
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [activePage, setActivePage] = useState(1);

// //   return (
// //     <div className="w-full min-h-screen font-lato">
// //       <div className="bg-white rounded-[8px] mt-4">
// //         {/* Top Control Panel */}
// //         <div className="p-3 sm:p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
// //           {/* Tabs row - allow horizontal scroll on very small screens if tabs are many */}
// //           <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
// //             <TableTabs
// //               tabs={tabs}
// //               activeTab={activeTab}
// //               setActiveTab={setActiveTab}
// //             />
// //           </div>

// //           {/* Search + filter row */}
// //           <div className="flex items-center gap-2 w-full lg:w-auto">
// //             {/* Search Input Container */}
// //             <div className="relative flex-grow lg:flex-grow-0 w-full lg:w-[240px] xl:w-[316px] font-lato">
// //               <input
// //                 type="text"
// //                 placeholder="Search order report"
// //                 className="w-full bg-[#F9FAFB] rounded-[8px] py-2.5 pl-4 pr-10 text-[14px] text-black placeholder:text-[#6A717F] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] transition-all"
// //               />
// //               <Search
// //                 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]"
// //                 size={20}
// //               />
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex items-center gap-2 shrink-0">
// //               <button className="cursor-pointer p-2.5 bg-white border border-[#D1D5DB] rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm">
// //                 <ThreeBarIcon color="#4B5563" />
// //               </button>
// //               <button className="cursor-pointer p-2.5 bg-white border border-[#D1D5DB] rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm">
// //                 <ArrowUpDown color="#4B5563" size={20} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* table container */}
// //         <DataTable data={orders} columns={columns} rowKey="id" />
// //         {/* ── Pagination ── */}
// //         <div className="py-5">
// //           <Pagination2
// //             currentPage={activePage}
// //             totalPages={20}
// //             onPageChange={(page) => setActivePage(page)}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderTable;

// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Search,
//   ArrowUpDown,
//   MoreVertical,
//   Edit,
//   Percent,
//   Printer,
//   FileText,
//   Copy,
//   RefreshCw,
//   UserX,
//   Trash2,
//   ChevronLeft,
//   X,
//   Loader2,
//   CheckCircle2,
// } from "lucide-react";
// import Image from "next/image";
// import { debounce } from "lodash";
// import { toast } from "react-hot-toast";

// import DataTable from "../common/DataTable";
// import Pagination2 from "../common/Pagination2";
// import TableTabs from "./TableTabs";
// import TrackIcon from "@/components/store-front/svg/svg/TrackIcon";
// import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";

// import {
//   getAllOrdersService,
//   updateOrderStatusService,
//   fetchOrderCounts,
// } from "@/services-api/orderService";
// import { customerApi } from "@/services-api/customerService";
// // ⚡ FIX 1: Import from next/navigation for App Router
// import { useRouter } from "next/navigation"; 

// export default function OrderTable() {
//   const router = useRouter(); 
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const tabs = ["All order", "Pending", "Delivered", "Canceled", "Returned"];

//   // Action Menu States
//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
//   const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
//   const [showStatusMenu, setShowStatusMenu] = useState(false);
//   const [shippedModal, setShippedModal] = useState<{
//     open: boolean;
//     id: string | null;
//   }>({ open: false, id: null });
//   const [courierInfo, setCourierInfo] = useState({
//     courierName: "",
//     trackingCode: "",
//   });
//   const menuRef = useRef<HTMLDivElement>(null);

//   const baseStorageUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
//     "http://localhost:8082";

//   // --- 1. FETCH TABLE DATA ---
//   const { data: serverData, isLoading } = useQuery({
//     queryKey: ["admin-orders", activeTab, page, searchQuery],
//     queryFn: () => {
//       const status =
//         tabs[activeTab] === "All order" ? "" : tabs[activeTab].toUpperCase();
//       return getAllOrdersService({
//         page,
//         limit: 10,
//         status,
//         search: searchQuery,
//         refresh: true,
//       });
//     },
//   });

//   // --- 2. FETCH TAB COUNTS ---
//   const { data: tabCountsData } = useQuery({
//     queryKey: ["order-tab-counts"],
//     queryFn: () => fetchOrderCounts(tabs),
//     refetchOnWindowFocus: true,
//   });

//   const orderList = serverData?.data?.data || [];
//   const meta = serverData?.data?.meta || { totalPages: 1, total: 0 };
//   const counts =
//     tabCountsData?.reduce(
//       (acc: any, curr: any) => ({ ...acc, [curr.tab]: curr.count }),
//       {},
//     ) || {};

//   // --- 3. MUTATIONS ---
//   const statusMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: any }) =>
//       updateOrderStatusService(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
//       toast.success("Order synchronized successfully.");
//       setActiveMenuId(null);
//       setShowStatusMenu(false);
//       setShippedModal({ open: false, id: null });
//     },
//     onError: (err: any) => toast.error(err.message || "Failed to update"),
//   });

//   const blockUserMutation = useMutation({
//     mutationFn: ({ userId }: { userId: string }) =>
//       customerApi.updateStatus(userId, "blocked"),
//     onSuccess: () => {
//       toast.success("Customer account has been blocked.");
//       setActiveMenuId(null);
//     },
//     onError: (err: any) => toast.error(err.message || "Failed to block user"),
//   });

//   // 🚀 SMART BLOCKING LOGIC
//   const handleSmartBlockUser = async (order: any) => {
//     if (!confirm(`Are you sure you want to block customer: ${order.customer_name}?`)) return;
//     const tId = toast.loading("Processing...");
//     try {
//       if (order.source === "admin_panel") {
//         const searchRes = await customerApi.getAll(1, 1, order.customer_phone);
//         const target = searchRes?.data?.data?.[0];
//         if (target?.id) {
//           toast.dismiss(tId);
//           blockUserMutation.mutate({ userId: target.id });
//         } else {
//           toast.error("No account found for this phone number.", { id: tId });
//         }
//       } else {
//         toast.dismiss(tId);
//         blockUserMutation.mutate({ userId: order.user_id });
//       }
//     } catch (err) {
//       toast.error("Network error.", { id: tId });
//     }
//   };

//   const handleSearch = debounce((val: string) => {
//     setSearchQuery(val);
//     setPage(1);
//   }, 500);

//   useEffect(() => {
//     const close = () => { setActiveMenuId(null); setShowStatusMenu(false); };
//     window.addEventListener("scroll", close, true);
//     return () => window.removeEventListener("scroll", close, true);
//   }, []);

//   const ActionTrigger = ({ order }: { order: any }) => {
//     const btnRef = useRef<HTMLButtonElement>(null);
//     return (
//       <button
//         ref={btnRef}
//         onClick={(e) => {
//           e.stopPropagation();
//           const rect = btnRef.current?.getBoundingClientRect();
//           if (rect) {
//             setMenuPos({ top: rect.bottom + 8, left: rect.left - 165 });
//             setActiveMenuId(activeMenuId === order.id ? null : order.id);
//             setShowStatusMenu(false);
//           }
//         }}
//         className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
//       >
//         <MoreVertical size={20} />
//       </button>
//     );
//   };

//   const columns = [
//     {
//       header: "Order Id",
//       key: "order_number",
//       render: (item: any) => (
//         <span className="font-medium text-[14px]">#{item.order_number}</span>
//       ),
//     },
//     {
//       header: "Product",
//       key: "product",
//       render: (item: any) => {
//         const firstItem = item.order_items?.[0];
//         const rawImg = firstItem?.product?.images?.[0];
//         const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
//         const srcUrl = cleanImg !== "" 
//           ? (cleanImg.startsWith("http") ? cleanImg : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`)
//           : "/images/products/product2.png";

//         return (
//           <div className="flex items-center gap-3">
//             <img src={srcUrl} alt="" className="rounded-[8px] object-cover h-10 w-10 bg-gray-50 border p-1" />
//             <div className="flex flex-col">
//               <span className="truncate max-w-[150px] text-[14px] font-medium text-black">{firstItem?.product_name || "Untitled"}</span>
//               {item.order_items?.length > 1 && <span className="text-[10px] text-[#1DA1F2] font-bold">+{item.order_items.length - 1} more items</span>}
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       header: "Customer",
//       key: "customer",
//       render: (item: any) => (
//         <div>
//           <p className="font-medium text-[14px] text-black">{item.customer_name}</p>
//           <p className="text-[12px] text-gray-500">{item.customer_phone}</p>
//         </div>
//       ),
//     },
//     {
//       header: "Date",
//       key: "date",
//       render: (item: any) => (
//         <div className="text-[13px] text-black">
//           <p>{new Date(item.created_at).toLocaleDateString()}</p>
//           <p className="text-gray-400 font-normal">{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
//         </div>
//       ),
//     },
//     { header: "Amount", key: "amount", render: (item: any) => <span className="font-semibold text-[14px] text-black">৳{item.total_amount_due}</span> },
//     {
//       header: "Status",
//       key: "status",
//       render: (item: any) => (
//         <div className="flex items-center gap-1.5 text-[#26007F] font-bold">
//           <TrackIcon />
//           <span className="text-[14px] font-medium capitalize">{item.status.toLowerCase().replace(/_/g, " ")}</span>
//         </div>
//       ),
//     },
//     { header: "Action", key: "action", render: (item: any) => <ActionTrigger order={item} /> },
//   ];

//   if (isLoading) return <div className="h-64 flex flex-col items-center justify-center gap-2"><Loader2 className="animate-spin text-[#1DA1F2]" /><span className="text-xs text-gray-400">Loading...</span></div>;

//   return (
//     <div className="w-full font-lato">
//       <div className="bg-white rounded-[8px] mt-4 border border-gray-50 shadow-sm relative">
//         <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
//           <TableTabs tabs={tabs.map((t) => `${t} (${counts[t] || 0})`)} activeTab={activeTab} setActiveTab={(idx) => { setActiveTab(idx); setPage(1); }} />
//           <div className="flex items-center gap-2 w-full lg:w-auto">
//             <div className="relative flex-grow lg:w-[316px]">
//               <input type="text" placeholder="Search order report" onChange={(e) => handleSearch(e.target.value)} className="w-full bg-[#F9FAFB] rounded-[8px] py-2.5 pl-4 pr-10 text-[14px] text-black border border-transparent focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] outline-none transition-all" />
//               <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
//             </div>
//             <button className="p-2.5 border rounded-[8px] hover:bg-gray-50"><ThreeBarIcon color="#4B5563" /></button>
//             <button className="p-2.5 border rounded-[8px] hover:bg-gray-50"><ArrowUpDown size={20} color="#4B5563" /></button>
//           </div>
//         </div>

//         <DataTable data={orderList} columns={columns} rowKey="id" />

//         <div className="py-5"><Pagination2 currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
//       </div>

//       {activeMenuId && (
//         <div 
//           ref={menuRef}
//           className="fixed bg-white border border-gray-200 rounded-[8px] shadow-2xl py-1.5 z-[9999] w-[190px] font-lato animate-in fade-in zoom-in duration-75"
//           style={{ top: menuPos.top, left: menuPos.left }}
//         >
//           {/* ⚡ FIX 2: Correct ID usage for Push */}
//           <button onClick={() => router.push(`/admin/dashboard/order/add?id=${activeMenuId}`)} className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3">
//             <Edit size={16} /> Edit
//           </button>
//           <button className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Percent size={16} /> Discount</button>
//           <button className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Printer size={16} /> Print Invoice</button>
//           <button className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"><FileText size={16} /> Details</button>
//           <button className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Copy size={16} /> Duplicate</button>

//           <div className="relative">
//             <button onMouseEnter={() => setShowStatusMenu(true)} className="w-full flex items-center justify-between px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50">
//               <div className="flex items-center gap-3"><RefreshCw size={16} /> Order Status</div>
//               <ChevronLeft size={14} className="text-gray-400" />
//             </button>
//             {showStatusMenu && (
//               <div className="absolute right-full top-0 mr-1 w-[170px] bg-white border border-gray-100 rounded-[8px] shadow-xl py-1.5 z-[10000]" onMouseLeave={() => setShowStatusMenu(false)}>
//                 {["PENDING", "CONFIRMED", "ON_HOLD", "SHIPPED", "SENT_TO_COURIER", "DELIVERED", "CANCELED", "RETURNED", "REFUNDED", "RETURN_RECEIVED"].map((s) => (
//                   <button key={s} onClick={() => s === "SENT_TO_COURIER" ? setShippedModal({ open: true, id: activeMenuId }) : statusMutation.mutate({ id: activeMenuId!, payload: { status: s } })} className="w-full text-left px-4 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1DA1F2]">
//                     {s.replace(/_/g, " ")}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => {
//               const selectedOrder = orderList.find((o: any) => o.id === activeMenuId);
//               if (selectedOrder) handleSmartBlockUser(selectedOrder);
//             }}
//             className="w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-50 flex items-center gap-3"
//           >
//             <UserX size={16} /> Block User
//           </button>

//           <hr className="my-1.5 border-gray-100 mx-3" />
//           <button className="w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 font-medium flex items-center gap-3"><Trash2 size={16} /> Delete</button>
//         </div>
//       )}

//       {shippedModal.open && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-[12px] w-full max-w-sm shadow-2xl overflow-hidden font-lato">
//             <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
//               <h3 className="text-lg font-bold text-[#023337]">Dispatch to Courier</h3>
//               <button onClick={() => setShippedModal({ open: false, id: null })}><X size={20} className="text-gray-400" /></button>
//             </div>
//             <div className="p-6 space-y-5">
//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select Provider</label>
//                 <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[8px] outline-none focus:border-[#1DA1F2] text-sm font-medium" value={courierInfo.courierName} onChange={(e) => setCourierInfo({ ...courierInfo, courierName: e.target.value })}>
//                   <option value="">-- Choose Courier --</option>
//                   <option value="STEADFAST">Steadfast (Automatic)</option>
//                   <option value="PATHAO">Pathao (Automatic)</option>
//                   <option value="REDX">RedX (Automatic)</option>
//                   <option value="PAPERFLY">Paperfly (Automatic)</option>
//                   <option value="CARRYBEE">Carrybee (Automatic)</option>
//                   <option value="MANUAL">Manual Entry</option>
//                 </select>
//               </div>

//               {courierInfo.courierName && courierInfo.courierName !== "MANUAL" ? (
//                 <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
//                   <div className="bg-[#1DA1F2] p-1 rounded-full text-white mt-0.5"><CheckCircle2 size={12} /></div>
//                   <p className="text-[12px] text-blue-700 leading-tight"><strong>Auto-Booking Active:</strong> Parcel will be created automatically.</p>
//                 </div>
//               ) : courierInfo.courierName === "MANUAL" ? (
//                 <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
//                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Manual Tracking Code</label>
//                   <input type="text" placeholder="Enter tracking number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[8px] outline-none focus:border-[#1DA1F2] text-sm" onChange={(e) => setCourierInfo({ ...courierInfo, trackingCode: e.target.value })} />
//                 </div>
//               ) : null}

//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => setShippedModal({ open: false, id: null })} className="flex-1 py-3 border border-gray-200 rounded-[8px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
//                 <button disabled={!courierInfo.courierName || statusMutation.isPending} onClick={() => statusMutation.mutate({ id: shippedModal.id!, payload: { status: "SENT_TO_COURIER", ...courierInfo } })} className="flex-1 py-3 bg-[#1DA1F2] text-white rounded-[8px] font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2">
//                   {statusMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : "Confirm Dispatch"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Percent,
  Printer,
  FileText,
  Copy,
  RefreshCw,
  UserX,
  Trash2,
  ChevronLeft,
  X,
  Loader2,
  CheckCircle2,
  Ban,
  User,
  MapPin,
  Package,
  Calendar,
  Info
} from "lucide-react";
import Image from "next/image";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";

import DataTable from "../common/DataTable";
import Pagination2 from "../common/Pagination2";
import TableTabs from "./TableTabs";
import TrackIcon from "@/components/store-front/svg/svg/TrackIcon";
import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";

import {
  getAllOrdersService,
  updateOrderStatusService,
  fetchOrderCounts,
} from "@/services-api/orderService";
import { customerApi } from "@/services-api/customerService";
import { useRouter } from "next/navigation"; 
import { InvoicePrint } from "./InvoicePrint";
import { useReactToPrint } from "react-to-print";

export default function OrderTable() {
  const router = useRouter(); 
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["All order", "Pending", "Delivered", "Canceled", "Returned"];

  // Action Menu States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  // Modal States
  const [shippedModal, setShippedModal] = useState<{ open: boolean; id: string | null; }>({ open: false, id: null });
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; order: any | null; }>({ open: false, order: null });
  
  // 🚀 Logic for fetching profile image in Details Modal
  const [fetchedCustomer, setFetchedCustomer] = useState<any | null>(null);

  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<any | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [courierInfo, setCourierInfo] = useState({
    courierName: "",
    trackingCode: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const baseStorageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";

  // --- HELPERS ---
  const openDetails = (order: any) => {
    setDetailsModal({ open: true, order });
    setActiveMenuId(null);
  };

  const getImgUrl = (rawImg: string) => {
    const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
    return cleanImg !== "" 
      ? (cleanImg.startsWith("http") ? cleanImg : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`)
      : "/images/products/product2.png";
  };

  // 🚀 Logic to find customer profile when Modal opens
  useEffect(() => {
    const checkCustomer = async () => {
        if (detailsModal.open && detailsModal.order) {
            try {
                const res = await customerApi.getAll(1, 1, detailsModal.order.customer_phone);
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
      const status = tabs[activeTab] === "All order" ? "" : tabs[activeTab].toUpperCase();
      return getAllOrdersService({ page, limit: 10, status, search: searchQuery, refresh: true });
    },
  });

  const { data: tabCountsData } = useQuery({
    queryKey: ["order-tab-counts"],
    queryFn: () => fetchOrderCounts(tabs),
    refetchOnWindowFocus: true,
  });

  const orderList = serverData?.data?.data || [];
  const meta = serverData?.data?.meta || { totalPages: 1, total: 0 };
  const counts = tabCountsData?.reduce((acc: any, curr: any) => ({ ...acc, [curr.tab]: curr.count }), {}) || {};

  // --- MUTATIONS ---
  const statusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateOrderStatusService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-tab-counts"] });
      toast.success("Sync successful.");
      setActiveMenuId(null);
      setShippedModal({ open: false, id: null });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) => customerApi.updateStatus(userId, "blocked"),
    onSuccess: () => { toast.success("Blocked."); setActiveMenuId(null); },
  });

  const handleSmartBlockUser = async (order: any) => {
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

  const handleSearch = debounce((val: string) => { setSearchQuery(val); setPage(1); }, 500);

  useEffect(() => {
    const close = () => { setActiveMenuId(null); setShowStatusMenu(false); };
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, []);

  const columns = [
    {
      header: "Order Id",
      key: "order_number",
      render: (item: any) => (
        <span onClick={() => openDetails(item)} className="font-medium text-[14px] cursor-pointer hover:text-[#1DA1F2] transition-colors">
          #{item.order_number}
        </span>
      ),
    },
    {
      header: "Product",
      key: "product",
      render: (item: any) => {
        const firstItem = item.order_items?.[0];
        return (
          <div onClick={() => openDetails(item)} className="flex items-center gap-3 cursor-pointer group">
            <img src={getImgUrl(firstItem?.product?.images?.[0])} alt="" className="rounded-[8px] object-cover h-10 w-10 bg-gray-50 border p-1 group-hover:border-[#1DA1F2] transition-all" />
            <div className="flex flex-col">
              <span className="truncate max-w-[150px] text-[14px] font-medium text-black group-hover:text-[#1DA1F2] transition-colors">{firstItem?.product_name || "Untitled"}</span>
              {item.order_items?.length > 1 && <span className="text-[10px] text-[#1DA1F2] font-bold">+{item.order_items.length - 1} more items</span>}
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      key: "customer",
      render: (item: any) => (
        <div onClick={() => openDetails(item)} className="cursor-pointer">
          <p className="font-medium text-[14px] text-black">{item.customer_name}</p>
          <p className="text-[12px] text-gray-500">{item.customer_phone}</p>
        </div>
      ),
    },
    {
      header: "Date",
      key: "date",
      render: (item: any) => (
        <div onClick={() => openDetails(item)} className="text-[13px] text-black cursor-pointer">
          <p>{new Date(item.created_at).toLocaleDateString()}</p>
          <p className="text-gray-400 font-normal">{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      ),
    },
    { 
      header: "Amount", 
      key: "amount", 
      render: (item: any) => (
        <span onClick={() => openDetails(item)} className="font-semibold text-[14px] text-black cursor-pointer">
          ৳{item.total_amount_due}
        </span>
      ) 
    },
    {
      header: "Status",
      key: "status",
      render: (item: any) => (
        <div onClick={() => openDetails(item)} className="flex items-center gap-1.5 text-[#26007F] font-bold cursor-pointer">
          <TrackIcon />
          <span className="text-[14px] font-medium capitalize">{item.status.toLowerCase().replace(/_/g, " ")}</span>
        </div>
      ),
    },
    { 
        header: "Action", 
        key: "action", 
        render: (order: any) => (
            <button onClick={(e) => {
                e.stopPropagation(); 
                const rect = e.currentTarget.getBoundingClientRect();
                setMenuPos({ top: rect.bottom + 8, left: rect.left - 165 });
                setActiveMenuId(activeMenuId === order.id ? null : order.id);
                setShowStatusMenu(false);
            }} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><MoreVertical size={20} /></button>
        ) 
    },
  ];

  if (isLoading) return <div className="h-64 flex flex-col items-center justify-center gap-2"><Loader2 className="animate-spin text-[#1DA1F2]" /><span className="text-xs text-gray-400">Loading order dataset...</span></div>;

  return (
    <div className="w-full font-lato">
      <div className="bg-white rounded-[8px] mt-4 border border-gray-50 shadow-sm relative">
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <TableTabs tabs={tabs.map((t) => `${t} (${counts[t] || 0})`)} activeTab={activeTab} setActiveTab={(idx) => { setActiveTab(idx); setPage(1); }} />
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-[316px]">
              <input type="text" placeholder="Search order report" onChange={(e) => handleSearch(e.target.value)} className="w-full bg-[#F9FAFB] rounded-[8px] py-2.5 pl-4 pr-10 text-[14px] text-black border border-transparent focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] outline-none transition-all" />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" size={20} />
            </div>
          </div>
        </div>

        <DataTable data={orderList} columns={columns} rowKey="id" />

        <div className="py-5"><Pagination2 currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
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
        onClick={() => router.push(`/admin/dashboard/order/add?id=${activeMenuId}`)} 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
      >
        <Edit size={16} className="text-gray-400 group-hover:text-[#1DA1F2]" /> 
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
          const o = orderList.find((x:any) => x.id === activeMenuId);
          setSelectedOrderForPrint(o);
          setActiveMenuId(null);
        }} 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
      >
        <Printer size={16} className="text-gray-400 group-hover:text-[#1DA1F2]" /> 
        <span className="font-medium">Print Invoice</span>
      </button>

      <button 
        onClick={() => {
          const o = orderList.find((x:any) => x.id === activeMenuId);
          openDetails(o);
        }} 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group"
      >
        <FileText size={16} className="text-gray-400 group-hover:text-[#1DA1F2]" /> 
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
          className={`w-full flex items-center justify-between px-3 py-2 text-[14px] rounded-lg transition-colors ${showStatusMenu ? 'bg-blue-50 text-[#1DA1F2]' : 'text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2]'}`}
        >
          <div className="flex items-center gap-3">
            <RefreshCw size={16} className={showStatusMenu ? 'text-[#1DA1F2]' : 'text-gray-400'} /> 
            <span className="font-medium">Update Status</span>
          </div>
          <ChevronLeft size={14} className="opacity-50" />
        </button>

        {showStatusMenu && (
          <div 
            className="absolute right-full top-[-10px] mr-2 w-[180px] bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[10000] animate-in fade-in slide-in-from-right-2 duration-150" 
            onMouseLeave={() => setShowStatusMenu(false)}
          >
            <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Status</p>
            {["PENDING", "CONFIRMED", "ON_HOLD", "SHIPPED", "SENT_TO_COURIER", "DELIVERED", "CANCELED", "RETURNED", "REFUNDED"].map((s) => (
              <button 
                key={s} 
                onClick={() => s === "SENT_TO_COURIER" ? setShippedModal({ open: true, id: activeMenuId }) : statusMutation.mutate({ id: activeMenuId!, payload: { status: s } })} 
                className="w-full text-left px-4 py-1.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1DA1F2] transition-colors"
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
        onClick={() => { const o = orderList.find((x: any) => x.id === activeMenuId); if (o) handleSmartBlockUser(o); }} 
        className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg flex items-center gap-3 transition-colors group"
      >
        <UserX size={16} className="text-gray-400 group-hover:text-amber-600" /> 
        <span className="font-medium">Block User</span>
      </button>

      <button 
        className="w-full text-left px-3 py-2.5 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors group mt-0.5"
      >
        <Trash2 size={16} className="text-rose-400 group-hover:text-rose-600" /> 
        <span className="font-bold">Delete Order</span>
      </button>
    </div>
  </div>
)}

      {/* Hidden component for printing */}
      <div className="hidden">
        <InvoicePrint ref={invoiceRef} order={selectedOrderForPrint} baseStorageUrl={baseStorageUrl} />
      </div>

      {/* --- DETAILS MODAL WITH CUSTOMER IMAGE --- */}
      {detailsModal.open && detailsModal.order && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden font-lato flex flex-col text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F9FAFB]">
              <div className="flex items-center gap-3">
                <div className="bg-[#1DA1F2]/10 p-2 rounded-lg text-[#1DA1F2]"><Package size={20}/></div>
                <div><h3 className="text-lg font-bold text-[#023337]">Order Summary</h3><p className="text-xs text-gray-500 font-medium font-poppins">#{detailsModal.order.order_number}</p></div>
              </div>
              <button onClick={() => setDetailsModal({ open: false, order: null })} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 🚀 Updated Customer Card with Profile Image */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0">
                    {fetchedCustomer?.avatar ? (
                        <img src={getImgUrl(fetchedCustomer.avatar)} className="w-11 h-11 object-cover" />
                    ) : (
                        <div className="w-11 h-11 flex items-center justify-center text-blue-500"><User size={20}/></div>
                    )}
                  </div>
                  <div><p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Customer</p><p className="font-bold text-[#023337]">{detailsModal.order.customer_name}</p><p className="text-sm text-gray-600 font-poppins">{detailsModal.order.customer_phone}</p></div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-500"><MapPin size={20}/></div>
                  <div><p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Address</p><p className="text-sm font-medium text-gray-700 leading-tight">{detailsModal.order.customer_address}</p></div>
                </div>
                <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-purple-500"><Info size={20}/></div>
                  <div><p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Status</p><p className="text-sm font-bold text-purple-700 uppercase">{detailsModal.order.status}</p><p className="text-xs text-gray-500">via {detailsModal.order.source}</p></div>
                </div>
              </div>

              {/* Items Table and Financials ... (unchanged logic) */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F9FAFB] text-xs font-bold text-gray-500 uppercase"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3 text-center">Price</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {detailsModal.order.order_items.map((item: any) => (
                      <tr key={item.id} className="text-sm">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img src={getImgUrl(item.product?.images?.[0])} className="w-10 h-10 rounded-md border object-cover" alt="" />
                          <span className="font-bold text-gray-700">{item.product_name}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-poppins">৳{item.unit_price}</td>
                        <td className="px-4 py-3 text-center font-bold font-poppins">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#1DA1F2] font-poppins">৳{Number(item.unit_price) * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col md:row justify-between gap-6">
                <div className="flex-1 bg-gray-50 p-4 rounded-xl"><p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-tighter">Internal Note</p><p className="text-sm text-gray-600 italic">"{detailsModal.order.customer_note || 'N/A'}"</p></div>
                <div className="w-full md:w-80 space-y-2 font-poppins">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-bold text-black">৳{Number(detailsModal.order.total_amount_due) - Number(detailsModal.order.shipping_fee) + Number(detailsModal.order.discount_amount)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="font-bold text-black">৳{detailsModal.order.shipping_fee}</span></div>
                  <div className="flex justify-between text-rose-500"><span>Discount</span><span className="font-bold">- ৳{detailsModal.order.discount_amount}</span></div>
                  <div className="flex justify-between text-lg font-bold text-[#023337] border-t pt-2 mt-2"><span>Total Amount</span><span>৳{detailsModal.order.total_amount_due}</span></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setDetailsModal({ open: false, order: null })} className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">Close</button>
              <button onClick={() => { router.push(`/admin/dashboard/order/add?id=${detailsModal.order.id}`); setDetailsModal({ open: false, order: null }); }} className="px-6 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-md hover:bg-blue-600 cursor-pointer"><Edit size={16}/> Edit Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Shipped Modal ... (unchanged logic) */}
      {shippedModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#023337] mb-5">Dispatch to Courier</h3>
            <div className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select Provider</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[8px] outline-none focus:ring-1 focus:ring-blue-400" value={courierInfo.courierName} onChange={(e) => setCourierInfo({ ...courierInfo, courierName: e.target.value })}>
                  <option value="">-- Choose Courier --</option>
                  <option value="STEADFAST">Steadfast (Automatic)</option>
                  <option value="PATHAO">Pathao (Automatic)</option>
                  <option value="REDX">RedX (Automatic)</option>
                  <option value="MANUAL">Manual Entry</option>
                </select>
              </div>
              {courierInfo.courierName === "MANUAL" && (
                <div className="space-y-1 animate-in slide-in-from-top-1 text-left">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Manual Tracking Code</label>
                  <input type="text" placeholder="Enter tracking number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[8px] outline-none focus:ring-1 focus:ring-blue-400" onChange={(e) => setCourierInfo({ ...courierInfo, trackingCode: e.target.value })} />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShippedModal({ open: false, id: null })} className="cursor-pointer flex-1 py-3 border border-gray-200 rounded-[8px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                <button disabled={!courierInfo.courierName || statusMutation.isPending} onClick={() => statusMutation.mutate({ id: shippedModal.id!, payload: { status: "SENT_TO_COURIER", ...courierInfo } })} className="cursor-pointer flex-1 py-3 bg-[#1DA1F2] text-white rounded-[8px] font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300">
                  {statusMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
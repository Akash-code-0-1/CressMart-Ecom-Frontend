// "use client";
// import { Search } from "lucide-react";
// import Image from "next/image";
// interface Product {
//     id: string;
//     name: string;
//     image: string;
//     totalOrder?: number;
//     status?: "Stock" | "Stock out";
//     price: string;
//     itemCode?: string;
// }

// const bestSellingData: Product[] = [
//     { id: "1", name: "Apple iPhone 13", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=50&h=50&fit=crop", totalOrder: 104, status: "Stock", price: "৳999.00" },
//     { id: "2", name: "Nike Air Jordan", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop", totalOrder: 56, status: "Stock out", price: "৳999.00" },
//     { id: "3", name: "T-shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop", totalOrder: 266, status: "Stock", price: "৳999.00" },
//     { id: "4", name: "Cross Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop", totalOrder: 506, status: "Stock", price: "৳999.00" },
// ];

// const topProductsData: Product[] = [
//     { id: "p1", name: "Apple iPhone 13", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳999.00" },
//     { id: "p2", name: "Nike Air Jordan", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳72.40" },
//     { id: "p3", name: "T-shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳35.40" },
//     { id: "p4", name: "Assorted Cross Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳80.00" },
// ];

// const ProductAnalytics = () => {
//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-poppins">
//             {/* 1. Best Selling Product Section */}
//             <div className="lg:col-span-2 bg-white px-6 py-3 rounded-[8px] flex flex-col">
//                 <h2 className="text-lg font-bold text-[#23272E] font-lato mb-2">Best Selling Product</h2>

//                 <div className="overflow-x-auto flex-grow">
//                     <table className="w-full text-left">
//                         <thead className="bg-[#F3F6FF] rounded-[8px]">
//                             <tr className="text-[13px] font-normal text-[#6A717F] uppercase">
//                                 <th className="py-3 px-4 rounded-l-[8px] font-medium">Product</th>
//                                 <th className="py-3 px-4 font-medium">Total Order</th>
//                                 <th className="py-3 px-4 font-medium">Status</th>
//                                 <th className="py-3 px-4 rounded-r-[8px] font-medium">Price</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                             {bestSellingData.map((item) => (
//                                 <tr key={item.id} className="text-sm">
//                                     <td className="py-4 px-4">
//                                         <div className="flex items-center gap-3">
//                                             <img src={item.image} alt={item.name} className="w-10 h-10 rounded-[4px] object-cover bg-gray-100" />
//                                             <span className="font-semibold text-[#0F2D37]">{item.name}</span>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-4 text-slate-600">{item.totalOrder}</td>
//                                     <td className="py-4 px-4">
//                                         <div className="flex items-center gap-2">
//                                             <span className={`w-2 h-2 rounded-full ${item.status === "Stock" ? "bg-green-500" : "bg-red-500"}`}></span>
//                                             <span className={item.status === "Stock" ? "text-green-500" : "text-red-500"}>{item.status}</span>
//                                         </div>
//                                     </td>
//                                     <td className="py-4 px-4 font-bold text-[#0F2D37]">{item.price}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                     <button
//                         className="cursor-pointer font-lato px-8 py-1.5 border border-[#38BDF8] rounded-full text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
//                         style={{
//                             background: "linear-gradient(90deg, #38BDF8 0%, #1E90FF 100%)",
//                             WebkitBackgroundClip: "text",
//                             WebkitTextFillColor: "transparent",
//                             backgroundClip: "text",
//                         }}
//                     >
//                         Details
//                     </button>
//                 </div>
//             </div>

//             {/* 2. Top Products Section */}
//             <div className="bg-white px-6 py-3 rounded-[8px]">
//                 <div className="flex justify-between items-center mb-5">
//                     <h2 className="text-lg font-lato font-bold text-[#23272E]">Top Products</h2>
//                     <button
//                         className="cursor-pointer font-lato text-[12px] font-normal transition-all hover:opacity-80"
//                         style={{
//                             background: "linear-gradient(90deg, #38BDF8 0%, #1E90FF 100%)",
//                             WebkitBackgroundClip: "text",
//                             WebkitTextFillColor: "transparent",
//                             backgroundClip: "text",
//                         }}
//                     >
//                         All product
//                     </button>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="relative mb-6">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="w-full bg-[#F9FAFB] border-none rounded-[8px] py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-sky-200 outline-none placeholder:text-slate-400"
//                     />
//                 </div>

//                 {/* Product List */}
//                 <div className="space-y-4">
//                     {topProductsData.map((item, idx) => (
//                         <div key={item.id}>
//                             <div className="flex items-center justify-between group cursor-pointer">
//                                 <div className="flex items-center gap-3">
//                                     <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[4px] object-cover bg-gray-100" />
//                                     <div>
//                                         <h3 className="text-sm font-semibold text-[#0F2D37]">{item.name}</h3>
//                                         <p className="text-[10px] text-slate-400">Item: {item.itemCode}</p>
//                                     </div>
//                                 </div>
//                                 <span className="font-bold text-[#0F2D37] text-sm">{item.price}</span>
//                             </div>
//                             {idx !== topProductsData.length - 1 && <div className="mt-4 border-b border-gray-100"></div>}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default ProductAnalytics;

"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Loader2,
  BarChart3,
  TrendingUp,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services-api/dashboardService";
import Pagination from "../common/Pagination";
import DataTable from "../common/DataTable";

interface ProductAnalyticsProps {
  bestSellingData: any[];
  isLoading: boolean;
}

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({
  bestSellingData,
  isLoading,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const getImgUrl = (rawImg: string) => {
    if (!rawImg) return "/images/products/product.png";
    return rawImg.startsWith("http")
      ? rawImg
      : `${baseStorageUrl}/${rawImg.replace(/^\/+/, "")}`;
  };

  const filteredSidebarData = useMemo(() => {
    if (!sidebarSearch) return bestSellingData?.slice(0, 5);
    return bestSellingData
      ?.filter((item) =>
        item.name.toLowerCase().includes(sidebarSearch.toLowerCase()),
      )
      ?.slice(0, 5);
  }, [sidebarSearch, bestSellingData]);

  // 🚀 Fetch Full Report: Sorted by Best Sellers -> Remaining
  const { data: sellReport, isLoading: isReportLoading } = useQuery({
    queryKey: ["product-inventory-report", modalPage],
    queryFn: () => dashboardApi.getSellReport({ page: modalPage, limit: 10 }),
    enabled: isModalOpen,
  });

  const reportColumns = [
    {
      header: "Product Detail",
      key: "name",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <img
            src={getImgUrl(item.image)}
            className="w-10 h-10 rounded-lg border object-cover shadow-sm"
            alt=""
          />
          <div>
            <p className="font-bold text-[13px] text-[#023337] truncate max-w-[180px]">
              {item.name}
            </p>
            {item.total > 10 && (
              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">
                Best Seller
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Remaining Stock",
      key: "stock",
      render: (item: any) => {
        const isLow = item.stock <= 5 && item.stock > 0;
        const isOut = item.stock === 0;
        return (
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span
              className={`font-black text-xs ${isOut ? "text-rose-600" : isLow ? "text-amber-500" : "text-emerald-600"}`}
            >
              {item.stock} Units Left
            </span>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isOut ? "w-0" : isLow ? "bg-amber-400 w-1/3" : "bg-emerald-500 w-full"}`}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Total Sold",
      key: "total",
      render: (item: any) => (
        <span className="font-black text-gray-700">{item.total}</span>
      ),
    },
    {
      header: "Confirmed",
      key: "confirmed",
      className: "text-blue-500 font-bold",
    },
    {
      header: "Delivered",
      key: "delivered",
      className: "text-emerald-500 font-bold",
    },
    {
      header: "Returned",
      key: "returned",
      className: "text-rose-500 font-bold",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-poppins relative">
      {/* 1. Best Selling Table (Main) */}
      <div className="lg:col-span-2 bg-white px-6 py-3 rounded-[8px] flex flex-col shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-[#23272E] font-lato mb-2 flex items-center gap-2">
          <TrendingUp size={20} className="text-[#1DA1F2]" /> Best Selling
          Product
        </h2>
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left">
            <thead className="bg-[#F3F6FF]">
              <tr className="text-[13px] font-normal text-[#6A717F] uppercase">
                <th className="py-3 px-4 rounded-l-[8px]">Product</th>
                <th className="py-3 px-4 text-center">Sold</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 rounded-r-[8px] text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? [1, 2, 3, 4].map((i) => (
                    <tr key={i} className="animate-pulse h-16 bg-gray-50/50">
                      <td colSpan={4}></td>
                    </tr>
                  ))
                : bestSellingData?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="text-sm hover:bg-[#F8FBFF] transition-colors group"
                    >
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={getImgUrl(item.image)}
                          alt=""
                          className="w-10 h-10 rounded-[4px] object-cover bg-gray-100 border"
                        />
                        <span className="font-semibold text-[#0F2D37] truncate max-w-[200px]">
                          {item.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-center">
                        {item.totalOrder}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${item.status === "Stock" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span
                          className={
                            item.status === "Stock"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#0F2D37] text-right">
                        ৳{item.price}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer font-lato px-8 py-1.5 border border-[#38BDF8] rounded-full text-sm font-semibold transition-all hover:bg-sky-50 active:scale-95"
            style={{
              background: "linear-gradient(90deg, #38BDF8 0%, #1E90FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            See Details
          </button>
        </div>
      </div>

      {/* 2. Sidebar */}
      <div className="bg-white px-6 py-3 rounded-[8px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5 font-lato font-bold text-[#23272E]">
          <h2>Top Products</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[12px] text-[#1DA1F2] cursor-pointer hover:underline"
          >
            See All
          </button>
        </div>
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Filter sidebar..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-transparent rounded-[8px] py-2.5 pl-4 pr-10 text-sm focus:border-sky-200 outline-none placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="space-y-4">
          {filteredSidebarData?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between group cursor-pointer transition-transform hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getImgUrl(item.image)}
                  alt=""
                  className="w-12 h-12 rounded-[4px] object-cover bg-gray-100 border border-gray-50 shadow-sm"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[#0F2D37] truncate max-w-[120px]">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Sold: {item.totalOrder}
                  </p>
                </div>
              </div>
              <span className="font-bold text-[#1DA1F2] text-sm">
                ৳{item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 MODAL: Professional Paginated Report */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#023337]/30 backdrop-blur-md z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[20px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 flex justify-between items-center bg-white border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-[#1DA1F2]/10 p-3 rounded-2xl text-[#1DA1F2]">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#023337] font-lato leading-tight">
                    Sales & Remaining Inventory
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    Ranked by performance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-rose-500 rounded-full cursor-pointer transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {isReportLoading ? (
                <div className="h-80 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <Loader2 className="animate-spin text-[#1DA1F2]" size={32} />
                  <span>Aggregating data...</span>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
                  <DataTable
                    data={sellReport?.data || []}
                    columns={reportColumns}
                    rowKey="id"
                    gradiant={true}
                  />
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-[#F9FAFB] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
                  Inventory Count: {sellReport?.meta?.total || 0} Products
                </span>
              </div>
              <div className="scale-90 origin-right">
                <Pagination
                  currentPage={modalPage}
                  totalPages={sellReport?.meta?.lastPage || 1}
                  onPageChange={setModalPage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;

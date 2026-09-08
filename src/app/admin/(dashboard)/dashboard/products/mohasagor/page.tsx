"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMohasagorProducts } from "@/services-api/mohasagorService";
import { getAdminTokenAction } from "@/app/actions/auth";
import {
  Loader2,
  PackagePlus,
  ArrowLeft,
  X,
  Eye,
  Clock,
  AlertCircle,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Pagination from "@/components/admin/common/Pagination";
import { Product } from "@/@types/product.type";

type TabType = "pending" | "stock_out";

interface MohaProduct extends Product {
  moha_id: number; // Original Numeric ID (10289)
  id: string;      // Product Code (13289) - used as external_id
  stock_status?: string;
}

export default function MohasagorImportPage() {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<Map<string, any>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [previewProduct, setPreviewProduct] = useState<MohaProduct | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"details" | "variants">("details");
  const [allImportedExternalIds, setAllImportedExternalIds] = useState<string[]>([]);
  const [isAutoSkipping, setIsAutoSkipping] = useState(false);

  // 1. QUERY: GET ALL IMPORTED IDs IN YOUR DB
  const { refetch: refetchImportedStatus, isLoading: isLoadingImportedList } = useQuery({
    queryKey: ["mohasagor-imported-ids-all"],
    queryFn: async () => {
      const token = await getAdminTokenAction();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/check-imported`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ids: [] }), 
      });
      const result = await res.json();
      const ids = Array.isArray(result) ? result : (result?.data || []);
      setAllImportedExternalIds(ids.map(String));
      return ids as string[];
    },
  });

  // 2. QUERY: EXTERNAL API FEED (REVERSE MIRROR LOGIC)
  const {
    data: externalData,
    isLoading: isLoadingExternal,
    refetch: refetchExternal,
  } = useQuery({
    queryKey: ["mohasagor-external-feed", currentPage],
    queryFn: async () => {
      const metaResponse = await fetchMohasagorProducts(1);
      const totalPages = metaResponse.pagination.total_pages;
      const targetApiPage = Math.max(1, totalPages - currentPage + 1);
      return fetchMohasagorProducts(targetApiPage);
    },
  });

  // 3. DATA PROCESSING
  const { currentItems, globalUnimportedCount } = useMemo(() => {
    const rawExternal = (externalData?.data || []) as MohaProduct[];
    const sorted = [...rawExternal].sort((a, b) => (b.moha_id || 0) - (a.moha_id || 0));

    const unimportedItems = sorted.filter(p => !allImportedExternalIds.includes(String(p.id)));

    const stocked = unimportedItems.filter(p => p.quantity > 0 || p.stock_status === "available");
    const stockOut = unimportedItems.filter(p => p.quantity === 0 && p.stock_status !== "available");

    const totalApi = externalData?.pagination?.total_items || 0;
    const totalImported = allImportedExternalIds.length;

    return {
      currentItems: activeTab === "pending" ? stocked : stockOut,
      globalUnimportedCount: Math.max(0, totalApi - totalImported)
    };
  }, [activeTab, externalData, allImportedExternalIds]);

  const totalPagesCount = externalData?.pagination?.total_pages || 1;

  // 4. AUTO-SKIP LOGIC
  useEffect(() => {
    if (!isLoadingExternal && !isLoadingImportedList && externalData) {
      if (currentItems.length === 0 && currentPage < totalPagesCount) {
        setIsAutoSkipping(true);
        const timer = setTimeout(() => {
          setCurrentPage((prev) => prev + 1);
          setIsAutoSkipping(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentItems.length, isLoadingExternal, isLoadingImportedList, currentPage, totalPagesCount, externalData]);

  // 5. SELECTION & MUTATION
  const isAllSelected = currentItems.length > 0 && 
    currentItems.every((p: MohaProduct) => selectedItems.has(p.id));

  const handleSelectAll = () => {
    const next = new Map(selectedItems);
    if (isAllSelected) {
      currentItems.forEach((p: MohaProduct) => next.delete(p.id));
    } else {
      currentItems.forEach((p: MohaProduct) => next.set(p.id, p));
    }
    setSelectedItems(next);
  };

  const toggleSelect = (item: MohaProduct) => {
    const next = new Map(selectedItems);
    const key = String(item.id);
    if (next.has(key)) next.delete(key);
    else next.set(key, item);
    setSelectedItems(next);
  };

  const importMutation = useMutation({
    mutationFn: async (items: any[]) => {
      const token = await getAdminTokenAction();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/bulk-import-mohasagor`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items }),
      });
      return res.json();
    },
    onSuccess: (res) => {
      toast.success(`Imported ${res.imported} items.`);
      setSelectedItems(new Map());
      refetchImportedStatus(); 
      queryClient.invalidateQueries({ queryKey: ["mohasagor-external-feed"] });
    },
  });

  if (isLoadingExternal && !externalData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="animate-spin text-black" size={32} />
        <p className="text-sm text-gray-500 font-medium">Reversing feed to newest items first...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-poppins pb-10">
      
      {/* TOOLBAR */}
      <div className="bg-white p-5 border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/products" className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-black text-[18px] font-medium  tracking-tight">Mohasagor Feed</h1>
            
            <div className="flex bg-gray-100 p-1 rounded-xl ml-4">
              <button 
                onClick={() => { setActiveTab("pending"); setCurrentPage(1); setSelectedItems(new Map()); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === "pending" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
              >
                <Clock size={14} /> Pending ({globalUnimportedCount})
              </button>
              <button 
                onClick={() => { setActiveTab("stock_out"); setCurrentPage(1); setSelectedItems(new Map()); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === "stock_out" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
              >
                <AlertCircle size={14} /> Stock Out
              </button>
            </div>
          </div>

          {selectedItems.size > 0 && (
            <button 
              onClick={() => importMutation.mutate(Array.from(selectedItems.values()))}
              className="bg-[linear-gradient(90deg,#38BDF8_0%,#1E90FF_100%)] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:opacity-90 flex items-center gap-2 animate-in slide-in-from-right transition-all"
            >
              {importMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <PackagePlus size={18} />}
              Bulk Import ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-[1600px] mx-auto px-5 mt-6">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm min-h-[500px] relative">
          
          {(isLoadingExternal || isAutoSkipping) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
              {isAutoSkipping ? (
                <>
                  <SkipForward className="text-black animate-bounce" size={32} />
                  <p className="text-black font-bold text-sm">Skipping imported products on page {currentPage}...</p>
                </>
              ) : (
                <>
                  <Loader2 className="animate-spin text-black" size={36} />
                  <p className="text-gray-400 text-sm font-medium">Fetching 200 items...</p>
                </>
              )}
            </div>
          )}

          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] border-b border-gray-100">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded accent-[#1E90FF] cursor-pointer"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-black text-xs font-bold uppercase">Image</th>
                <th className="px-4 py-3 text-black text-xs font-bold uppercase">Product Info</th>
                <th className="px-4 py-3 text-black text-xs font-bold uppercase">Price</th>
                <th className="px-4 py-3 text-black text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((item: MohaProduct) => {
                  const isSelected = selectedItems.has(String(item.id));
                  return (
                    <tr key={item.id} className={`${isSelected ? 'bg-blue-50/40' : 'hover:bg-gray-50/30'} transition-colors`}>
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded accent-[#1E90FF] cursor-pointer" 
                          checked={isSelected} 
                          onChange={() => toggleSelect(item)} 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img src={(item.images?.[0] as any)?.url || "/placeholder.png"} className="w-12 h-12 object-cover rounded-lg bg-white" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[14px] text-[#1D1A1A] font-semibold line-clamp-1 max-w-[500px]">{item.name}</div>
                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase">
                           Moha-ID: <span className="text-black font-bold">{item.moha_id || item.id}</span>
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#1D1A1A]">৳{item.sell_price}</td>
                      <td className="px-4 py-3 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setPreviewProduct(item); setActiveImage((item.images?.[0] as any)?.url); }} className="p-2 text-black hover:bg-gray-100 rounded-lg border border-gray-100 transition-all cursor-pointer"><Eye size={18} /></button>
                            <button onClick={() => importMutation.mutate([item])} className="px-4 py-1.5 bg-[linear-gradient(90deg,#38BDF8_0%,#1E90FF_100%)] text-white text-xs font-medium rounded-lg hover:opacity-90">Import</button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center text-gray-400 font-medium italic">
                     {currentPage >= totalPagesCount ? "End of Mohasagor feed reached." : "Searching for unimported products..."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-[#F9FAFB]">
             <Pagination 
                currentPage={currentPage} 
                totalPages={totalPagesCount} 
                onPageChange={(p) => {
                  setCurrentPage(p);
                  setSelectedItems(new Map());
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
             />
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-white">
              <div>
                <h2 className="font-bold text-black text-lg truncate max-w-md">{previewProduct.name}</h2>
                <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">External Reference: {previewProduct.id}</p>
              </div>
              <button onClick={() => { setPreviewProduct(null); setActiveImage(null); }} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-400 hover:text-red-500 transition-all">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              <div className="w-full md:w-5/12 p-8 bg-[#F9FAFB] border-r border-gray-50">
                <div className="bg-white rounded-xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  <img src={activeImage || "/placeholder.png"} className="max-h-full max-w-full object-contain transition-all duration-500 transform hover:scale-105" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {previewProduct.images?.map((img: any, i: number) => (
                    <div key={i} onClick={() => setActiveImage(img.url || img)} className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all bg-white flex items-center justify-center p-1 ${activeImage === (img.url || img) ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img.url || img} className="max-h-full max-w-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col bg-white">
                <div className="p-8 border-b border-gray-50 flex items-center gap-12 bg-white">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Our Price</p>
                    <p className="text-3xl font-bold text-[#1D1A1A]">৳{previewProduct.sell_price}</p>
                  </div>
                  <div className="h-10 w-[1px] bg-gray-200" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Stock Status</p>
                    <div className="text-sm font-medium">
                      {(previewProduct.quantity === 999 || previewProduct.stock_status === "available") ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">Available</span>
                      ) : previewProduct.quantity > 0 ? (
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Stock: {previewProduct.quantity}</span>
                      ) : (
                        <span className="text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">Stock Out</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex bg-[#F9FAFB] px-8 border-b sticky top-0 z-10">
                  <button onClick={() => setActiveModalTab("details")} className={`py-4 text-xs font-bold uppercase transition-all border-b-2 mr-8 cursor-pointer ${activeModalTab === "details" ? "border-black text-black" : "border-transparent text-gray-400"}`}>Description</button>
                  <button onClick={() => setActiveModalTab("variants")} className={`py-4 text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${activeModalTab === "variants" ? "border-black text-black" : "border-transparent text-gray-400"}`}>Variants</button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto bg-white">
                  {activeModalTab === "details" ? (
                    <div className="text-sm text-[#1D1A1A] leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewProduct.description ?? "" }}/>
                  ) : (
                    <div className="grid gap-3">
                      {previewProduct.variants?.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-[#F9FAFB]">
                          <div className="flex items-center gap-3">
                            <p className="text-[13px] font-bold text-[#1D1A1A]">{v.attributes?.[0]?.value || 'Standard Edition'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-[#1D1A1A]">৳{v.price}</p>
                             <p className="text-[10px] text-gray-400 font-medium">Stock: {v.stock === 999 ? 'Available' : v.stock}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-gray-50 bg-white">
                   <button 
                      disabled={importMutation.isPending}
                      onClick={() => { importMutation.mutate([previewProduct]); setPreviewProduct(null); setActiveImage(null); }}
                      className="w-full bg-[linear-gradient(90deg,#38BDF8_0%,#1E90FF_100%)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] cursor-pointer"
                   >
                     {importMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <PackagePlus size={20} />}
                     Confirm Import
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
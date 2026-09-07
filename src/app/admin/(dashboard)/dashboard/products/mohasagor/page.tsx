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
  CheckCircle2,
  Info,
  ListTree,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Pagination from "@/components/admin/common/Pagination";

export default function MohasagorImportPage() {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<Map<string, any>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "variants">("details");
  const [importedIds, setImportedIds] = useState<string[]>([]);

  // 1. Fetch External Products
  const {
    data: externalData,
    isLoading: isLoadingExternal,
    refetch: refetchExternal,
  } = useQuery({
    queryKey: ["mohasagor-external-feed", currentPage],
    queryFn: () => fetchMohasagorProducts(currentPage),
  });

  const rawProducts = useMemo(() => {
    return externalData?.data?.slice(0, 10) || [];
  }, [externalData]);

  // 2. SYNC IMPORTED STATUS
  useEffect(() => {
    const checkImportedStatus = async () => {
      if (rawProducts.length === 0) return;
      try {
        const token = await getAdminTokenAction();
        const idsToCheck = rawProducts.map((p: any) => String(p.id));
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/check-imported`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ids: idsToCheck }),
        });
        const result = await res.json();
        if (Array.isArray(result)) setImportedIds(result);
        else if (result && Array.isArray(result.data)) setImportedIds(result.data);
      } catch (err) {
        console.error("Failed to sync imported status", err);
      }
    };
    checkImportedStatus();
  }, [rawProducts]);

  const pagination = externalData?.pagination;

  // 3. Import Mutation
  const importMutation = useMutation({
    mutationFn: async (items: any[]) => {
      const token = await getAdminTokenAction();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/bulk-import-mohasagor`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items }),
      });
      const responseJson = await res.json();
      if (!res.ok) throw new Error(responseJson?.message || "Import failed");
      return responseJson;
    },
    onSuccess: (res) => {
      toast.success(`Processed: ${res.imported} imported.`);
      setSelectedItems(new Map());
      queryClient.invalidateQueries({ queryKey: ["products-list-panel"] });
      refetchExternal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleSelect = (item: any) => {
    const isAlreadyImported = Array.isArray(importedIds) && importedIds.includes(String(item.id));
    if (isAlreadyImported) return;
    const next = new Map(selectedItems);
    const key = String(item.id);
    if (next.has(key)) next.delete(key);
    else next.set(key, item);
    setSelectedItems(next);
  };

  if (isLoadingExternal) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-gray-400 gap-2 font-poppins">
        <Loader2 className="animate-spin text-[#023337]" size={24} />
        <span className="text-xs">Loading external feed...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-poppins pb-10">
      
      {/* MODAL SECTION */}
      {previewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#023337]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-white">
              <div>
                <h2 className="font-bold text-[#023337] text-lg truncate max-w-md">{previewProduct.name}</h2>
                <p className="text-[10px] text-gray-400 font-mono uppercase mt-1">SKU: {previewProduct.sku}</p>
              </div>
              <button onClick={() => { setPreviewProduct(null); setActiveImage(null); }} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-400 hover:text-red-500">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              <div className="w-full md:w-5/12 p-8 bg-[#F9FAFB] border-r border-gray-50">
                <div className="bg-white rounded-xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  <img src={activeImage || previewProduct.images?.[0]?.url || "/placeholder.png"} className="max-h-full max-w-full object-contain transition-all duration-300 transform hover:scale-105" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {previewProduct.images?.map((img: any, i: number) => (
                    <div key={i} onClick={() => setActiveImage(img.url)} className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all bg-white flex items-center justify-center p-1 ${activeImage === img.url ? "border-[#023337]" : "border-transparent opacity-60"}`}>
                      <img src={img.url} className="max-h-full max-w-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col bg-white">
                <div className="p-8 border-b border-gray-50 flex items-center gap-12 bg-white">
                  <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Our Price</p><p className="text-3xl font-bold text-[#1D1A1A]">৳{previewProduct.sell_price}</p></div>
                  <div className="h-10 w-[1px] bg-gray-200" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Stock Status</p>
                    {/* 🚀 FIXED: Changed <td> to <div> to solve Hydration Error */}
                    <div className="text-sm font-medium">
                      {previewProduct.stock_status === "available" ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">Available</span>
                      ) : (
                        <span className="text-gray-500">{previewProduct.quantity}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex bg-[#F9FAFB] px-8 border-b sticky top-0 z-10">
                  <button onClick={() => setActiveTab("details")} className={`py-4 text-xs font-bold uppercase transition-all border-b-2 mr-8 cursor-pointer ${activeTab === "details" ? "border-[#023337] text-[#023337]" : "border-transparent text-gray-400"}`}>Description</button>
                  <button onClick={() => setActiveTab("variants")} className={`py-4 text-xs font-bold uppercase transition-all border-b-2 cursor-pointer ${activeTab === "variants" ? "border-[#023337] text-[#023337]" : "border-transparent text-gray-400"}`}>Variants</button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                  {activeTab === "details" ? (
                    <div className="text-sm text-[#1D1A1A] leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewProduct.description }} />
                  ) : (
                    <div className="grid gap-3">
                      {previewProduct.variants?.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-[#F9FAFB]">
                          <div className="flex items-center gap-3">
                            <img src={v.images?.[0] || previewProduct.images?.[0]?.url} className="w-10 h-10 object-contain rounded bg-white border" />
                            <p className="text-[13px] font-bold text-[#1D1A1A]">{v.attributes?.[0]?.value || 'Standard'}</p>
                          </div>
                          <p className="text-sm font-bold text-[#1D1A1A]">৳{v.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-gray-50 bg-white">
                  <button 
                    disabled={importMutation.isPending || (Array.isArray(importedIds) && importedIds.includes(String(previewProduct.id)))}
                    onClick={() => { importMutation.mutate([previewProduct]); setPreviewProduct(null); setActiveImage(null); }}
                    className="w-full bg-[#023337] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer shadow-lg shadow-gray-100"
                  >
                    {importMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <PackagePlus size={20} />}
                    {Array.isArray(importedIds) && importedIds.includes(String(previewProduct.id)) ? "Already in Database" : "Confirm Import"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="bg-white p-5 border-b border-gray-100 mb-6 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#023337]">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-black text-[22px] font-medium">Mohasagor Feed</h1>
          </div>
          {selectedItems.size > 0 && (
            <button onClick={() => importMutation.mutate(Array.from(selectedItems.values()))} className="bg-[#023337] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:opacity-90 cursor-pointer flex items-center gap-2">
              <PackagePlus size={18} /> Bulk Import ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-[1600px] mx-auto px-5">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] border-b border-gray-100">
              <tr>
                <th className="p-4 w-12 text-center text-[#023337] text-sm font-bold">Select</th>
                <th className="px-4 py-3 text-[#023337] text-sm font-bold">Image</th>
                <th className="px-4 py-3 text-[#023337] text-sm font-bold">Name</th>
                <th className="px-4 py-3 text-[#023337] text-sm font-bold">Price</th>
                <th className="px-4 py-3 text-[#023337] text-sm font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rawProducts.map((item: any) => {
                const isSelected = selectedItems.has(String(item.id));
                const isImported = Array.isArray(importedIds) && importedIds.includes(String(item.id));
                return (
                  <tr key={item.id} className={`${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                    <td className="p-4 text-center">
                       {!isImported ? (
                          <input type="checkbox" className="w-4 h-4 rounded accent-[#023337] cursor-pointer" checked={isSelected} onChange={() => toggleSelect(item)} />
                       ) : <CheckCircle2 size={18} className="text-green-600 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <img src={item.images?.[0]?.url} className="w-11 h-11 object-cover rounded-lg bg-gray-50 border" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[15px] text-[#1D1A1A] font-normal truncate max-w-[400px]">{item.name}</div>
                      <p className="text-[11px] text-gray-400 font-mono uppercase mt-0.5">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#1D1A1A]">৳{item.sell_price}</td>
                    <td className="px-4 py-3 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setPreviewProduct(item); setActiveImage(item.images?.[0]?.url); }} className="p-2 text-[#023337] hover:bg-gray-100 rounded-full border border-gray-50 cursor-pointer"><Eye size={18} /></button>
                          {!isImported && (
                            <button onClick={() => importMutation.mutate([item])} className="px-4 py-1.5 bg-[#023337] text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer">Import</button>
                          )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-[#F9FAFB]">
             <Pagination currentPage={currentPage} totalPages={pagination?.total_pages || 1} onPageChange={(p) => setCurrentPage(p)} />
          </div>
        </div>
      </div>
    </div>
  );
}
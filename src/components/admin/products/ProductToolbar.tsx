"use client";

import React, { useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";
import PrimaryButton from "../common/PrimaryButton";
import ImportFileIcon from "@/components/store-front/svg/svg/ImportFileIcon";
import ExportIcon from "@/components/store-front/svg/svg/ExportIcon";
import SelectTrigger from "../common/SelectTrigger";
import PluseIcon from "@/components/store-front/svg/svg/PluseIcon";
import ViewIcon from "@/components/store-front/svg/svg/ViewIcon";

export default function ProductToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active query sync state variables
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category_id") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentLimit = searchParams.get("limit") || "10";

  // Async fetch categories tree for filtering
  const { data: treeRes } = useQuery({
    queryKey: ["categories-tree-filter"],
    queryFn: async () => {
      const res = await apiFetch("/categories/tree");
      return res.json();
    }
  });

  // 🚀 FIXED: Defensively unpack categories hierarchy array to match your NestJS Tree response schema
  const categories = (() => {
    if (Array.isArray(treeRes)) return treeRes;
    if (treeRes && Array.isArray(treeRes.data)) return treeRes.data;
    if (treeRes && Array.isArray(treeRes.categories)) return treeRes.categories;
    return [];
  })();

  const updateSearchQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1"); // Reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  // 🚀 LIVE EXPORT ROUTING
  const handleExportExcel = async () => {
    try {
      const token = await getAdminTokenAction();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/export`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token || ""}` }
      });
      if (!res.ok) throw new Error("Export generation sequence failed");
      
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `products_catalog_export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(`Export Fault: ${err.message}`);
    }
  };

  // 🚀 LIVE IMPORT ROUTING
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = await getAdminTokenAction();
      const multiForm = new FormData();
      multiForm.append("file", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` },
        body: multiForm
      });

      const responseJson = await res.json();
      if (!res.ok) throw new Error(responseJson?.message || "File processing failure.");

      alert(`Import Success! Mapped: ${responseJson.successCount} rows, Errors: ${responseJson.failedCount}`);
      window.location.reload();
    } catch (err: any) {
      alert(`Import Fault: ${err.message}`);
    }
  };

  return (
    <div className="w-full bg-white p-5 font-lato border-b border-gray-100">
      <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleImportExcel} />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 className="text-[#023337] text-[22px] font-bold">Products</h2>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Search Input Bar */}
          <div className="relative flex items-center bg-[#F9F9F9] border border-gray-100 rounded-[8px] px-3 py-2 w-full md:w-[292px]">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              defaultValue={currentSearch}
              onKeyDown={(e) => { if (e.key === 'Enter') updateSearchQuery("search", (e.target as HTMLInputElement).value); }}
              placeholder="Search products/SKU..."
              className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-[#7B7B7B]"
            />
          </div>

          <div className="border border-[#F7931E] rounded-[8px] px-3 py-1 flex flex-col justify-center cursor-pointer hover:bg-orange-50 transition-colors w-full sm:w-auto">
            <span className="text-[12px] text-[#070707] font-poppins font-medium">View</span>
            <div className="flex items-center gap-2">
              <ViewIcon />
              <span className="text-[15px] font-poppins font-normal text-[#070707]">Large icons</span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <PrimaryButton
              onClick={() => router.push("/admin/dashboard/products/add")}
              label="Add Product"
              icon={<PluseIcon />}
            />
          </div>
        </div>
      </div>

      {/* Action and Filtering Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[#161719] text-sm font-bold hover:opacity-80 cursor-pointer">
            <ImportFileIcon /> Import
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-2 text-[#161719] text-sm font-bold hover:opacity-80 cursor-pointer">
            <ExportIcon /> Export
          </button>

          {/* Limit Selector */}
          <select 
            value={currentLimit} 
            onChange={(e) => updateSearchQuery("limit", e.target.value)}
            className="bg-[#F9FAFB] border text-xs px-3 py-2 rounded-[6px] outline-none text-gray-700 cursor-pointer"
          >
            <option value="10">10 Products</option>
            <option value="25">25 Products</option>
            <option value="50">50 Products</option>
          </select>
        </div>

        {/* Live Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 mr-1">
            <ThreeBarIcon color="black" />
            <span className="text-sm font-normal text-black">Filter :</span>
          </div>

          {/* Category Dropdown Selector */}
          <select
            value={currentCategory}
            onChange={(e) => updateSearchQuery("category_id", e.target.value)}
            className="bg-[#F9FAFB] border text-xs px-3 py-2 rounded-[6px] outline-none text-gray-700 cursor-pointer max-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Dropdown Selector */}
          <select
            value={currentStatus}
            onChange={(e) => updateSearchQuery("status", e.target.value)}
            className="bg-[#F9FAFB] border text-xs px-3 py-2 rounded-[6px] outline-none text-gray-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Search } from "lucide-react";

export default function AdminControlHead() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for the search input to allow real-time typing
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Helper to update URL params
  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on search/filter
    router.push(`${pathname}?${params.toString()}`);
  };

  // EFFECT: Debounce Search
  // This triggers the search after the user stops typing for 500ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Only update if the value actually changed from the URL param
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateUrlParam("search", searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="w-full bg-white p-5 font-lato mt-2 border-b border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-[#023337] text-[22px] font-bold">Admin Control</h2>
        
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Search Input - Real Time with Debounce */}
          <div className="relative w-full md:w-[300px]">
            <input
              type="text"
              placeholder="Search Admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F9F9F9] border border-gray-200 rounded-[8px] pl-10 pr-4 py-3 outline-none w-full focus:border-[#1DA1F2] transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>

          {/* Status Select - Matches your lowercase DB enums */}
          <select
            value={searchParams.get("status") || ""}
            onChange={(e) => updateUrlParam("status", e.target.value)}
            className="bg-[#F9F9F9] border border-gray-200 px-4 py-3 rounded-[8px] cursor-pointer outline-none focus:border-[#1DA1F2] text-sm font-medium text-gray-700"
          >
            <option value="">All Status</option>
            {/* Value 'active' matches your DB Enum active */}
            <option value="active">Publish</option> 
            {/* Value 'blocked' matches your DB Enum blocked */}
            <option value="blocked">Draft</option>
          </select>

          <button
            onClick={() => router.push("/admin/dashboard/admin-control/add")}
            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-[8px] flex items-center gap-2 font-semibold transition-colors"
          >
            <Plus size={20} /> Add Role
          </button>
        </div>
      </div>
    </div>
  );
}
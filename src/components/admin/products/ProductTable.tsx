"use client";

import React, { useState } from "react";
import { TableColumn } from "@/@types/order.type";
import { Product } from "@/@types/product.type";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";
import { MoreVertical, Trash2, Edit3, Loader2 } from "lucide-react";
import DataTable from "../common/DataTable";
import Pagination from "../common/Pagination";

interface ExtendedTableColumn<T> extends TableColumn<T> {
  headerRender?: () => React.ReactNode;
  headerClassName?: string;
}

export default function ProductTable() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read live URL parameters to pass directly into your backend queries
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const category_id = searchParams.get("category_id") || "";
  const status = searchParams.get("status") || "";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const { data: fetchResponse, isLoading } = useQuery({
    queryKey: ["products-list-panel", page, limit, search, category_id, status],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(page));
      queryParams.set("limit", String(limit));
      if (search) queryParams.set("search", search);
      if (category_id) queryParams.set("category_id", category_id);
      if (status) queryParams.set("status", status);

      const res = await apiFetch(`/products?${queryParams.toString()}`, {
        method: "GET"
      });

      if (!res.ok) throw new Error("Failed to sync catalog rows");
      return res.json();
    },
  });

  // 🚀 FIXED: Double unpack to unwrap response.data.data safely to bypass the nest
  const productList = (() => {
    if (!fetchResponse) return [];
    
    // Check if the payload matches your precise Postman structure envelope
    if (fetchResponse.data && Array.isArray(fetchResponse.data.data)) {
      return fetchResponse.data.data;
    }
    if (Array.isArray(fetchResponse.data)) {
      return fetchResponse.data;
    }
    if (Array.isArray(fetchResponse)) {
      return fetchResponse;
    }
    return [];
  })();

  // 🚀 FIXED: Safely read meta details object from the first data level layer
  const meta = fetchResponse?.data?.meta || fetchResponse?.meta || { totalPages: 1, total: 0 };

  // 🚀 DELETE PRODUCT MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAdminTokenAction();
      const res = await apiFetch(`/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (!res.ok) throw new Error("Could not drop target catalog item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-list-panel"] });
      alert("Product successfully deleted from catalog.");
      setActiveMenuId(null);
    },
    onError: (err: any) => alert(err.message),
  });

  const handlePageChange = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === productList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productList.map((product: any) => product.id));
    }
  };

  const productColumns: ExtendedTableColumn<any>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[40px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer inline-block vertical-middle"
          checked={
            selectedIds.length === productList.length && productList.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      render: (product) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(product.id)}
          onChange={() => handleSelectRow(product.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (_, index) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {(page - 1) * limit + (index ?? 0) + 1}
        </span>
      ),
    },
    {
      header: "Image",
      key: "image",
      render: (product) => {
        const rawImg = Array.isArray(product.images) ? product.images[0] : null;
        const srcUrl = rawImg && rawImg !== "undefined"
          ? rawImg.startsWith("http")
            ? rawImg
            : `${baseStorageUrl}${rawImg}`
          : "/images/products/product2.png";
        return (
          <div className="flex items-center">
            <img
              src={srcUrl}
              alt={product.name}
              width={45}
              height={45}
              className="rounded-[8px] object-cover"
            />
          </div>
        );
      },
    },
    {
      header: "Name",
      key: "name",
      render: (product) => (
        <span
          className="text-[15px] text-[#1D1A1A] font-normal block max-w-[300px]"
          title={product.name}
        >
          {product.name}
        </span>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      header: "Sub Category",
      key: "subCategory",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.subCategory || "N/A"}
        </span>
      ),
    },
    {
      header: "Priority",
      key: "priority",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.priority}%
        </span>
      ),
    },
    {
      header: "SKU",
      key: "sku",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.sku || "N/A"}
        </span>
      ),
    },
    {
      header: "Tags",
      key: "tags",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.meta_tags || "None"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (product) => (
        <div
          className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
            product.status === "PUBLISHED"
              ? "bg-[#C1FFBC] text-[#085E00]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {product.status === "PUBLISHED" ? "Publish" : product.status}
        </div>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (product) => (
        <div className="relative">
          <button
            onClick={() =>
              setActiveMenuId(activeMenuId === product.id ? null : product.id)
            }
            className="text-black p-1 transition-colors cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>

          {activeMenuId === product.id && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={() =>
                  router.push(`/admin/dashboard/products/add?id=${product.id}`)
                }
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              >
                <Edit3 size={12} /> Edit Item
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this product?"))
                    deleteMutation.mutate(product.id);
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
              >
                <Trash2 size={12} /> Delete Item
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-white flex flex-col items-center justify-center text-gray-400 gap-2 font-poppins">
        <Loader2 className="animate-spin text-gray-400" size={24} />
        <span className="text-xs">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins">
      <DataTable
        data={productList}
        columns={productColumns}
        rowKey="id"
        gradiant={true}
      />
      {productList.length > 0 && (
        <div className="py-5 md:mx-10 mx-2">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
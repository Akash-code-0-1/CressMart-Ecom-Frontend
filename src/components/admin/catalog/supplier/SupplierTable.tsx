"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MoreVertical, Trash2, Edit3, Loader2 } from "lucide-react";
import {
  fetchAllSuppliers,
  deleteSupplier,
  Supplier,
} from "@/services-api/supplierService";
import DataTable from "../../common/DataTable";
import Pagination from "../../common/Pagination";
import toast from "react-hot-toast";
import Image from "next/image";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

export default function SupplierTable() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const { data: serverPayload, isLoading } = useQuery({
    queryKey: ["catalog-suppliers-list", page, limit, search, status],
    queryFn: () => {
      let mappedStatus = "";
      if (status === "PUBLISHED" || status === "active")
        mappedStatus = "active";
      if (status === "DRAFT" || status === "inactive")
        mappedStatus = "inactive";

      return fetchAllSuppliers({
        page,
        limit,
        search,
        status: mappedStatus,
      });
    },
  });

  const supplierList = serverPayload?.data || [];
  const meta = serverPayload?.meta || { totalPages: 1, total: 0 };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-suppliers-list"] });
      toast.success("Supplier removed successfully.");
      setActiveMenuId(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === supplierList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(supplierList.map((item: Supplier) => item.id));
    }
  };

  const supplierColumns: TableColumn<Supplier>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 accent-[#1DA1F2] cursor-pointer"
          checked={
            selectedIds.length === supplierList.length &&
            supplierList.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      render: (supplier) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(supplier.id)}
          onChange={() => handleSelectRow(supplier.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (_, index) => (
        <span>{(page - 1) * limit + (index ?? 0) + 1}</span>
      ),
    },
    {
      header: "Image/Logo",
      key: "image",
      render: (supplier) => {
        const rawImg = supplier.image_url;
        const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
        const isValidImg = cleanImg.replace(/^\/+/, "").length > 0;
        const srcUrl = isValidImg
          ? cleanImg.startsWith("http")
            ? cleanImg
            : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`
          : "/images/products/product2.png";
        return (
          <Image
            width={45}
            height={45}
            src={srcUrl}
            alt={supplier.name}
            unoptimized
            className="rounded-[8px] object-cover h-11 w-11 bg-gray-50 border border-gray-100"
          />
        );
      },
    },
    {
      header: "Name",
      key: "name",
      render: (supplier) => (
        <div>
          <span className="font-medium text-black block">{supplier.name}</span>
          <span className="text-xs text-gray-400 block">{supplier.slug}</span>
        </div>
      ),
    },
    {
      header: "Contact Info",
      key: "contact",
      render: (supplier) => (
        <div className="text-xs">
          {supplier.phone && <p className="text-gray-700">{supplier.phone}</p>}
          {supplier.email && <p className="text-gray-500">{supplier.email}</p>}
          {!supplier.phone && !supplier.email && (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: "Products Count",
      key: "products",
      render: (supplier) => <span>{supplier._count?.products ?? 0}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (supplier) => {
        const isActive = supplier.status === "active";
        return (
          <div
            className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
              isActive
                ? "bg-[#C1FFBC] text-[#085E00]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isActive ? "Active" : "Draft"}
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      render: (supplier) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPos({
              top: rect.bottom + window.scrollY + 8,
              left: rect.left - 160,
            });
            setActiveMenuId(activeMenuId === supplier.id ? null : supplier.id);
          }}
          className="p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
        >
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-white flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 className="animate-spin text-[#1DA1F2]" size={24} />
        <span className="text-xs">Loading suppliers...</span>
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins relative">
      <DataTable
        data={supplierList}
        columns={supplierColumns}
        rowKey="id"
        gradiant={true}
      />

      {/* --- ACTION MENU --- */}
      {activeMenuId && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[9999] w-[210px] animate-in fade-in zoom-in duration-150"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
            <button
              onClick={() => {
                router.push(`/admin/dashboard/supplier/add?id=${activeMenuId}`);
                setActiveMenuId(null);
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <Edit3
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">Edit Item</span>
            </button>
          </div>

          <div className="px-2">
            <button
              onClick={() => {
                if (window.confirm("Delete supplier permanently?")) {
                  deleteMutation.mutate(activeMenuId);
                }
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors font-bold cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Delete Item</span>
            </button>
          </div>
        </div>
      )}

      {supplierList.length > 0 && (
        <div className="py-5 md:mx-10 mx-2">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(p) => {
              setSelectedIds([]);
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(p));
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </div>
      )}
    </div>
  );
}

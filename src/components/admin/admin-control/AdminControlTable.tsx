"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import DataTable from "../common/DataTable";

// 🚀 Safe transparent fallback SVG from your working file
const FALLBACK_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 45 45'><rect width='45' height='45' fill='%23F3F4F6'/><circle cx='22.5' cy='18' r='7' fill='%239CA3AF'/><path d='M10,38 C10,30 16,26 22.5,26 C29,26 35,30 35,38' fill='%239CA3AF'/></svg>";

export default function AdminControlTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isStatusSubMenuOpen, setIsStatusSubMenuOpen] = useState(false);

  // Derive Backend URL exactly as you did in CustomerTable
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
  const BACKEND_URL = baseApiUrl.replace("/api/v1", "");

  // Modern Date Formatting Helper
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff", searchParams.toString()],
    queryFn: async () => {
      const res = await apiFetch(
        `/users/admin/staff?${searchParams.toString()}`,
      );
      return res.json();
    },
  });

  const handleStatusUpdate = async (id: string, uiStatus: "PUBLISH" | "DRAFT") => {
    const backendStatus = uiStatus === "PUBLISH" ? "active" : "blocked";
    try {
      const res = await apiFetch(`/users/admin-update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus }),
      });

      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
        setActiveMenuId(null);
        setIsStatusSubMenuOpen(false);
      }
    } catch (error) {
      alert("Network error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      setActiveMenuId(null);
    }
  };

  const columns = [
    {
      header: "",
      key: "checkbox",
      headerRender: () => <input type="checkbox" className="accent-[#1DA1F2]" />,
      render: () => <input type="checkbox" className="accent-[#1DA1F2]" />,
    },
    { header: "SL", key: "sl", render: (_: any, i: number) => i + 1 },
    {
      header: "Picture",
      key: "picture",
      render: (item: any) => {
        // EXACT IMAGE LOGIC FROM YOUR CUSTOMERTABLE
        let finalAvatar = FALLBACK_AVATAR;

        if (item.avatar && item.avatar.trim() !== "") {
          if (item.avatar.startsWith("http") || item.avatar.startsWith("data:")) {
            finalAvatar = item.avatar;
          } else {
            const cleanPath = item.avatar.startsWith("/") ? item.avatar : `/${item.avatar}`;
            finalAvatar = `${BACKEND_URL}${cleanPath}`;
          }
        }

        return (
          <img
            src={finalAvatar}
            className="w-10 h-10 rounded-full object-cover"
            alt="admin"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              if (el.src !== FALLBACK_AVATAR) {
                el.src = FALLBACK_AVATAR;
              }
            }}
          />
        );
      },
    },
    { header: "Name", key: "name", render: (item: any) => item.name },
    { header: "Role", key: "role", render: (item: any) => item.role },
    {
      header: "Last Login",
      key: "last_login",
      render: (item: any) => formatDate(item.last_login),
    },
    {
      header: "Registration At",
      key: "created_at",
      render: (item: any) => formatDate(item.created_at),
    },
    {
      header: "Status",
      key: "status",
      render: (item: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.status === "active"
              ? "bg-[#C1FFBC] text-[#085E00]"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {item.status === "active" ? "Publish" : "Draft"}
        </span>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (item: any) => (
        <div className="relative flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === item.id ? null : item.id);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {activeMenuId === item.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
              <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => router.push(`/admin/dashboard/admin-control/edit/${item.id}`)}
                  className="w-full px-4 py-2.5 text-xs flex items-center gap-3 hover:bg-gray-50 font-medium text-gray-700 cursor-pointer"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <div
                  className="relative w-full"
                  onMouseEnter={() => setIsStatusSubMenuOpen(true)}
                  onMouseLeave={() => setIsStatusSubMenuOpen(false)}
                >
                  <button className="w-full px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 font-medium text-gray-700 cursor-pointer">
                    <span className="flex items-center gap-3">
                      <Clock size={14} /> Status
                    </span>
                    <ChevronRight size={14} />
                  </button>
                  {isStatusSubMenuOpen && (
                    <div className="absolute right-full top-0 mr-0.5 w-32 bg-white border border-gray-100 shadow-2xl rounded-xl py-1 z-50">
                      <button
                        onClick={() => handleStatusUpdate(item.id, "PUBLISH")}
                        className="w-full px-4 py-2 text-xs hover:bg-gray-50 text-left cursor-pointer"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, "DRAFT")}
                        className="w-full px-4 py-2 text-xs hover:bg-gray-50 text-left cursor-pointer"
                      >
                        Draft
                      </button>
                    </div>
                  )}
                </div>
                <div className="h-[1px] bg-gray-100 my-1" />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full px-4 py-2.5 text-xs flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <DataTable data={data?.data?.data || []} columns={columns} rowKey="id" />
      )}
    </div>
  );
}
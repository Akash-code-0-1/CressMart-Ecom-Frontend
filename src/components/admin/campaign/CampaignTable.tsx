"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2, Edit3, Loader2, CirclePlus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import DataTable from "../common/DataTable";
import CampaignModal, { ExtendedCampaign } from "./CampaignModal";
import Pagination from "../common/Pagination";
import {
  fetchAllCampaigns,
  deleteCampaign,
  Campaign,
} from "@/services-api/campaignService";
import PrimaryButton from "../common/PrimaryButton";

interface TableColumn<T> {
  header: string;
  key: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

function extractImageUrl(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const inner = (val as Record<string, unknown>).url;
    if (typeof inner === "string") return inner;
    if (inner && typeof inner === "object") {
      const deepUrl = (inner as Record<string, unknown>).url;
      if (typeof deepUrl === "string") return deepUrl;
    }
  }
  return "";
}

export default function CampaignTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  // --- 🚀 Professional Menu States ---
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    opensUpward: false,
  });

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch Data
  const { data: serverPayload, isLoading } = useQuery({
    queryKey: ["campaigns", page, limit, search],
    queryFn: () => fetchAllCampaigns({ page, limit, search }),
  });

  // Function to handle page change via URL
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        toast.success("Campaign deleted successfully");
        setActiveMenuId(null);
      } else {
        toast.error("Failed to delete campaign");
      }
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to delete campaign"),
  });

  const openAddModal = () => {
    setModalMode("add");
    setSelectedCampaign(null);
    setIsModalOpen(true);
  };

const openEditModal = (id: string) => {
  const campaign = campaignList.find((c) => c.id === id);
  if (campaign) {
    setModalMode("edit");
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
    setActiveMenuId(null);
  }
};

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  // FIX: Accessing data based on your provided JSON structure
  const campaignList: Campaign[] = Array.isArray(serverPayload?.data?.data)
    ? serverPayload.data.data
    : [];

  const totalPages = serverPayload?.data?.meta?.totalPages || 1;

  const columns: TableColumn<Campaign>[] = [
    {
      header: "SL",
      key: "sl",
      render: (_, index: number) => (
        <span>{(page - 1) * limit + index + 1}</span>
      ),
    },
    {
      header: "Product",
      key: "product",
      render: (item: Campaign) => {
        const imgs =
          item.campaign_products
            ?.map((cp) => cp.product?.images?.[0])
            .filter((img): img is string => Boolean(img)) || [];
        return (
          <div className="flex gap-1">
            {imgs.slice(0, 2).map((src: string, i: number) => {
              const rowimage = extractImageUrl(src).trim();
              const productImage = rowimage.startsWith("http")
                ? rowimage
                : rowimage
                  ? `${backendBaseUrl}/${rowimage.replace(/^\/+/, "")}`
                  : "/images/placeholder.svg";
              return (
                <div className="relative w-10 h-10" key={i}>
                  <Image
                    src={productImage}
                    fill
                    className="rounded border object-cover bg-gray-50"
                    alt="product"
                    unoptimized
                  />
                </div>
              );
            })}

            {imgs.length > 2 && (
              <div className="flex items-center justify-center w-10 h-10 rounded border bg-gray-100 text-xs font-medium text-gray-600">
                +{imgs.length - 2}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Campaign Name",
      key: "name",
      render: (item: Campaign) => (
        <span className="font-medium text-sm">{item.name}</span>
      ),
    },
    {
      header: "Start",
      key: "start_date",
      render: (item: Campaign) => (
        <span>
          {item.start_date
            ? new Date(item.start_date).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      header: "End",
      key: "end_date",
      render: (item: Campaign) => (
        <span>
          {item.end_date ? new Date(item.end_date).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item: Campaign) => (
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium w-fit capitalize ${
            item.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.status}
        </div>
      ),
    },
    {
      header: "Action",
      key: "action",
      className: "text-right",
      render: (item: Campaign) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();

            // --- 🚀 DYNAMIC POSITIONING LOGIC ---
            const menuHeight = 100;
            const spaceBelow = window.innerHeight - rect.bottom;
            const shouldOpenUp = spaceBelow < menuHeight;

            setMenuPos({
              top: shouldOpenUp ? rect.top - menuHeight + 20 : rect.bottom + 8,
              left: rect.left - 130, // Adjust based on menu width
              opensUpward: shouldOpenUp,
            });

            setActiveMenuId(activeMenuId === item.id ? null : item.id);
          }}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical size={20} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg p-5 font-poppins min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-lato font-bold text-[#023337]">Campaign</h1>
        {/* <button
          onClick={openAddModal}
          className="bg-[#2EB1FF] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Plus size={18} /> Add Campaign
        </button> */}

        <PrimaryButton
          label="Add Campaign"
          icon={<CirclePlus />}
          onClick={openAddModal}
        />
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        ) : (
          <DataTable
            data={campaignList}
            columns={columns}
            rowKey="id"
            gradiant={true}
          />
        )}
      </div>

      {/* --- 🚀 PORTAL MENU --- */}
      {activeMenuId && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            zIndex: 9999,
          }}
          className="w-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1"
        >
          <button
            onClick={() => openEditModal(activeMenuId)}// Ensure you pass correct object
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-black"
          >
            <Edit3 size={16} /> Edit Item
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure?")) deleteMutation.mutate(activeMenuId);
              setActiveMenuId(null);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} /> Delete Item
          </button>
        </div>
      )}

      {/* Reusable Pagination Component */}
      {!isLoading && campaignList.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {isModalOpen && (
        <CampaignModal
          key={selectedCampaign?.id || "add-modal"}
          mode={modalMode}
          data={(selectedCampaign as unknown as ExtendedCampaign) || undefined}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

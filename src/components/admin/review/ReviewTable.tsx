// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { MoreVertical, Star } from "lucide-react";
// import DataTable from "../common/DataTable";
// import Pagination from "../common/Pagination";

// interface TableColumn<T> {
//   header: string;
//   key: string;
//   render?: (item: T, index: number) => React.ReactNode;
//   headerRender?: () => React.ReactNode;
//   className?: string;
//   headerClassName?: string;
// }

// interface ReviewItem {
//   id: number;
//   sl: number;
//   image: string;
//   name: string;
//   star: number;
// }

// const reviewMockData: ReviewItem[] = Array.from({ length: 10 }, (_, index) => ({
//   id: index + 1,
//   sl: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : 4,
//   image: "/images/products/product2.png",
//   name: index < 5 ? "Imam Hoshen" : "Imam Hoshen Omor",
//   star: index === 0 || index === 1 ? 5 : index === 2 ? 3 : 1,
// }));

// export default function ReviewTable() {
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   const handleSelectRow = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedIds.length === reviewMockData.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(reviewMockData.map((item) => item.id));
//     }
//   };

//   const columns: TableColumn<ReviewItem>[] = [
//     {
//       header: "",
//       key: "checkbox-selection",
//       headerClassName: "w-[45px]",
//       headerRender: () => (
//         <input
//           type="checkbox"
//           className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
//           checked={
//             selectedIds.length === reviewMockData.length &&
//             reviewMockData.length > 0
//           }
//           onChange={handleSelectAll}
//         />
//       ),
//       render: (item) => (
//         <input
//           type="checkbox"
//           className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
//           checked={selectedIds.includes(item.id)}
//           onChange={() => handleSelectRow(item.id)}
//         />
//       ),
//     },
//     {
//       header: "SI",
//       key: "sl",
//       render: (item) => (
//         <span className="text-[15px] text-[#1D1A1A] font-normal">
//           {item.sl}
//         </span>
//       ),
//     },
//     {
//       header: "Image",
//       key: "image",
//       render: (item) => (
//         <div className="flex items-center">
//           <Image
//             src={item.image}
//             alt={item.name}
//             width={45}
//             height={45}
//             className="rounded-[8px] object-cover"
//           />
//         </div>
//       ),
//     },
//     {
//       header: "Name",
//       key: "name",
//       render: (item) => (
//         <span className="text-[15px] text-[#1D1A1A] font-normal block max-w-[150px] truncate">
//           {item.name}
//         </span>
//       ),
//     },
//     {
//       header: "Star",
//       key: "star",
//       render: (item) => {
//         let badgeClass = "bg-[#DCEFFF] text-[#32B2FA]";
//         if (item.star === 3) badgeClass = "bg-[#FFDDC1] text-[#FE7405]";
//         if (item.star === 1) badgeClass = "bg-[#FFD0D0] text-[#DA0000]";

//         return (
//           <div
//             className={`px-3 py-1 rounded-full text-[14px] font-semibold max-w-[64px] flex items-center justify-center gap-1 ${badgeClass}`}
//           >
//             <span>{item.star}</span> <Star size={14} fill="currentColor" />
//           </div>
//         );
//       },
//     },
//     {
//       header: "Action",
//       key: "action",
//       render: () => (
//         <button className="text-black p-1 transition-colors">
//           <MoreVertical size={20} />
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white font-poppins">
//       <DataTable
//         data={reviewMockData}
//         columns={columns}
//         rowKey="id"
//         gradiant={true}
//       />
//       <div className="py-5">
//         <Pagination
//           currentPage={1}
//           totalPages={8}
//           onPageChange={(page) => console.log(page)}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useRef } from "react";
import {
  MoreVertical,
  Star,
  Edit3,
  ShieldAlert,
  Trash2,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/services-api/reviewService";
import { getAdminTokenAction } from "@/app/actions/auth";
import DataTable from "../common/DataTable";
import Pagination from "../common/Pagination";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface ReviewItem {
  id: string;
  sl: number;
  image: string;
  name: string;
  star: number;
  status: string;
  comment: string;
  createdAt: string;
  productName: string;
  productImage: string;
  rawImages: string[];
}

const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 45 45'><rect width='45' height='45' fill='%23F3F4F6'/><circle cx='22.5' cy='18' r='7' fill='%239CA3AF'/><path d='M10,38 C10,30 16,26 22.5,26 C29,26 35,30 35,38' fill='%239CA3AF'/></svg>";

export default function ReviewTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<boolean>(false);

  // Modal Controlled local states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // 🚀 RESTORED: File input element reference hook
  const modalFileRef = useRef<HTMLInputElement | null>(null);

  // Cache Bypass Toggle State Flag
  const [forceBypass, setForceBypass] = useState<boolean>(false);

  const rPage = Number(searchParams.get("r_page")) || 1;
  const statusFilter = searchParams.get("status") || "";
  const cSearch = searchParams.get("c_search") || "";

  // 🚀 FETCH WORKFLOW: Matches exactly your Product Table rules to ensure continuous network updates
  const { data: serverPayload } = useQuery({
    queryKey: ["admin-reviews-list", rPage, statusFilter, cSearch, forceBypass],
    queryFn: async () => {
      const res = await reviewApi.getAll(
        rPage,
        5,
        statusFilter,
        cSearch,
        forceBypass,
      );
      // Turn the flag off after a fresh directly pulled query finishes mapping
      if (forceBypass) setForceBypass(false);
      return res;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    staleTime: 0,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      reviewApi.updateStatus(id, status),
    onSuccess: () => {
      setForceBypass(true); // Enforce cache bypassing on next loading loop
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-customer-review-stats"],
      });
      setActiveMenuId(null);
      setActiveSubMenu(false);
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({
      id,
      rating,
      comment,
      images,
    }: {
      id: string;
      rating: number;
      comment: string;
      images: string[];
    }) => {
      return await reviewApi.updateDetails(id, rating, comment, images);
    },
    onSuccess: () => {
      setForceBypass(true); // Force clear backend Redis layers on next fetch thread
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-customer-review-stats"],
      });
      setIsEditModalOpen(false);
      setEditingReviewId(null);
    },
    onError: (err) => console.error("MUTATION ERROR:", err),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewApi.delete(id),
    onSuccess: () => {
      setForceBypass(true);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-customer-review-stats"],
      });
      setActiveMenuId(null);
    },
  });

  const rawReviews =
    serverPayload?.data && Array.isArray(serverPayload.data.data)
      ? serverPayload.data.data
      : [];
  const meta = serverPayload?.data?.meta || { totalPages: 1 };

  const baseApiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
  const BACKEND_URL = baseApiUrl.replace("/api/v1", "");

  const reviewData: ReviewItem[] = rawReviews.map(
    (item: any, index: number) => {
      let customerAvatar = FALLBACK_AVATAR;
      if (item.user && item.user.avatar && item.user.avatar.trim() !== "") {
        const avatarUrl = item.user.avatar;
        customerAvatar =
          avatarUrl.startsWith("http") || avatarUrl.startsWith("data:")
            ? avatarUrl
            : `${BACKEND_URL}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;
      }

      // Replace your parsing logic in ReviewTable.tsx
      let reviewImagesArray: string[] = [];
      if (item.images) {
        try {
          // If it's a string, try to parse it. If it's already an array, use it.
          const parsed =
            typeof item.images === "string"
              ? JSON.parse(item.images)
              : item.images;
          // Ensure it is an array and filter out nulls/empty strings
          reviewImagesArray = Array.isArray(parsed)
            ? parsed.filter(Boolean)
            : [];
        } catch (e) {
          console.error("Parse error for ID:", item.id, e);
        }
      }

      let displayImg = "";

      if (
        Array.isArray(reviewImagesArray) &&
        reviewImagesArray.length > 0 &&
        reviewImagesArray[0]
      ) {
        const targetImg = reviewImagesArray[0];
        displayImg =
          targetImg.startsWith("http") || targetImg.startsWith("data:")
            ? targetImg
            : `${BACKEND_URL}${targetImg.startsWith("/") ? targetImg : `/${targetImg}`}`;
      } else if (item.product?.images) {
        try {
          const parsedProdImgs =
            typeof item.product.images === "string"
              ? JSON.parse(item.product.images)
              : item.product.images;
          if (Array.isArray(parsedProdImgs) && parsedProdImgs[0]) {
            displayImg = parsedProdImgs[0].startsWith("http")
              ? parsedProdImgs[0]
              : `${BACKEND_URL}${parsedProdImgs[0].startsWith("/") ? parsedProdImgs[0] : `/${parsedProdImgs[0]}`}`;
          }
        } catch (e) {}
      }

      const rawDate = item.created_at || item.createdAt;
      const parsedDate = rawDate
        ? new Date(rawDate).toLocaleDateString("en-GB").replace(/\//g, "-")
        : "16-06-2026";

      return {
        id: item.id,
        sl: (rPage - 1) * 5 + index + 1,
        image: customerAvatar,
        name: item.user?.name || item.name,
        star: item.rating,
        status: item.status,
        comment: item.comment || "",
        createdAt: parsedDate,
        productName: item.product?.name || "Smart Device Unit",
        productImage: displayImg,
        rawImages: Array.isArray(reviewImagesArray) ? reviewImagesArray : [],
      };
    },
  );

  const activeReviewItem = reviewData.find((r) => r.id === editingReviewId);

  const openEditModal = (review: ReviewItem) => {
    // 🚀 FIXED: Explicitly type 'r' as 'any' (or your specific API return type)
    // We use 'any' here because rawReviews comes from an API payload that might be dynamic
    const freshRecord = rawReviews.find((r: any) => r.id === review.id);

    let imagesFromSource: string[] = [];
    try {
      const raw = freshRecord?.images;
      imagesFromSource = Array.isArray(raw) ? raw : raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error parsing images:", e);
    }

    setEditingReviewId(review.id);
    setEditRating(review.star);
    setEditComment(review.comment);

    // SET THE STATE EXPLICITLY
    setModalImages(imagesFromSource);

    setIsEditModalOpen(true);
    // setActiveMenuId(null); // Keep this if you need to close the menu
    console.log("MODAL OPENED. State images:", imagesFromSource);
  };

  // 🚀 FIXED: Robust image replacement handler with correct scope
  const handleModalImageReplacement = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingReviewId) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("images", file);

      const token = await getAdminTokenAction();
      const res = await fetch(
        `${baseApiUrl}/reviews/admin/${editingReviewId}/upload-images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token || ""}` },
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const payload = await res.json();
      const newPaths = payload.image_urls || [];

      // 🚀 OPTIMISTIC UPDATE: Update the modal state immediately
      setModalImages(newPaths);

      // 🚀 Update the local ReviewTable view immediately
      // Find the current item and update its rawImages in the Query Cache
      queryClient.setQueryData(
        ["admin-reviews-list", rPage, statusFilter, cSearch, forceBypass],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((r: any) =>
                r.id === editingReviewId ? { ...r, images: newPaths } : r,
              ),
            },
          };
        },
      );

      setForceBypass(true);
    } catch (err) {
      console.error("❌ UPLOAD ERROR:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Ensure this block is at the top of your component so it re-runs on every render
  let currentModalProductImage =
    activeReviewItem?.productImage || FALLBACK_AVATAR;

  // 🚀 THIS MUST WATCH modalImages
  if (modalImages && modalImages.length > 0 && modalImages[0]) {
    currentModalProductImage = modalImages[0].startsWith("http")
      ? modalImages[0]
      : `${BACKEND_URL}${modalImages[0].startsWith("/") ? modalImages[0] : `/${modalImages[0]}`}`;
  }

  const columns: TableColumn<ReviewItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[45px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={
            selectedIds.length === reviewData.length && reviewData.length > 0
          }
          onChange={() =>
            setSelectedIds(
              selectedIds.length === reviewData.length
                ? []
                : reviewData.map((r) => r.id),
            )
          }
        />
      ),
      render: (item) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(item.id)}
          onChange={() =>
            setSelectedIds((prev) =>
              prev.includes(item.id)
                ? prev.filter((id) => id !== item.id)
                : [...prev, item.id],
            )
          }
        />
      ),
    },
    {
      header: "SI",
      key: "sl",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {item.sl}
        </span>
      ),
    },
    {
      header: "Image",
      key: "image",
      render: (item) => (
        <div className="flex items-center">
          <img
            src={item.image}
            alt={item.name}
            width={45}
            height={45}
            className="rounded-[8px] object-cover w-[45px] h-[45px] bg-gray-50 border border-gray-100"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              if (el.src !== FALLBACK_AVATAR) el.src = FALLBACK_AVATAR;
            }}
          />
        </div>
      ),
    },
    {
      header: "Name",
      key: "name",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal block max-w-[150px] truncate">
          {item.name}
        </span>
      ),
    },
    {
      header: "Star",
      key: "star",
      render: (item) => {
        let badgeClass = "bg-[#DCEFFF] text-[#32B2FA]";
        if (item.star === 3) badgeClass = "bg-[#FFDDC1] text-[#FE7405]";
        if (item.star <= 2) badgeClass = "bg-[#FFD0D0] text-[#DA0000]";

        return (
          <div
            className={`px-3 py-1 rounded-full text-[14px] font-semibold max-w-[64px] flex items-center justify-center gap-1 ${badgeClass}`}
          >
            <span>{item.star}</span> <Star size={14} fill="currentColor" />
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      render: (item) => (
        <div className="relative">
          <button
            onClick={() => {
              setActiveMenuId(activeMenuId === item.id ? null : item.id);
              setActiveSubMenu(false);
            }}
            className="text-black p-1 transition-colors hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>

          {activeMenuId === item.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[12px] shadow-xl py-2 z-50 text-sm font-medium text-[#1E293B]">
              <button
                onClick={() => openEditModal(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 cursor-pointer"
              >
                <Edit3 size={16} className="text-gray-400" /> <span>Edit</span>
              </button>

              <div
                className="relative w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                onMouseEnter={() => setActiveSubMenu(true)}
                onMouseLeave={() => setActiveSubMenu(false)}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert size={16} className="text-gray-400" />{" "}
                  <span>Status</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
                {activeSubMenu && (
                  <div className="absolute top-0 right-full mr-1 w-36 bg-white border border-gray-100 rounded-[10px] shadow-xl py-1 z-50">
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: item.id,
                          status: "APPROVED",
                        })
                      }
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-emerald-600 cursor-pointer"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: item.id,
                          status: "PENDING",
                        })
                      }
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-amber-600 cursor-pointer"
                    >
                      Draft
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (confirm("Wipe review log?"))
                    deleteMutation.mutate(item.id);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-600 flex items-center gap-3 cursor-pointer"
              >
                <Trash2 size={16} /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white font-poppins relative">
      <DataTable
        data={reviewData}
        columns={columns}
        rowKey="id"
        gradiant={true}
      />

      <div className="py-5">
        <Pagination
          currentPage={rPage}
          totalPages={meta.totalPages}
          onPageChange={(p) =>
            router.push(
              `${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams), r_page: String(p) })}`,
            )
          }
        />
      </div>

      {isEditModalOpen && activeReviewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[440px] relative font-poppins px-6 pb-6 pt-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center z-10">
              <img
                src={activeReviewItem.image}
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                }}
              />
            </div>

            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingReviewId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-full h-[150px] relative rounded-[14px] overflow-hidden mb-4 bg-gray-50 border border-gray-100 flex items-center justify-center">
              {isUploadingImage ? (
                <Loader2 className="animate-spin text-amber-500" size={28} />
              ) : (
                <img
                  src={currentModalProductImage}
                  alt="Product/Review Context"
                  className="max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                  }}
                />
              )}
            </div>

            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => modalFileRef.current?.click()}
                className="bg-[#FFA500] hover:bg-[#e69500] text-white text-xs font-semibold px-5 py-2 rounded-[8px] transition-colors cursor-pointer"
              >
                Replace Image
              </button>
              <input
                type="file"
                ref={modalFileRef}
                onChange={handleModalImageReplacement}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#727272] uppercase tracking-wider block mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={activeReviewItem.name}
                  disabled
                  className="w-full bg-[#F8F9FA] border border-gray-100 rounded-[10px] p-3 text-sm font-medium text-[#4A5568] opacity-80 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#727272] uppercase tracking-wider block">
                    Review
                  </label>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= editRating ? "#FFA500" : "transparent"}
                        className={
                          s <= editRating
                            ? "text-[#FFA500] cursor-pointer"
                            : "text-gray-300 cursor-pointer"
                        }
                        onClick={() => setEditRating(s)}
                      />
                    ))}
                    <span className="text-xs text-gray-500 font-bold ml-1">
                      ({editRating}.0)
                    </span>
                  </div>
                </div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full border border-gray-200 rounded-[12px] p-3 text-sm text-[#1A202C] min-h-[100px] resize-none focus:border-[#FFA500] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#727272] uppercase tracking-wider block mb-1.5">
                  Date
                </label>
                <input
                  type="text"
                  value={activeReviewItem.createdAt}
                  disabled
                  className="w-full bg-[#F8F9FA] border border-gray-100 rounded-[10px] p-3 text-sm text-[#4A5568] opacity-80 outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex justify-center mt-3">
                <button
                  onClick={() => {
                    updateReviewMutation.mutate({
                      id: editingReviewId!,
                      rating: editRating,
                      comment: editComment,
                      images: modalImages, // modalImages now holds the current array of URLs
                    });
                  }}
                  disabled={updateReviewMutation.isPending}
                  className="bg-[#1A1A1A] text-white font-semibold text-sm px-8 py-2.5 rounded-[10px] hover:bg-black flex items-center gap-2 min-w-[120px] justify-center transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updateReviewMutation.isPending && (
                    <Loader2 className="animate-spin" size={14} />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

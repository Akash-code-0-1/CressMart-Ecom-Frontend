// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { MoreVertical } from "lucide-react";
// import DataTable from "../../common/DataTable";
// import Pagination from "../../common/Pagination";

// interface TableColumn<T> {
//   header: string;
//   key: string;
//   render?: (item: T, index: number) => React.ReactNode;
//   headerRender?: () => React.ReactNode;
//   className?: string;
//   headerClassName?: string;
// }

// interface CategoryItem {
//   id: number;
//   sl: number;
//   image: string;
//   name: string;
//   products: number;
//   status: "Publish" | "Unpublish";
// }

// const categories: CategoryItem[] = Array.from({ length: 10 }, (_, index) => ({
//   id: index + 1,
//   sl: index + 1,
//   image: "/images/products/product2.png",
//   name: "Toy",
//   products: 5,
//   status: "Publish",
// }));

// export default function CategoryTable() {
//   // Selection state tracking via unique IDs
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   const handleSelectRow = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedIds.length === categories.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(categories.map((item) => item.id));
//     }
//   };

//   const categoryColumns: TableColumn<CategoryItem>[] = [
//     {
//       header: "",
//       key: "checkbox-selection",
//       headerClassName: "w-[40px]",
//       headerRender: () => (
//         <input
//           type="checkbox"
//           className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
//           checked={
//             selectedIds.length === categories.length && categories.length > 0
//           }
//           onChange={handleSelectAll}
//         />
//       ),
//       render: (category) => (
//         <input
//           type="checkbox"
//           className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
//           checked={selectedIds.includes(category.id)}
//           onChange={() => handleSelectRow(category.id)}
//         />
//       ),
//     },
//     {
//       header: "SL",
//       key: "sl",
//       render: (category) => (
//         <span className="text-[15px] text-[#1D1A1A] font-normal">
//           {category.sl}
//         </span>
//       ),
//     },
//     {
//       header: "Image/icon",
//       key: "image",
//       render: (category) => (
//         <div className="flex items-center">
//           <Image
//             src={category.image}
//             alt={category.name}
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
//       render: (category) => (
//         <span
//           className="text-[15px] text-[#1D1A1A] font-normal block max-w-[300px]"
//           title={category.name}
//         >
//           {category.name}
//         </span>
//       ),
//     },
//     {
//       header: "Products",
//       key: "products",
//       render: (category) => (
//         <span className="text-[13px] xl:text-[15px] text-black font-normal">
//           {category.products}
//         </span>
//       ),
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (category) => (
//         <div
//           className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
//             category.status === "Publish"
//               ? "bg-[#C1FFBC] text-[#085E00]"
//               : "bg-gray-100 text-gray-500"
//           }`}
//         >
//           {category.status}
//         </div>
//       ),
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
//         data={categories}
//         columns={categoryColumns}
//         rowKey="id"
//         gradiant={true}
//       />

//       <div className="py-5 md:mx-10 mx-2">
//         <Pagination
//           currentPage={1}
//           totalPages={24}
//           onPageChange={(page) => console.log(page)}
//         />
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MoreVertical, Trash2, Edit3, Loader2 } from "lucide-react";
import { fetchAllCategories, deleteCategory } from "@/services-api/categoryService";
import DataTable from "../../common/DataTable";
import Pagination from "../../common/Pagination";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

export default function CategoryTable() {
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

  const baseStorageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";

  const { data: serverPayload, isLoading } = useQuery({
    queryKey: ["catalog-categories-list", page, limit, search, status],
    queryFn: async () => {
      let mappedStatus = "";
      if (status === "PUBLISHED") mappedStatus = "active";
      if (status === "DRAFT") mappedStatus = "draft";
      
      const response = await fetchAllCategories({ page, limit, search, status: mappedStatus });
      
      // 🚀 FIXED: Filter out subcategories (items where parent_id exists) to show root-only parents
      if (response && Array.isArray(response.data)) {
        response.data = response.data.filter(
          (item: any) => item.parent_id === null || item.parent_id === undefined
        );
      }
      return response;
    },
  });

  const categoryList = serverPayload?.data || [];
  const meta = serverPayload?.meta || { totalPages: 1, total: 0 };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-categories-list"] });
      alert("Category removed successfully.");
      setActiveMenuId(null);
    },
    onError: (err: any) => alert(err.message),
  });

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categoryList.length) setSelectedIds([]);
    else setSelectedIds(categoryList.map((item: any) => item.id));
  };

  const categoryColumns: TableColumn<any>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.length === categoryList.length && categoryList.length > 0}
          onChange={handleSelectAll}
        />
      ),
      render: (category) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(category.id)}
          onChange={() => handleSelectRow(category.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (_, index) => <span>{(page - 1) * limit + (index ?? 0) + 1}</span>,
    },
    {
      header: "Image/icon",
      key: "image",
      render: (category) => {
        const rawImg = category.image_url || category.image;
        const cleanImg = typeof rawImg === "string" ? rawImg.trim() : "";
        const isValidImg = cleanImg.replace(/^\/+/, "").length > 0;
        const srcUrl = isValidImg 
          ? (cleanImg.startsWith("http") ? cleanImg : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`) 
          : "/images/products/product2.png";
        return <img src={srcUrl} alt="" className="rounded-[8px] object-cover h-11 w-11 bg-gray-50 border" />;
      },
    },
    {
      header: "Name",
      key: "name",
      render: (category) => <span className="font-medium text-black">{category.name}</span>,
    },
    {
      header: "Products Count",
      key: "products",
      render: (category) => <span>{category._count?.products ?? 0}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (category) => {
        const isPublished = category.status === "PUBLISHED" || category.status === "active";
        return (
          <div className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${isPublished ? "bg-[#C1FFBC] text-[#085E00]" : "bg-gray-100 text-gray-500"}`}>
            {isPublished ? "Publish" : "Draft"}
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      render: (category) => (
        <div className="relative">
          <button onClick={() => setActiveMenuId(activeMenuId === category.id ? null : category.id)} className="text-black p-1 cursor-pointer">
            <MoreVertical size={20} />
          </button>
          {activeMenuId === category.id && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={() => router.push(`/admin/dashboard/category/add?id=${category.id}`)}
                className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              >
                <Edit3 size={12} /> Edit Item
              </button>
              <button
                type="button"
                onClick={() => { if (confirm("Delete permanently?")) deleteMutation.mutate(category.id); }}
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
      <div className="h-64 w-full bg-white flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins">
      {/* 🚀 FIXED: Adjusted prop naming convention typo to follow your exact 'gradiant' signature types requirements */}
      <DataTable data={categoryList} columns={categoryColumns} rowKey="id" gradiant={true} />
      {categoryList.length > 0 && (
        <div className="py-5 md:mx-10 mx-2">
          <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={(p) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(p));
            router.push(`${pathname}?${params.toString()}`);
          }} />
        </div>
      )}
    </div>
  );
}
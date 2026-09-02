// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { MoreVertical, Trash2, Edit3, Loader2 } from "lucide-react";
// import { fetchAllUnits, deleteUnit } from "@/services-api/unitService";
// import DataTable from "../../common/DataTable";
// import Pagination from "../../common/Pagination";

// type UnitRow = {
//   id: string;
//   name: string;
//   priority: string;
//   status: string;
// };

// export default function UnitTable() {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

//   const page = Number(searchParams.get("page")) || 1;
//   const { data: response, isLoading } = useQuery({
//     queryKey: ["units-list", page],
//     queryFn: () => fetchAllUnits({ page, limit: 10 }),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deleteUnit(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["units-list"] });
//       setActiveMenuId(null);
//     },
//   });

//     const menuRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//           setActiveMenuId(null);
//         }
//       };

//       if (activeMenuId) {
//         document.addEventListener("mousedown", handleClickOutside);
//       }

//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [activeMenuId]);

//   const columns: {
//     header: string;
//     key: string;
//     render?: (item: UnitRow, index: number) => React.ReactNode;
//     className?: string;
//     headerClassName?: string;
//   }[] = [
//     {
//       header: "SL",
//       key: "sl",
//       render: (_item: UnitRow, i: number) => (page - 1) * 10 + i + 1,
//     },
//     {
//       header: "Unit Name",
//       key: "name",
//       render: (item: UnitRow) => (
//         <span className="font-medium text-[#1D1A1A]">{item.name}</span>
//       ),
//     },
//     {
//       header: "Priority",
//       key: "priority",
//       render: (item: UnitRow) => item.priority,
//     },
//     {
//       header: "Status",
//       key: "status",
//       render: (item: UnitRow) => (
//         <span
//           className={`px-3 py-1 rounded-full text-[12px] font-medium ${item.status === "active" ? "bg-[#C1FFBC] text-[#085E00]" : "bg-gray-100 text-gray-500"}`}
//         >
//           {item.status === "active" ? "Publish" : "Draft"}
//         </span>
//       ),
//     },
//     {
//       header: "Action",
//       key: "action",
//       render: (item: UnitRow) => (
//         <div className="relative flex justify-end"
//         ref={activeMenuId === item.id ? menuRef : null}>
//           <button
//             onClick={() =>
//               setActiveMenuId(activeMenuId === item.id ? null : item.id)
//             }
//             className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <MoreVertical size={18} className="text-gray-600" />
//           </button>
//           {activeMenuId === item.id && (
//             <>
//               <div
//                 className="fixed inset-0 z-40"
//                 onClick={() => setActiveMenuId(null)}
//               />
//               <div className="absolute right-0 top-full mt-2 w-40 bg-white border-gray-100 shadow-2xl rounded-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
//                 <button
//                   onClick={() => {
//                     setActiveMenuId(null);
//                     router.push(`/admin/dashboard/unit/add?id=${item.id}`);
//                   }}
//                   className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   <Edit3 size={14} className="text-[#1DA1F2]" /> Edit Unit
//                 </button>
//                 <button
//                   onClick={() => {
//                     setActiveMenuId(null);
//                     if (confirm("Delete this unit?"))
//                       deleteMutation.mutate(item.id);
//                   }}
//                   className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                   <Trash2 size={14} /> Delete Unit
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       ),
//     },
//   ];

//   if (isLoading)
//     return (
//       <div className="flex justify-center p-10">
//         <Loader2 className="animate-spin" />
//       </div>
//     );

//   return (
//     <div className="bg-white rounded-lg border border-gray-100 overflow-visible">
//       <DataTable<UnitRow>
//         data={Array.isArray(response?.data?.data) ? response.data.data : []}
//         columns={columns}
//         rowKey="id"
//       />
//       <div className="py-4 px-6 border-t border-gray-100">
//         <Pagination
//           currentPage={page}
//           totalPages={response?.data?.meta?.totalPages || 1}
//           onPageChange={(p) => router.push(`?page=${p}`)}
//         />
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MoreVertical,
  Trash2,
  Edit3,
  Loader2,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { fetchAllUnits, deleteUnit } from "@/services-api/unitService";
import DataTable from "../../common/DataTable";
import Pagination from "../../common/Pagination";

type UnitRow = {
  id: string;
  name: string;
  priority: string;
  status: string;
};

export default function UnitTable() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- 🚀 Professional Menu States ---
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    opensUpward: false,
  });
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const { data: response, isLoading } = useQuery({
    queryKey: ["units-list", page],
    queryFn: () => fetchAllUnits({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units-list"] });
      setActiveMenuId(null);
    },
  });

  // --- 🚀 Close menu on click outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
        setShowStatusMenu(false);
      }
    };

    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  const columns: {
    header: string;
    key: string;
    render?: (item: UnitRow, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
  }[] = [
    {
      header: "SL",
      key: "sl",
      render: (_item: UnitRow, i: number) => (page - 1) * 10 + i + 1,
    },
    {
      header: "Unit Name",
      key: "name",
      render: (item: UnitRow) => (
        <span className="font-medium text-[#1D1A1A]">{item.name}</span>
      ),
    },
    {
      header: "Priority",
      key: "priority",
      render: (item: UnitRow) => item.priority,
    },
    {
      header: "Status",
      key: "status",
      render: (item: UnitRow) => (
        <span
          className={`px-3 py-1 rounded-full text-[12px] font-medium ${item.status === "active" ? "bg-[#C1FFBC] text-[#085E00]" : "bg-gray-100 text-gray-500"}`}
        >
          {item.status === "active" ? "Publish" : "Draft"}
        </span>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (item: UnitRow) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();

            // --- 🚀 DYNAMIC POSITIONING LOGIC ---
            const menuHeight = 110; // Approx height for Edit + Delete menu
            const spaceBelow = window.innerHeight - rect.bottom;
            const shouldOpenUp = spaceBelow < menuHeight;

            setMenuPos({
              // Using fixed coordinates relative to viewport (no window.scrollY needed)
              top: shouldOpenUp ? rect.top - 8 : rect.bottom + 8,
              left: rect.left - 160,
              opensUpward: shouldOpenUp,
            });
            // ------------------------------------

            setActiveMenuId(activeMenuId === item.id ? null : item.id);
            setShowStatusMenu(false);
          }}
          className="p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
        >
          <MoreVertical size={20} className="text-black" />
        </button>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[#1DA1F2]" />
      </div>
    );

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-visible relative font-poppins">
      <DataTable<UnitRow>
        data={Array.isArray(response?.data?.data) ? response.data.data : []}
        columns={columns}
        rowKey="id"
      />

      {/* --- PROFESSIONAL ACTION MENU --- */}
      {activeMenuId && (
        <div
          ref={menuRef}
          className={`fixed bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[9999] w-[210px] animate-in fade-in zoom-in duration-150 text-left ${
            menuPos.opensUpward
              ? "origin-bottom -translate-y-full"
              : "origin-top"
          }`}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {/* Group 1: Edit */}
          <div className="px-2 pb-1.5 border-b border-gray-100 mb-1.5">
            <button
              onClick={() => {
                router.push(`/admin/dashboard/unit/add?id=${activeMenuId}`);
                setActiveMenuId(null);
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-gray-600 hover:bg-blue-50 hover:text-[#1DA1F2] rounded-lg flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <Edit3
                size={16}
                className="text-gray-400 group-hover:text-[#1DA1F2]"
              />
              <span className="font-medium">Edit Unit</span>
            </button>
          </div>

          {/* Group 3: Delete */}
          <div className="px-2">
            <button
              onClick={() => {
                if (window.confirm("Delete this unit permanently?")) {
                  deleteMutation.mutate(activeMenuId);
                }
              }}
              className="w-full text-left px-3 py-2 text-[14px] text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-3 transition-colors font-bold cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Delete Unit</span>
            </button>
          </div>
        </div>
      )}

      <div className="py-4 px-6 border-t border-gray-100">
        <Pagination
          currentPage={page}
          totalPages={response?.data?.meta?.totalPages || 1}
          onPageChange={(p) => router.push(`?page=${p}`)}
        />
      </div>
    </div>
  );
}

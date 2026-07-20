// "use client";

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { MoreVertical, Trash2, Edit3, Loader2 } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import { apiFetch } from "@/utils/api";
// import DataTable from "../common/DataTable";

// export default function AdminControlTable() {
//   const searchParams = useSearchParams();
//   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-staff", searchParams.toString()],
//     queryFn: async () => {
//       const res = await apiFetch(
//         `/users/admin/staff?${searchParams.toString()}`,
//       );
//       return res.json();
//     },
//   });

//   const columns = [
//     { header: "SL", key: "sl", render: (_: any, i: number) => i + 1 },
//     { header: "Name", key: "name", render: (item: any) => item.name },
//     { header: "Role", key: "role", render: (item: any) => item.role },
//     {
//       header: "Status",
//       key: "status",
//       render: (item: any) => (
//         <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#C1FFBC] text-[#085E00]">
//           {item.status}
//         </span>
//       ),
//     },
//     {
//       header: "Action",
//       key: "action",
//       render: (item: any) => (
//         <div className="relative flex justify-end">
//           <button
//             onClick={() =>
//               setActiveMenuId(activeMenuId === item.id ? null : item.id)
//             }
//           >
//             <MoreVertical size={18} />
//           </button>
//           {activeMenuId === item.id && (
//             <div className="absolute right-0 mt-8 w-40 bg-white border shadow-xl rounded-xl py-1 z-50">
//               <button className="w-full px-4 py-2 text-xs flex items-center gap-2 hover:bg-gray-50">
//                 <Edit3 size={14} /> Edit
//               </button>
//               <button className="w-full px-4 py-2 text-xs flex items-center gap-2 text-red-600 hover:bg-red-50">
//                 <Trash2 size={14} /> Delete
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return isLoading ? (
//     <Loader2 className="animate-spin mx-auto mt-10" />
//   ) : (
//     <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
//       <DataTable
//         data={data?.data || []}
//         columns={columns}
//         rowKey="id"
//       />
//     </div>
//   );
// }

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

export default function AdminControlTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isStatusSubMenuOpen, setIsStatusSubMenuOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff", searchParams.toString()],
    queryFn: async () => {
      const res = await apiFetch(
        `/users/admin/staff?${searchParams.toString()}`,
      );
      return res.json();
    },
  });

  console.log("Admin Control Data:", data);

  const handleStatusUpdate = async (
    id: string,
    uiStatus: "PUBLISH" | "DRAFT",
  ) => {
    // Mapping UI labels to your lowercase DB Enums
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
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update status");
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
    } else {
      alert("Failed to delete admin");
    }
  };

  const columns = [
    {
      header: "",
      key: "checkbox",
      headerRender: () => (
        <input type="checkbox" className="accent-[#1DA1F2]" />
      ),
      render: () => <input type="checkbox" className="accent-[#1DA1F2]" />,
    },
    { header: "SL", key: "sl", render: (_: any, i: number) => i + 1 },
    {
      header: "Picture",
      key: "picture",
      render: (item: any) => (
        <img
          src={item.avatar}
          className="w-10 h-10 rounded-full object-cover"
          alt="admin"
        />
      ),
    },
    { header: "Name", key: "name", render: (item: any) => item.name },
    { header: "Role", key: "role", render: (item: any) => item.role },
    {
      header: "Last Login",
      key: "last_login",
      render: (item: any) => item.last_login || "N/A",
    },
    {
      header: "Registration At",
      key: "created_at",
      render: (item: any) => item.created_at,
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
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {activeMenuId === item.id && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setActiveMenuId(null)}
              />
              <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() =>
                    router.push(
                      `/admin/dashboard/admin-control/edit/${item.id}`,
                    )
                  }
                  className="w-full px-4 py-2.5 text-xs flex items-center gap-3 hover:bg-gray-50 font-medium text-gray-700"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <div
                  className="relative w-full"
                  onMouseEnter={() => setIsStatusSubMenuOpen(true)}
                  onMouseLeave={() => setIsStatusSubMenuOpen(false)}
                >
                  <button className="w-full px-4 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 font-medium text-gray-700">
                    <span className="flex items-center gap-3">
                      <Clock size={14} /> Status
                    </span>
                    <ChevronRight size={14} />
                  </button>
                  {isStatusSubMenuOpen && (
                    <div className="absolute right-full top-0 mr-2 w-32 bg-white border border-gray-100 shadow-2xl rounded-xl py-1 z-50">
                      <button
                        onClick={() => handleStatusUpdate(item.id, "PUBLISH")}
                        className="w-full px-4 py-2 text-xs hover:bg-gray-50 text-left"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, "DRAFT")}
                        className="w-full px-4 py-2 text-xs hover:bg-gray-50 text-left"
                      >
                        Draft
                      </button>
                    </div>
                  )}
                </div>
                <div className="h-[1px] bg-gray-100 my-1" />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full px-4 py-2.5 text-xs flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium"
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
        <DataTable
          data={data?.data?.data || []}
          columns={columns}
          rowKey="id"
        />
      )}
    </div>
  );
}

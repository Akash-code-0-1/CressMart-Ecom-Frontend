"use client";
import AdminControlTable from "@/components/admin/admin-control/AdminControlTable";
import AdminControlHead from "@/components/admin/admin-control/AdminControlHead";
import PermissionGuard from "@/components/admin/common/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard permission="Admin Control">
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1">
          <div className="p-2 md:p-0">
            <AdminControlHead />
            <AdminControlTable />
          </div>
        </main>
      </div>
    </PermissionGuard>
  );
}

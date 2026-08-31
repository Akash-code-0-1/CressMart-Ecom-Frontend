"use client";

import CatalogHead from "@/components/admin/catalog/CatalogHead";
import SupplierTable from "@/components/admin/catalog/supplier/SupplierTable";

export default function Page() {
  return (
    <div className="flex">
      <main className="flex-1">
        <div className="p-2 md:p-0">
          <CatalogHead />
          <SupplierTable />
        </div>
      </main>
    </div>
  );
}

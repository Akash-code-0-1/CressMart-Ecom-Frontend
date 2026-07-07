"use client";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductToolbar from "@/components/admin/products/ProductToolbar";

export default function Page() {
  return (
    <div className="flex overflow-hidden">
      <main className="w-full">
        <div className="p-2 md:p-0 mt-3">
          <ProductToolbar />
          <ProductTable />
        </div>
      </main>
    </div>
  );
}

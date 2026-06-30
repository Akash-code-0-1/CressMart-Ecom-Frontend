"use client";

import InventoryMainSection from "@/components/admin/inventory/InventoryMainSection";

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1">
        <div className="p-2 md:p-0">
          <div className="">
            <InventoryMainSection />
          </div>
        </div>
      </main>
    </div>
  );
}

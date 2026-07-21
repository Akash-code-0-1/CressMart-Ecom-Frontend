// "use client";
// import ProductTable from "@/components/admin/products/ProductTable";
// import ProductToolbar from "@/components/admin/products/ProductToolbar";

// export default function Page() {
//   return (
//     <div className="flex overflow-hidden">
//       <main className="w-full">
//         <div className="p-2 md:p-0 mt-3">
//           <ProductToolbar />
//           <ProductTable />
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import PermissionGuard from "@/components/admin/common/PermissionGuard";
import { Suspense } from "react";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductTable from "@/components/admin/products/ProductTable";

export default function Page() {
  return (
    <PermissionGuard permission="Products">
      <div className="flex overflow-hidden">
        <main className="w-full">
          <div className="p-2 md:p-0 mt-3">
            <Suspense fallback={null}>
              <ProductToolbar />
            </Suspense>

            <Suspense fallback={null}>
              <ProductTable />
            </Suspense>
          </div>
        </main>
      </div>
    </PermissionGuard>
  );
}

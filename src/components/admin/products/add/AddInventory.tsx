// import { apiFetch } from "@/utils/api";
// import { useFormContext } from "react-hook-form";
// import { SectionWrapper } from "./SectionWrapper";
// import { Label } from "./Label";
// import { ChevronDown } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { Input } from "./Input";

// export default function InventorySection({
//   Barcode,
// }: {
//   Barcode?: React.ElementType;
// }) {
//   const { register, watch, setValue } = useFormContext();
//   const isVariantMandatory = watch("is_variant_mandatory");
//   const selectedUnitId = watch("unit_id");

//   const { data: unitsRes } = useQuery({
//     queryKey: ["units-list-dropdown"],
//     queryFn: async () => {
//       const res = await apiFetch("/units");
//       return res.json();
//     },
//   });

//   const unitsList = (() => {
//     if (Array.isArray(unitsRes)) return unitsRes;
//     if (unitsRes && Array.isArray(unitsRes.data)) return unitsRes.data;
//     if (unitsRes && Array.isArray(unitsRes.data?.data))
//       return unitsRes.data.data;
//     return [];
//   })();

//   return (
//     <SectionWrapper title="Inventory">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <Label>Quantity (Stock)</Label>
//           <input
//             type="number"
//             {...register("quantity")}
//             disabled={isVariantMandatory}
//             className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
//             placeholder={isVariantMandatory ? "Derived from attributes" : "50"}
//           />
//         </div>
//         <div>
//           <Label>Unit Selection Mapping</Label>
//           <div className="relative w-full">
//             <select
//               value={selectedUnitId || ""}
//               onChange={(e) => {
//                 setValue("unit_id", e.target.value);
//                 const matchObj = unitsList.find(
//                   (u: { id: string; name: string }) => u.id === e.target.value,
//                 );
//                 if (matchObj) setValue("unit_name", matchObj.name);
//               }}
//               className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 px-4 py-3 text-sm rounded-lg outline-none appearance-none cursor-pointer"
//             >
//               <option value="">Select Package Unit</option>
//               {unitsList.map((unit: { id: string; name: string }) => (
//                 <option key={unit.id} value={unit.id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={14}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//         </div>
//         <div>
//           <Label>Warranty</Label>
//           <Input placeholder="12 months" />
//         </div>
//         <div>
//           <Label>SKU / Code</Label>
//           <Input placeholder="SAM-REF-525" />
//         </div>
//         <div>
//           <Label>Barcode</Label>
//           <Input placeholder="88091..." icon={Barcode} />
//         </div>
//         <div>
//           <Label>Priority Rank</Label>
//           <Input type="number" placeholder="100" />
//         </div>
//       </div>
//     </SectionWrapper>
//   );
// }

"use client";

import { apiFetch } from "@/utils/api";
import { useFormContext } from "react-hook-form";
import { SectionWrapper } from "./SectionWrapper";
import { Label } from "./Label";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./Input";

export default function InventorySection({
  Barcode,
}: {
  Barcode?: React.ElementType;
}) {
  const { register, watch, setValue } = useFormContext();

  // Watch values for conditional logic and controlled select
  const isVariantMandatory = watch("is_variant_mandatory");
  const selectedUnitId = watch("unit_id");

  // Fetch Units for the dropdown
  const { data: unitsRes } = useQuery({
    queryKey: ["units-list-dropdown"],
    queryFn: async () => {
      const res = await apiFetch("/units");
      return res.json();
    },
  });

  // Extract units list from common API response shapes
  const unitsList = Array.isArray(unitsRes)
    ? unitsRes
    : unitsRes?.data?.data || unitsRes?.data || [];

  return (
    <SectionWrapper title="Inventory">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Unit Selection Mapping */}
        <div>
          <Label>Unit Selection Mapping</Label>
          <div className="relative w-full">
            <select
              value={selectedUnitId || ""}
              onChange={(e) => {
                const val = e.target.value;
                setValue("unit_id", val);
                // Sync the unit_name based on selection
                const matchObj = unitsList.find(
                  (u: { id: string; name: string }) => u.id === val,
                );
                if (matchObj) setValue("unit_name", matchObj.name);
              }}
              className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 px-4 py-3 text-sm rounded-lg outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Package Unit</option>
              {unitsList.map((unit: { id: string; name: string }) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <Label>Quantity (Stock)</Label>
          <input
            type="number"
            {...register("quantity")} // Don't use valueAsNumber here, we handle it in the mutationFn
            disabled={isVariantMandatory}
            placeholder={isVariantMandatory ? "Derived from variants" : "50"}
            className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none border border-transparent focus:border-gray-200 placeholder:text-gray-400 disabled:opacity-50"
          />
        </div>

        {/* 3. Warranty */}
        <div>
          <Label>Warranty</Label>
          <Input placeholder="12 months" {...register("warranty")} />
        </div>

        {/* 4. SKU / Code */}
        <div>
          <Label>SKU / Code</Label>
          <Input placeholder="SAM-REF-525" {...register("sku")} />
        </div>

        {/* 5. Priority Rank */}
        <div>
          <Label>Priority Rank</Label>
          <Input
            type="number"
            placeholder="100"
            {...register("priority", { valueAsNumber: true })}
          />
        </div>

        {/* 6. Barcode */}
        <div>
          <Label>Barcode</Label>
          <Input
            placeholder="88091..."
            icon={Barcode}
            {...register("barcode")}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

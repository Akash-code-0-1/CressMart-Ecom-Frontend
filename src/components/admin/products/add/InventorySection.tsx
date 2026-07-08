// import { Input } from "./Input";
// import { Label } from "./Label";
// import { SectionWrapper } from "./SectionWrapper";


// export default function InventorySection({ Barcode, Calendar }: any) {
//     return (
//         <SectionWrapper title="Inventory">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
//                 <div><Label>Product Priority</Label><Input placeholder="0%" /></div>
//                 <div><Label>Quantity (Stock)</Label><Input placeholder="50" /></div>
//                 <div><Label>Unit Name</Label><Input placeholder="Piece, kg, liter, meter etc." /></div>
//                 <div><Label>Warranty</Label><Input placeholder="12 month" /></div>
//                 <div><Label>SKU / Product Code</Label><Input placeholder="ABC-XYZ-123" /></div>
//                 <div><Label>Bar Code</Label><Input placeholder="2154645786216" icon={Barcode} /></div>
//                 <div><Label>Initial Sold Count</Label><Input placeholder="0" /></div>
//                 <div><Label>Production Start</Label><Input placeholder="DD-MM-YYYY" icon={Calendar} /></div>
//                 <div><Label>Expiration End</Label><Input placeholder="DD-MM-YYYY" icon={Calendar} /></div>
//             </div>
//         </SectionWrapper>
//     )
// }



"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

export default function InventorySection({ Barcode }: any) {
  const { register, watch } = useFormContext();
  const isVariantMandatory = watch("is_variant_mandatory");

  return (
    <div className="bg-white rounded-[8px] px-4 py-5 mb-4 border border-gray-100">
      <h3 className="text-[#003032] font-medium text-xl mb-4">Inventory</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">Quantity (Stock)</label>
          <input
            type="number"
            {...register("quantity")}
            disabled={isVariantMandatory}
            className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700 disabled:opacity-50"
            placeholder={isVariantMandatory ? "Calculated from variants" : "50"}
          />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">Unit Name</label>
          <input {...register("unit_name")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Piece, kg, liter" />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">Warranty</label>
          <input {...register("warranty")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="12 months" />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">SKU / Product Code</label>
          <input {...register("sku")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="ABC-XYZ-123" />
        </div>
        <div className="relative w-full">
          <label className="text-base font-normal text-black mb-1.5 block">Bar Code</label>
          <input {...register("barcode")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="2154645..." />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">Product Priority</label>
          <input type="number" {...register("priority")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="100" />
        </div>
      </div>
    </div>
  );
}

// import { Toggle } from './Toggle'
// import { Label } from './Label'
// import { Input } from './Input'

// export default function ShippingSection() {
//     return (
//         <div className="mb-12">

//             <div className="mb-6">
//                 <h4 className="text-[20px] font-medium text-black mb-1">Delivery Charge</h4>
//                 <p className="text-[12px] text-[#A2A2A2] leading-tight">
//                     You can add specific delivery charge for this product or use the default charges
//                 </p>
//             </div>

//             <div className="flex justify-between items-center mb-8">
//                 <span className="text-base font-normal text-[#000000]">Apply default delivery charges</span>
//                 <div className="flex items-center gap-3">
//                     <span className="text-base font-normal text-[#000000]">[Not Applied]</span>
//                     <Toggle checked={false} />
//                 </div>
//             </div>


//             <div className="mb-8">
//                 <Label>Delivery Charge (Default)</Label>
//                 <Input placeholder='120' />
//             </div>

//             <div className="mb-12">
//                 <Label>Specific Delivery Charge</Label>
//                 <div className="flex gap-4">
//                     <div className="flex-[2]">
//                         <Input placeholder='60' />
//                     </div>
//                     <div className="flex-[1]">
//                         <Input placeholder='80' />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

export default function ShippingSection() {
  const { register, watch, setValue } = useFormContext();
  const applyDefault = watch("applyDefaultDelivery");

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h4 className="text-[20px] font-medium text-black mb-1">Delivery Charge</h4>
        <p className="text-[12px] text-[#A2A2A2] leading-tight">Configure shipping zone price overrides.</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-base font-normal text-[#000000]">Apply default delivery charges</span>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setValue("applyDefaultDelivery", !applyDefault)}>
          <span className="text-base font-normal text-[#000000]">{applyDefault ? "[Applied]" : "[Not Applied]"}</span>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${applyDefault ? 'bg-[#1DA1F2]' : 'bg-gray-200'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-xs ${applyDefault ? 'left-5' : 'left-0.5'}`} />
          </div>
        </div>
      </div>

      {applyDefault ? (
        <div className="mb-8">
          <label className="text-base font-normal text-black mb-1.5 block">Delivery Charge (Default)</label>
          <input type="number" {...register("deliveryChargeDefault")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="120" />
        </div>
      ) : (
        <div className="mb-12">
          <label className="text-base font-normal text-black mb-1.5 block">Specific Delivery Overrides</label>
          <div className="flex gap-4">
            <div className="flex-[2]">
              <input type="number" {...register("deliveryChargeSpecificInside")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Inside Dhaka (e.g. 60)" />
            </div>
            <div className="flex-[1]">
              <input type="number" {...register("deliveryChargeSpecificOutside")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Outside Dhaka (e.g. 120)" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
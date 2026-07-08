// import React from 'react'
// import { Label } from './Label'
// import { Input } from './Input'

// export default function SeoSection() {
//     return (
//         <div className="mb-12 bg-white px-4 py-5 rounded-[8px]">
//             <h3 className="text-[20px] font-medium text-black mb-8">SEO Info</h3>

//             <div className="flex flex-col gap-8">
//                 <div>
//                     <Label>Keyword</Label>
//                     <Input placeholder="Seo Keyword" />
//                 </div>

//                 <div>
//                     <Label>SEO Description</Label>
//                     <Input placeholder="Seo Description" />
//                 </div>

//                 <div>
//                     <Label>SEO Title</Label>
//                     <Input placeholder="Seo Title" />
//                 </div>
//             </div>
//         </div>
//     )
// }


"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

export default function SeoSection() {
  const { register } = useFormContext();

  return (
    <div className="mb-12 bg-white px-4 py-5 rounded-[8px] border border-gray-100">
      <h3 className="text-[20px] font-medium text-black mb-8">SEO Info</h3>
      <div className="flex flex-col gap-8">
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">Keyword</label>
          <input {...register("seoKeywords")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Seo Keyword" />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">SEO Description</label>
          <input {...register("seoDescription")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Seo Description" />
        </div>
        <div>
          <label className="text-base font-normal text-black mb-1.5 block">SEO Title</label>
          <input {...register("seoTitle")} className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-700" placeholder="Seo Title" />
        </div>
      </div>
    </div>
  );
}
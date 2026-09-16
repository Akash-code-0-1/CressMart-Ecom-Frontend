// "use client";
// import { getSettings } from "@/services-api/globalSettingsService";
// import { useQuery } from "@tanstack/react-query";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { extractImageUrl } from "@/utils/image";
// import { Edit } from "lucide-react";
// import { fetchChatSettings } from "@/services-api/chatSettingsService";

// interface Product {
//   id: string | number;
//   sku?: string;
//   images?: string[];
//   unit?: string;
// }

// interface OrderItem {
//   id: string | number;
//   product_name: string;
//   quantity: number;
//   unit_price: number | string;
//   product?: Product;
//   variant?: {
//     images?: string[];
//     sku?: string;
//     unit?: string;
//   };
//   external_image?: string;
// }

// interface Order {
//   order_number: string | number;
//   invoice_number?: string | number;
//   customer_name: string;
//   customer_phone: string;
//   customer_address: string;
//   created_at: string;
//   discount_amount: number | string;
//   shipping_fee: number | string;
//   total_amount_due: number | string;
//   total_bill?: number | string;
//   advance_amount?: number | string;
//   order_items?: OrderItem[];
// }

// interface InvoiceProps {
//   order: Order | null | undefined;
//   baseStorageUrl: string;
//   editableInvoice: string;
//   setEditableInvoice: (val: string) => void;
// }

// export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoiceProps>(
//   ({ order, baseStorageUrl, editableInvoice, setEditableInvoice }, ref) => {
//     // Local state for editable invoice number
//     // const [editableInvoice, setEditableInvoice] = useState("");

//     const { data: settingResponse } = useQuery({
//       queryKey: ["global-settings"],
//       queryFn: getSettings,
//     });

//     const { data: chatSettings } = useQuery({
//       queryKey: ["chatSettings"],
//       queryFn: fetchChatSettings,
//     });

//     // FIX: Use a stable dependency [order?.order_number].
//     // This ensures the array size NEVER changes and only resets when a NEW order is selected.
//     // useEffect(() => {
//     //   if (order) {
//     //     setEditableInvoice(String(order.invoice_number || order.order_number));
//     //   }
//     // }, [order?.order_number]);

//     if (!order) return null;

//     const subTotal =
//       order.order_items?.reduce(
//         (acc: number, item: OrderItem) =>
//           acc + Number(item.unit_price) * item.quantity,
//         0,
//       ) || 0;

//     const discount = Number(order.discount_amount) || 0;
//     const deliveryCharge = Number(order.shipping_fee) || 0;
//     const grandTotal =
//       Number(order.total_bill) || subTotal + deliveryCharge - discount;
//     const advancePay = Number(order.advance_amount) || 0;
//     const duePay = Number(order.total_amount_due) || grandTotal - advancePay;

//     const settingsdata = settingResponse?.data;
//     const logoUrl =
//       extractImageUrl(settingsdata?.primary_logo) || "/images/admin/logo.png";

//     const displayPhone = chatSettings?.phone || "019XXXXXXXX";

//     return (
//       <>
//         <style
//           dangerouslySetInnerHTML={{
//             __html: `
//           @media print {
//             @page { margin: 0; size: auto; }
//             body { margin: 0; -webkit-print-color-adjust: exact; }
//             /* Ensure input looks like normal text when printing */
//             input { border: none !important; outline: none !important; padding: 0 !important; background: transparent !important; }
//           }
//         `,
//           }}
//         />

//         <div
//           ref={ref}
//           className="p-12 bg-white h-auto w-[210mm] font-lato text-[#023337] print:p-10 mx-auto box-border overflow-hidden flex flex-col"
//         >
//           {/* Header */}
//           <div className="flex justify-between items-start mb-12">
//             <div className="flex gap-5">
//               <div className="w-16 h-16 relative">
//                 <Image
//                   src={logoUrl}
//                   alt="Logo"
//                   className="object-contain"
//                   fill
//                   unoptimized
//                 />
//               </div>
//               <div className="text-[13px] border-l border-gray-200 pl-5 space-y-0.5">
//                 <p className="font-medium text-gray-500">
//                   {settingsdata?.company_name}
//                 </p>
//                 {/* Header Text requirement */}
//                 <p className="font-bold text-[#FF6A00] text-[14px] uppercase tracking-tight">
//                   CREASS
//                 </p>
//                 <p className="font-medium text-gray-500">
//                   {settingsdata?.contact_email}
//                 </p>
//                 <p className="font-medium text-gray-500">{displayPhone}</p>
//               </div>
//             </div>
//             <div className="text-right text-[13px] text-gray-600">
//               <p className="font-bold text-[#023337] uppercase tracking-widest mb-1">
//                 Business address
//               </p>
//               <p>{settingsdata?.address}</p>
//             </div>
//           </div>

//           {/* Info Bar - Using a 3-column Grid for absolute centering */}
//           <div className="grid grid-cols-3 w-full border-t border-gray-100 pt-8 mb-12 items-start">
//             {/* 1. Left Column: Billed to */}
//             <div className="text-left space-y-1">
//               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
//                 Billed to
//               </p>
//               <p className="font-bold text-[18px] text-[#023337] leading-tight">
//                 {order.customer_name}
//               </p>
//               <p className="text-[13px] text-gray-700 font-medium">
//                 {order.customer_phone}
//               </p>
//               <p className="max-w-[200px] text-[13px] text-gray-600 leading-tight">
//                 {order.customer_address}
//               </p>
//             </div>

//             {/* 2. Middle Column: Mathematically centered, but content is left-aligned */}
//             <div className="flex justify-center items-start">
//               <div className="text-left ml-26">
//                 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">
//                   Invoice Number
//                 </p>
//                 <div className="flex items-center text-[#023337] group">
//                   <div className="flex items-center border-b border-dashed border-transparent group-hover:border-blue-300 transition-all">
//                     <span className="font-bold text-[18px]">#</span>
//                     <input
//                       type="text"
//                       value={editableInvoice}
//                       onChange={(e) => setEditableInvoice(e.target.value)}
//                       className="bg-transparent font-bold text-[18px] outline-none w-32 text-left focus:text-blue-500 transition-colors cursor-text print:border-none print:w-auto p-0"
//                     />
//                   </div>
//                 </div>
//                 <p className="text-[9px] text-blue-400/60 font-bold mt-1 print:hidden uppercase tracking-tighter">
//                   ✎ Edit Mode
//                 </p>
//               </div>
//             </div>

//             {/* 3. Right Column: Date & Order Number */}
//             <div className="text-right space-y-4">
//               <div>
//                 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-0.5">
//                   Date
//                 </p>
//                 <p className="font-bold text-[15px] text-[#023337]">
//                   {new Date(order.created_at).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-0.5">
//                   Order Number
//                 </p>
//                 <p className="font-bold text-[18px] text-[#023337]">
//                   #{order.order_number}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <table className="w-full mb-12">
//             <thead>
//               <tr className="text-gray-400 text-[11px] font-bold uppercase border-b-2 border-[#023337]/10">
//                 <th className="py-4 text-left w-12">NO.</th>
//                 <th className="py-4 text-left">ITEM DETAIL</th>
//                 <th className="py-4 text-left">SKU</th>
//                 <th className="py-4 text-center">QTY</th>
//                 <th className="py-4 text-center">UNIT</th>
//                 <th className="py-4 text-right">RATE</th>
//                 <th className="py-4 text-right">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {order.order_items?.map((item: OrderItem, idx: number) => {
//                 const variantImg = item.variant?.images?.[0];
//                 const productImg = item.product?.images?.[0];
//                 const externalImg = item.external_image;
//                 const rawImg = variantImg || productImg || externalImg;
//                 const finalImg =
//                   extractImageUrl(rawImg) || "/images/placeholder.svg";

//                 return (
//                   <tr key={item.id} className="text-[14px]">
//                     <td className="py-6 align-top text-gray-500">
//                       {String(idx + 1).padStart(2, "0")}
//                     </td>
//                     <td className="py-6 flex gap-4">
//                       <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden relative">
//                         <Image
//                           unoptimized
//                           fill
//                           alt="Product"
//                           src={finalImg}
//                           className="object-cover"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-bold text-[#023337] text-[15px]">
//                           {item.product_name}
//                         </p>
//                         <p className="text-gray-400 text-[11px] mt-0.5">
//                           High-quality premium product
//                         </p>
//                       </div>
//                     </td>
//                     <td className="py-6 align-top text-gray-500 font-medium uppercase">
//                       {item.variant?.sku || item.product?.sku || "N/A"}
//                     </td>
//                     <td className="py-6 align-top text-center font-bold text-[#023337]">
//                       {item.quantity}
//                     </td>
//                     <td className="py-6 align-top text-center text-gray-500">
//                       {item.variant?.unit || item.product?.unit || "pcs"}
//                     </td>
//                     <td className="py-6 align-top text-right text-gray-600">
//                       ৳{Number(item.unit_price).toLocaleString()}
//                     </td>
//                     <td className="py-6 align-top text-right font-bold text-[#023337]">
//                       ৳
//                       {(
//                         Number(item.unit_price) * item.quantity
//                       ).toLocaleString()}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {/* Calculations */}
//           <div className="flex justify-end mt-10">
//             <div className="w-72 space-y-3.5 text-[15px]">
//               <div className="flex justify-between text-gray-500 font-medium">
//                 <span>Sub Total</span>
//                 <span className="text-[#023337] font-bold">
//                   ৳{subTotal.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between text-gray-500 font-medium">
//                 <span>Delivery Charge</span>
//                 <span className="text-[#023337] font-bold">
//                   ৳{deliveryCharge.toLocaleString()}
//                 </span>
//               </div>
//               {discount > 0 && (
//                 <div className="flex justify-between text-[#FF4D4D] font-medium">
//                   <span>Discount</span>
//                   <span className="font-bold">
//                     - ৳{discount.toLocaleString()}
//                   </span>
//                 </div>
//               )}
//               <div className="flex justify-between text-[20px] font-black text-[#023337] border-t-2 border-gray-100 pt-4 mt-2">
//                 <span>Grand Total</span>
//                 <span>৳{grandTotal.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-gray-400 font-medium">
//                 <span>Advance Pay</span>
//                 <span className="font-bold">
//                   ৳{advancePay.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between text-[18px] font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
//                 <span>Due Pay</span>
//                 <span className="text-[#FF6A00]">
//                   ৳{duePay.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-auto pt-10 text-center border-t border-gray-50">
//             <p className="text-[#FF4D4D] text-[13px] font-bold">
//               বিঃ দ্রঃ ইনভয়েসসহ আনবক্সিং ভিডিও বাধ্যতামূলক ভিডিও ছাড়া কোনো
//               অভিযোগ গ্রহণযোগ্য নয়*
//             </p>
//           </div>
//         </div>
//       </>
//     );
//   },
// );

// InvoicePrint.displayName = "InvoicePrint";




"use client";
import { getSettings } from "@/services-api/globalSettingsService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { extractImageUrl } from "@/utils/image";
import { fetchChatSettings } from "@/services-api/chatSettingsService";

interface Product {
  id: string | number;
  sku?: string;
  images?: string[];
  unit?: string;
}

interface OrderItem {
  id: string | number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
  product?: Product;
  variant?: {
    images?: string[];
    sku?: string;
    unit?: string;
  };
  external_image?: string;
}

interface Order {
  order_number: string | number;
  invoice_number?: string | number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
  discount_amount: number | string;
  shipping_fee: number | string;
  total_amount_due: number | string;
  total_bill?: number | string;
  advance_amount?: number | string;
  order_items?: OrderItem[];
}

interface InvoiceProps {
  order: Order | null | undefined;
  baseStorageUrl: string;
  editableInvoice: string;
  setEditableInvoice: (val: string) => void;
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ order, baseStorageUrl, editableInvoice, setEditableInvoice }, ref) => {
    const { data: settingResponse } = useQuery({
      queryKey: ["global-settings"],
      queryFn: getSettings,
    });

    const { data: chatSettings } = useQuery({
      queryKey: ["chatSettings"],
      queryFn: fetchChatSettings,
    });

    if (!order) return null;

    const subTotal =
      order.order_items?.reduce(
        (acc: number, item: OrderItem) =>
          acc + Number(item.unit_price) * item.quantity,
        0,
      ) || 0;
    const discount = Number(order.discount_amount) || 0;
    const deliveryCharge = Number(order.shipping_fee) || 0;
    const grandTotal =
      Number(order.total_bill) || subTotal + deliveryCharge - discount;
    const advancePay = Number(order.advance_amount) || 0;
    const duePay = Number(order.total_amount_due) || grandTotal - advancePay;

    const settingsdata = settingResponse?.data;
    const logoUrl =
      extractImageUrl(settingsdata?.primary_logo) || "/images/admin/logo.png";
    const displayPhone = chatSettings?.phone || "019XXXXXXXX";

    return (
      <>
<style
  dangerouslySetInnerHTML={{
    __html: `
      @media print {
        @page { size: A4; margin: 10mm; }
        body * { visibility: hidden; }
        #invoice-print-area, #invoice-print-area * { visibility: visible; }
        #invoice-print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        /* Essential table printing rules */
        table { display: table !important; width: 100% !important; }
        tr { display: table-row !important; }
        td, th { display: table-cell !important; }
      }
    `,
  }}
/>

        <div
        id="invoice-print-area"
          ref={ref}
          className="p-10 bg-white w-[210mm] text-[#023337] font-inter"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex gap-5">
              <div className="w-[105px] h-[100px] relative">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  className="object-contain h-full w-full"
                  fill
                  unoptimized
                />
              </div>
              <div className="text-[13px] text-[#5E6470] border-gray-200 space-y-0.5">
                <p className="font-medium">{settingsdata?.company_name}</p>
                {/* Header Text requirement */}
                <p className="font-bold text-[#FF6A00] text-[14px] uppercase tracking-tight">
                  CREASS
                </p>
                <p>www.creassmart.com</p>
                <p className="font-normal">{settingsdata?.contact_email}</p>
                <p className="font-normal">{displayPhone}</p>
              </div>
            </div>
            <div className="text-right font-normal text-[11px] text-[#5E6470] pt-13">
              <p className="font-normal text-[#5E6470] uppercase tracking-widest mb-1">
                Business address
              </p>
              <p>{settingsdata?.address}</p>
            </div>
          </div>

          <div className="border border-[#D7DAE0] rounded-xl px-6 py-6 mb-8 text-gray-800 text-[13px] leading-relaxed">
            {/* Info Bar */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-[#5E6470] font-medium text-[11px] mb-1">
                  Billed to
                </p>
                <p className="font-bold text-[#1A1C21]">
                  {order.customer_name}
                </p>
                <p className="text-[#023337]">{order.customer_phone}</p>
                <p className="text-[#023337] max-w-[200px]">
                  {order.customer_address}
                </p>
              </div>

              <div className="ml-20">
                <p className="text-[#5E6470] font-medium text-[11px] mb-1">
                  Invoice number
                </p>
                <div className="flex items-center">
                  <span className="font-bold text-[#1A1C21] text-[13px]">
                    #
                  </span>
                  <input
                    type="text"
                    value={editableInvoice}
                    onChange={(e) => setEditableInvoice(e.target.value)}
                    className="font-bold text-[#1A1C21] text-[13px] w-32 outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="text-right">
                <p className="text-[#5E6470] font-medium text-[11px] mb-1">
                  Date
                </p>
                <p className="font-bold text-[#1A1C21]">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="font-bold text-[#1A1C21]">
                  {new Date(order.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-[#5E6470] font-medium text-[11px] mt-2 mb-1">
                  Order number
                </p>
                <p className="font-bold text-[#1A1C21]">
                  #{order.order_number}
                </p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full mb-6 text-left border-collapse">
              <thead>
                <tr className="text-[#5E6470] text-[10px] uppercase border-b border-gray-200 border-t tracking-wider">
                  <th className="py-3 font-semibold">NO.</th>
                  <th className="py-3 font-semibold">ITEM DETAIL</th>
                  <th className="py-3 font-semibold">SKU</th>
                  <th className="py-3 font-semibold text-center">QTY</th>
                  <th className="py-3 font-semibold">UNIT</th>
                  <th className="py-3 font-semibold text-right">RATE</th>
                  <th className="py-3 font-semibold text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                {order.order_items?.map((item: OrderItem, idx: number) => (
                  <tr key={item.id} className="text-[13px]">
                    <td className="py-4 text-[#5E6470] font-medium align-top">
                      {idx + 1}
                    </td>
                    <td className="py-4 align-top">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                          <Image
                            src={
                              extractImageUrl(
                                item.variant?.images?.[0] ||
                                  item.product?.images?.[0] ||
                                  item.external_image,
                              ) || "/images/placeholder.svg"
                            }
                            alt="Item"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {item.product_name}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            High-quality premium product
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium align-top">
                      {item.variant?.sku || item.product?.sku || "N/A"}
                    </td>
                    <td className="py-4 text-center text-gray-900 font-medium align-top">
                      {item.quantity}
                    </td>
                    <td className="py-4 text-gray-600 align-top">
                      {item.variant?.unit || item.product?.unit || "pcs"}
                    </td>
                    <td className="py-4 text-right text-gray-900 font-medium align-top">
                      ৳{Number(item.unit_price).toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-bold text-gray-900 align-top">
                      ৳
                      {(
                        Number(item.unit_price) * item.quantity
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 text-[12px]">
                <div className="flex justify-between text-gray-600">
                  <p>Sub Total</p>
                  <p className="font-medium text-gray-900">
                    ৳{subTotal.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between text-gray-600">
                  <p>Delivery Charge</p>
                  <p className="font-medium text-gray-900">
                    ৳{deliveryCharge.toLocaleString()}
                  </p>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <p>Discount</p>
                    <p className="font-medium">
                      - ৳{discount.toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex justify-between font-bold text-[14px] text-gray-900 pt-1">
                  <p>Grand Total</p>
                  <p>৳{grandTotal.toLocaleString()}</p>
                </div>

                <div className="flex justify-between text-gray-600">
                  <p>Advance Pay</p>
                  <p className="font-medium text-gray-900">
                    ৳{advancePay.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between font-bold text-[14px] text-gray-900 pt-1">
                  <p>Due Pay</p>
                  <p>৳{duePay.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-gray-100">
            <p className="text-red-600 text-[12px] font-bold">
              বিঃ দ্রঃ ইনভয়েসসহ আনবক্সিং ভিডিও বাধ্যতামূলক ভিডিও ছাড়া কোনো
              অভিযোগ গ্রহণযোগ্য নয়*
            </p>
          </div>
        </div>
      </>
    );
  },
);

InvoicePrint.displayName = "InvoicePrint";
"use client";
import React from "react";

interface InvoiceProps {
  order: any;
  baseStorageUrl: string;
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoiceProps>(({ order, baseStorageUrl }, ref) => {
  if (!order) return null;

  const subTotal = order.order_items?.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * item.quantity), 0) || 0;
  const discount = Number(order.discount_amount) || 0;
  const deliveryCharge = Number(order.shipping_fee) || 0;
  const grandTotal = Number(order.total_amount_due) || 0;

  return (
    <div ref={ref} className="p-12 bg-white min-h-[297mm] w-[210mm] font-lato text-[#023337] print:p-10 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex gap-5">
          <img src="/images/minilogo.png" alt="Logo" className="h-16 object-contain" />
          <div className="text-[13px] border-l border-gray-200 pl-5 space-y-0.5">
            <p className="font-black text-[18px] text-[#FF6A00] leading-none">CREASS MART</p>
            <p className="font-medium text-gray-500">www.creassmart.com</p>
            <p className="font-medium text-gray-500">opbd.shop@gmail.com</p>
            <p className="font-medium text-gray-500">+88 0141 0050041</p>
          </div>
        </div>
        <div className="text-right text-[13px] text-gray-600">
          <p className="font-bold text-[#023337] uppercase tracking-widest mb-1">Business address</p>
          <p>D-14/3, Bank Colony, Savar</p>
          <p>Dhaka-1340</p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex justify-between border-t border-gray-100 pt-8 mb-12">
        <div className="space-y-1">
          <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">Billed to</p>
          <p className="font-bold text-[20px] text-[#023337]">{order.customer_name}</p>
          <p className="text-[14px] text-gray-700 font-medium">{order.customer_phone}</p>
          <p className="max-w-[280px] text-[14px] text-gray-600 leading-relaxed">{order.customer_address}</p>
        </div>
        <div className="text-right space-y-6">
          <div>
            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">Invoice number</p>
            <p className="font-bold text-[20px] text-[#023337]">#{order.order_number}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">Date</p>
            <p className="font-bold text-[15px] text-[#023337]">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p className="text-gray-500 text-[13px]">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="text-gray-400 text-[11px] font-bold uppercase border-b-2 border-[#023337]/10">
            <th className="py-4 text-left w-12">NO.</th>
            <th className="py-4 text-left">ITEM DETAIL</th>
            <th className="py-4 text-left">SKU</th>
            <th className="py-4 text-center">QTY</th>
            <th className="py-4 text-center">UNIT</th>
            <th className="py-4 text-right">RATE</th>
            <th className="py-4 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.order_items?.map((item: any, idx: number) => (
            <tr key={item.id} className="text-[14px]">
              <td className="py-6 align-top text-gray-500">{String(idx + 1).padStart(2, '0')}</td>
              <td className="py-6 flex gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                   {item.product?.images?.[0] && (
                     <img src={`${baseStorageUrl}/${item.product.images[0].replace(/^\/+/, "")}`} className="object-cover w-full h-full" />
                   )}
                </div>
                <div>
                  <p className="font-bold text-[#023337] text-[15px]">{item.product_name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">High-quality premium product</p>
                </div>
              </td>
              <td className="py-6 align-top text-gray-500 font-medium uppercase">{item.product?.sku || 'N/A'}</td>
              <td className="py-6 align-top text-center font-bold text-[#023337]">{item.quantity}</td>
              <td className="py-6 align-top text-center text-gray-500">pcs</td>
              <td className="py-6 align-top text-right text-gray-600">৳{Number(item.unit_price).toLocaleString()}</td>
              <td className="py-6 align-top text-right font-bold text-[#023337]">৳{(Number(item.unit_price) * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calculations */}
      <div className="flex justify-between items-start mt-10">
        <div className="flex-1">
             <div className="bg-gray-50 p-5 rounded-2xl inline-block min-w-[200px]">
                <p className="flex items-center gap-2 font-bold text-[24px] text-[#023337]">
                    {/* <span className="p-2 bg-white rounded-lg shadow-sm">✍️</span> Edit */}
                </p>
             </div>
        </div>
        <div className="w-72 space-y-3.5 text-[15px]">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Sub Total</span>
            <span className="text-[#023337] font-bold">৳{subTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Delivery Charge</span>
            <span className="text-[#023337] font-bold">৳{deliveryCharge.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#FF4D4D] font-medium">
            <span>Discount (10.00%)</span>
            <span className="font-bold">- ৳{discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[20px] font-black text-[#023337] border-t-2 border-gray-100 pt-4 mt-2">
            <span>Grand Total</span>
            <span>৳{grandTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Advance Pay</span>
            <span className="font-bold">৳0.00</span>
          </div>
          <div className="flex justify-between text-[18px] font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
            <span>Due Pay</span>
            <span className="text-[#FF6A00]">৳{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-auto pt-24 text-center border-t border-gray-50">
         <p className="text-[#FF4D4D] text-[13px] font-bold">
         বিঃ দ্রঃ ইনভয়েসসহ আনবক্সিং ভিডিও বাধ্যতামূলক ভিডিও ছাড়া কোনো অভিযোগ গ্রহণযোগ্য নয়*
         </p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = "InvoicePrint";
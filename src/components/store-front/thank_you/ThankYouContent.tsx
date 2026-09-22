"use client";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";

// Services
import {
  getOrderByIdService,
  editOrderInvoiceService,
} from "@/services-api/orderService";
import { getSettings } from "@/services-api/globalSettingsService";
import { extractImageUrl } from "@/utils/image";
import { fetchChatSettings } from "@/services-api/chatSettingsService";

// Components
import OrderCompletedModal from "@/components/store-front/thank_you/Ordercompletedmodal";
import EditOrderModal, {
  CustomerInfo,
} from "@/components/store-front/thank_you/Editordermodal";
import { OrderItem } from "@/@types/order.type";

export default function ThankYouContent({
  showThankYou = true,
}: {
  showThankYou?: boolean;
}) {
  const [isCompletedOpen, setIsCompletedOpen] = useState(showThankYou);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerInfo | null>(
    null,
  );

  const { data: setting } = useQuery({
    queryKey: ["setting"],
    queryFn: getSettings,
  });
  const { data: chatSettings } = useQuery({
    queryKey: ["chatSettings"],
    queryFn: fetchChatSettings,
  });
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderByIdService(orderId as string),
    enabled: !!orderId,
  });

  const settingsdata = setting?.data;
  const logoUrl =
    extractImageUrl(settingsdata?.primary_logo) || "/images/admin/logo.png";
  const displayPhone = chatSettings?.phone || "019XXXXXXXX";


  const editInvoiceMutation = useMutation({
    mutationFn: (updated: CustomerInfo) =>
      editOrderInvoiceService(orderId!, {
        customerName: updated.name,
        customerPhone: updated.phone,
        customerAddress: updated.address,
      }),
    onSuccess: (_, variables) => {
      setEditedCustomer(variables);
      toast.success("Updated!");
      refetch();
      setIsEditOpen(false);
    },
  });

// 1. Calculate Subtotal
  const subtotal = useMemo(() => 
    apiResponse?.order_items?.reduce((acc: number, item: any) => 
      acc + (Number(item.unit_price) * item.quantity), 0
    ) || 0, [apiResponse]);

  // 2. Extract values
  const shippingFee = Number(apiResponse?.shipping_fee || 0);
  const discountAmount = Number(apiResponse?.discount_amount || 0);
  const advanceAmount = Number(apiResponse?.advance_amount || 0);

  // 3. MATH: The source of truth
  const grandTotal = subtotal + shippingFee - discountAmount;
  const duePay = grandTotal - advanceAmount;

  if (isLoading)
    return <div className="p-20 text-center">Fetching Invoice...</div>;
  if (!apiResponse)
    return <div className="p-20 text-center">Order not found.</div>;

  const currentCustomer = editedCustomer || {
    name: apiResponse.customer_name,
    phone: apiResponse.customer_phone,
    address: apiResponse.customer_address,
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-10 px-4 flex flex-col items-center font-inter">
      <div className="p-10 bg-white w-[210mm] text-[#023337] shadow-sm rounded-lg">
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
              <p className="font-bold text-[#1A1C21]">{currentCustomer.name}</p>
              <p className="text-[#023337]">{currentCustomer.phone}</p>
              <p className="text-[#023337] max-w-[200px]">
                {currentCustomer.address}
              </p>
            </div>
            <div className="ml-20">
              <p className="text-[#5E6470] font-medium text-[11px] mb-1">
                Invoice number
              </p>
              <p className="font-bold text-[#1A1C21] text-[13px]">
                #{apiResponse.invoice_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#5E6470] font-medium text-[11px] mb-1">
                Date
              </p>
              <p className="font-bold text-[#1A1C21]">
                {new Date(apiResponse.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="font-bold text-[#1A1C21]">
                {new Date(apiResponse.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p className="text-[#5E6470] font-medium text-[11px] mt-2 mb-1">
                Order number
              </p>
              <p className="font-bold text-[#1A1C21]">
                #{apiResponse.order_number}
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
              {apiResponse.order_items?.map((item: any, idx: number) => (
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
                              item.product?.images?.[0] || item.external_image,
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
                    {item.sku || item.product?.sku || "N/A"}
                  </td>
                  <td className="py-4 text-center text-gray-900 font-medium align-top">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-gray-600 align-top">
                    {item.unit || item.product?.unit || "pcs"}
                  </td>
                  <td className="py-4 text-right text-gray-900 font-medium align-top">
                    ৳{Number(item.unit_price).toLocaleString()}
                  </td>
                  <td className="py-4 text-right font-bold text-gray-900 align-top">
                    ৳
                    {(Number(item.unit_price) * item.quantity).toLocaleString()}
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
                  ৳{subtotal.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Delivery Charge</p>
                <p className="font-medium text-gray-900">
                  ৳{shippingFee.toLocaleString()}
                </p>
              </div>


    {/* Using apiResponse instead of order */}
    {Number(apiResponse.coupon_discount_amount || 0) > 0 && (
      <div className="flex justify-between text-gray-600">
        <p>Coupon Discount</p>
        <p className="font-medium">- ৳{Number(apiResponse.coupon_discount_amount).toLocaleString()}</p>
      </div>
    )}

    {Number(apiResponse.manual_discount_amount || 0) > 0 && (
      <div className="flex justify-between text-gray-600">
        <p>Special Discount</p>
        <p className="font-medium">- ৳{Number(apiResponse.manual_discount_amount).toLocaleString()}</p>
      </div>
    )}



              {discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <p>Discount</p>
                  <p className="font-medium">
                    - ৳{discountAmount.toLocaleString()}
                  </p>
                </div>
              )}


              {/* Grand Total - USE MANUAL CALCULATION */}
              <div className="flex justify-between font-bold text-[14px] text-gray-900 pt-1 border-t border-gray-200">
                <p>Grand Total</p>
                <p>৳{grandTotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Advance Pay</p>
                <p className="font-medium text-gray-900">
                  ৳{advanceAmount.toLocaleString()}
                </p>
              </div>
              {/* Due Pay - USE MANUAL CALCULATION */}
              <div className="flex justify-between font-bold text-[14px] text-gray-900 pt-1 border-t border-gray-200">
                <p>Due Pay</p>
                <p>
                  ৳{duePay.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5C24]"
        >
          <FiEdit3 /> Edit Customer Details
        </button>

        <div className="mt-16 text-center border-t border-gray-100">
          <p className="text-red-600 text-[12px] font-bold">
            বিঃ দ্রঃ ইনভয়েসসহ আনবক্সিং ভিডিও বাধ্যতামূলক ভিডিও ছাড়া কোনো
            অভিযোগ গ্রহণযোগ্য নয়*
          </p>
        </div>
      </div>

      <OrderCompletedModal
        isOpen={isCompletedOpen}
        onClose={() => setIsCompletedOpen(false)}
        customerName={currentCustomer.name}
        invoiceNo={apiResponse.invoice_number}
      />
      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        customer={currentCustomer as CustomerInfo}
        onSave={(updated) => editInvoiceMutation.mutate(updated)}
      />
    </div>
  );
}

"use client";
import { useRef, useState } from "react";
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

// Components
import OrderCompletedModal from "@/components/store-front/thank_you/Ordercompletedmodal";
import EditOrderModal, {
  CustomerInfo,
} from "@/components/store-front/thank_you/Editordermodal";
import { OrderItem } from "@/@types/order.type";
import { invoiceItem } from "@/@types/invoice.type";
import { getSettings } from "@/services-api/globalSettingsService";
import { extractImageUrl } from "@/utils/image";

export default function ThankYouContent({ showThankYou = true }: { showThankYou?: boolean }) {
  const [isCompletedOpen, setIsCompletedOpen] = useState(showThankYou);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const invoiceRef = useRef<HTMLDivElement>(null);
  // const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<CustomerInfo | null>(
    null,
  );

  const { data: setting } = useQuery({
    queryKey: ["setting"],
    queryFn: () => getSettings(),
  });
  const settingsdata = setting?.data;

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderByIdService(orderId as string),
    enabled: !!orderId,
  });

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const invoiceLogo =
    extractImageUrl(settingsdata?.primary_logo, backendBaseUrl) ||
    "/images/admin/logo.png";

  // edit invoice mutation
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

  if (isLoading)
    return (
      <div className="p-20 text-center font-medium">Fetching Invoice...</div>
    );
  if (!apiResponse)
    return <div className="p-20 text-center">Order not found.</div>;

  // calculation and data preparation
  const currentCustomer = editedCustomer || {
    name: apiResponse.customer_name,
    phone: apiResponse.customer_phone,
    address: apiResponse.customer_address,
  };

  const subtotal =
    apiResponse.order_items?.reduce(
      (acc: number, item: OrderItem) =>
        acc + Number(item.unit_price) * item.quantity,
      0,
    ) || 0;
  const shippingFee = Number(
    apiResponse.shipping_fee ??
      apiResponse.delivery_fee ??
      apiResponse.delivery_charge ??
      apiResponse.shippingFee ??
      0,
  );
  const discountAmount = Number(apiResponse.discount_amount || 0);

  const formattedDate = apiResponse.created_at
    ? new Date(apiResponse.created_at).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  // ... keep imports same, replace the RETURN block inside ThankYouContent
  return (
    <div className="min-h-screen bg-[#F7F7F7] py-10 px-4 flex flex-col items-center">
      <div
        ref={invoiceRef}
        className="p-12 bg-white w-full max-w-[210mm] mx-auto font-lato text-[#023337] box-border shadow-sm rounded-lg"
      >
        {/* 1. Header Section */}
        <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative">
              <Image
                src={invoiceLogo}
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="h-12 w-[1px] bg-gray-300"></div>
            <div className="text-[13px] space-y-0.5">
              <p className="font-bold text-[#FF6A00] text-[16px] uppercase tracking-tight">
                {settingsdata?.company_name || "CREASS"}
              </p>
              <p className="text-gray-500 font-medium">
                {settingsdata?.contact_email}
              </p>
              <p className="text-gray-500 font-medium">+88 0141 0050041</p>
            </div>
          </div>
          <div className="text-right text-[13px] text-gray-600">
            <p className="font-bold text-[#023337] uppercase tracking-widest mb-1">
              Business Address
            </p>
            <p className="max-w-[200px]">{settingsdata?.address}</p>
          </div>
        </div>

        {/* 2. Info Bar */}
        <div className="grid grid-cols-3 w-full border-t border-gray-100 pt-8 mb-12 items-start">
          <div className="text-left space-y-1">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Billed to
            </p>
            <p className="font-bold text-[18px] text-[#023337] leading-tight">
              {currentCustomer.name}
            </p>
            <p className="text-[13px] text-gray-700 font-medium">
              {currentCustomer.phone}
            </p>
            <p className="text-[13px] text-gray-600 leading-tight max-w-[200px]">
              {currentCustomer.address}
            </p>
          </div>
          <div className="flex justify-center items-start">
            <div className="text-left">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">
                Invoice Number
              </p>
              <p className="font-bold text-[18px] text-[#023337]">
                #{apiResponse.invoice_number}
              </p>
            </div>
          </div>
          <div className="text-right space-y-4">
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-0.5">
                Date
              </p>
              <p className="font-bold text-[15px] text-[#023337]">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-0.5">
                Order Number
              </p>
              <p className="font-bold text-[18px] text-[#023337]">
                #{apiResponse.order_number}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="text-gray-400 text-[11px] font-bold uppercase border-b-2 border-[#023337]/10">
              <th className="py-4 text-left w-12">NO.</th>
              <th className="py-4 text-left">ITEM DETAIL</th>
              <th className="py-4 text-center">QTY</th>
              <th className="py-4 text-right">RATE</th>
              <th className="py-4 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {apiResponse.order_items?.map((item: any, idx: number) => (
              <tr key={item.id} className="text-[14px]">
                <td className="py-6 align-top text-gray-500">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="py-6 font-bold text-[#023337]">
                  {item.product_name}
                </td>
                <td className="py-6 align-top text-center font-bold text-[#023337]">
                  {item.quantity}
                </td>
                <td className="py-6 align-top text-right text-gray-600">
                  ৳{Number(item.unit_price).toLocaleString()}
                </td>
                <td className="py-6 align-top text-right font-bold text-[#023337]">
                  ৳{(Number(item.unit_price) * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 4. Footer Totals */}
        <div className="flex justify-end mt-10">
          <div className="w-72 space-y-3.5 text-[15px]">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Sub Total</span>
              <span className="text-[#023337] font-bold">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Delivery Charge</span>
              <span className="text-[#023337] font-bold">
                ৳{shippingFee.toLocaleString()}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#FF4D4D] font-medium">
                <span>Discount</span>
                <span className="font-bold">
                  - ৳{discountAmount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[20px] font-black text-[#023337] border-t-2 border-gray-100 pt-4 mt-2">
              <span>Grand Total</span>
              <span>৳{Number(apiResponse.total_bill).toLocaleString()}</span>
            </div>
            {Number(apiResponse.advance_amount) > 0 && (
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Advance Pay</span>
                <span className="font-bold">
                  ৳{Number(apiResponse.advance_amount).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[18px] font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
              <span>Due Pay</span>
              <span className="text-[#FF6A00]">
                ৳{Number(apiResponse.total_amount_due).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center border-t border-gray-50 pt-10">
          <p className="text-[#FF4D4D] text-[13px] font-bold">
            বিঃ দ্রঃ ইনভয়েসসহ আনবক্সিং ভিডিও বাধ্যতামূলক ভিডিও ছাড়া কোনো
            অভিযোগ গ্রহণযোগ্য নয়*
          </p>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="mt-10 flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5C24]"
        >
          <FiEdit3 /> Edit Customer Details
        </button>
      </div>
      {/* Modals stay at the bottom */}
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

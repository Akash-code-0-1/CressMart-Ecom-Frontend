"use client";
import { useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import Image from "next/image";

// Services & Store
import {
  getOrderByIdService,
  editOrderInvoiceService,
} from "@/services-api/orderService";
import OrderCompletedModal from "@/components/store-front/thank_you/Ordercompletedmodal";
import EditOrderModal, {
  CustomerInfo,
} from "@/components/store-front/thank_you/Editordermodal";
import { extractOrderData } from "@/utils/orderUtils";
import {
  CustomerSection,
  InvoiceHeader,
} from "@/components/store-front/thank_you/InvoiceHeader";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Data Fetching
  const { data: fetchedOrderData, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderByIdService(orderId as string),
    enabled: !!orderId,
  });

  // Derive order directly during rendering using useMemo (No useEffect needed!)
  const order = useMemo(() => {
    if (!fetchedOrderData) return null;
    return extractOrderData(fetchedOrderData, orderId);
  }, [fetchedOrderData, orderId]);

  // Local override state for when the customer edits their info before a refetch
  const [editedCustomer, setEditedCustomer] = useState<CustomerInfo | null>(
    null,
  );

  // Combine fetched customer with local edits if any
  const currentCustomer = editedCustomer || order?.customer;

  // Calculations
  const subtotal = useMemo(
    () =>
      order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
      0,
    [order],
  );

  const total =
    order?.totalAmountDue ??
    subtotal - (order?.discountAmount || 0) + (order?.deliveryFee || 0);

  // Helper: fetch an image URL and return a base64 data URL
  const toDataURL = (url: string): Promise<string> =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }),
      );

  // PDF Logic
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsDownloading(true);
    const imgs = Array.from(
      invoiceRef.current.querySelectorAll("img"),
    ) as HTMLImageElement[];
    const originalSrcs = imgs.map((img) => img.src);

    try {
      await Promise.all(
        imgs.map(async (img) => {
          try {
            img.src = await toDataURL(img.src);
          } catch {}
        }),
      );

      const dataUrl = await toPng(invoiceRef.current, {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        cacheBust: false,
        skipFonts: true,
        style: { margin: "0" },
        filter: (node: HTMLElement) => {
          if (node.dataset?.html2canvasIgnore !== undefined) return false;
          return true;
        },
      });

      const width = invoiceRef.current.offsetWidth;
      const height = invoiceRef.current.offsetHeight;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`invoice-${order?.invoiceNo}.pdf`);
    } catch (error: unknown) {
      console.error("PDF generation error:", error);
      toast.error(
        `PDF Error: ${(error as Error)?.message || (typeof error === "string" ? error : "Failed to generate")}`,
      );
    } finally {
      // Step 2: Restore original src values
      imgs.forEach((img, i) => {
        img.src = originalSrcs[i];
      });
      setIsDownloading(false);
    }
  };

  const editInvoiceMutation = useMutation({
    mutationFn: (updated: CustomerInfo) =>
      editOrderInvoiceService(orderId!, {
        customerName: updated.name,
        customerPhone: updated.phone,
        customerAddress: updated.address,
      }),
    onSuccess: (_, variables) => {
      setEditedCustomer(variables);
      toast.success("Invoice updated!");
    },
  });

  if (isLoading || !order || !currentCustomer)
    return <div className="py-20 text-center">Loading Invoice...</div>;

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4 font-poppins">
      <div
        ref={invoiceRef}
        className="max-w-[720px] mx-auto bg-white rounded-[16px] shadow-sm p-6 md:p-10"
      >
        <h1 className="text-lg md:text-2xl text-center font-semibold text-[#FF6E50] mb-4">
          Creass Mart
        </h1>

        <InvoiceHeader
          invoiceNo={order.invoiceNo}
          orderNo={order.orderNo}
          status={order.status}
          date={order.date}
        />

        <CustomerSection
          customer={currentCustomer}
          onEdit={() => setIsEditOpen(true)}
        />

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-black mb-4">Order Items</h2>
          <div className="flex flex-col divide-y divide-[#F0F0F0]">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3.5 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border bg-[#F9F9F9] flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        No Image
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-black text-sm font-medium">
                      {item.name}
                    </p>
                    {item.variantInfo && (
                      <p className="text-[11px] text-[#FF5C24]">
                        {item.variantInfo}
                      </p>
                    )}
                    <p className="text-[#727272] text-xs">
                      Qty: {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                </div>
                <p className="text-black text-sm font-semibold">
                  ৳{item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-[#FAFAFA] rounded-[14px] p-5 mb-8 space-y-2">
          <SummaryRow label="Subtotal" value={`৳${subtotal}`} />
          {order.discountAmount > 0 && (
            <SummaryRow
              label="Coupon Discount"
              value={`-৳${order.discountAmount}`}
              color="text-green-600"
            />
          )}
          <SummaryRow label="Delivery Fee" value={`৳${order.deliveryFee}`} />
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#EAEAEA]">
            <span>Total</span>
            <span className="text-[#FF5C24]">৳{total}</span>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          data-html2canvas-ignore
          className="cursor-pointer w-full bg-[#FF7050] text-white py-4 rounded-[39px] text-sm font-medium hover:bg-[#FF5C24] disabled:bg-gray-400"
        >
          {isDownloading ? "Generating PDF..." : "Download Invoice"}
        </button>
      </div>

      <OrderCompletedModal
        isOpen={isCompletedOpen}
        onClose={() => setIsCompletedOpen(false)}
        customerName={currentCustomer.name}
        invoiceNo={order.invoiceNo}
      />
      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        customer={currentCustomer}
        onSave={(updated) => editInvoiceMutation.mutate(updated)}
      />
    </div>
  );
}

const SummaryRow = ({
  label,
  value,
  color = "text-black",
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-[#727272]">{label}</span>
    <span className={`${color} font-medium`}>{value}</span>
  </div>
);

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}

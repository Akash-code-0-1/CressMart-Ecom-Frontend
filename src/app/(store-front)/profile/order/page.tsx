"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { FiHeadphones, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import { format } from "date-fns";
import StatusBadge from "@/components/store-front/profile/StatusBadge";
import { getMyOrdersService } from "@/services-api/orderService";
import { extractImageUrl } from "@/utils/image";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8082";

// --- Strict TypeScript Interfaces (No 'any') ---

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VariantAttribute {
  type: string;
  label: string;
  value: string;
}

export interface Variant {
  images?: string[];
  attributes?: VariantAttribute[];
}

export interface Product {
  name?: string;
  images?: string[];
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  variant_id: string | null;
  variant?: Variant | null;
  product?: Product | null;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount_due: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface OrderApiResponse {
  success: boolean;
  data: {
    meta: Meta;
    data: Order[];
  };
}

// --- Helper Functions ---

const getOrderItemImageUrl = (item?: OrderItem | null): string | null => {
  if (!item) return null;
  // Try to get variant image first, then product image
  const url =
    extractImageUrl(item.variant?.images, backendBaseUrl) ||
    extractImageUrl(item.product?.images, backendBaseUrl);
  return url || null;
};

const getPaginationRange = (
  current: number,
  total: number,
): (number | string)[] => {
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery<OrderApiResponse>({
    queryKey: ["my-orders", currentPage],
    queryFn: () => getMyOrdersService({ page: currentPage, limit }),
  });

  const orders = data?.data?.data || [];
  const meta = data?.data?.meta;

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginationRange = useMemo(
    () => (meta ? getPaginationRange(currentPage, meta.totalPages) : []),
    [meta, currentPage],
  );

  if (isLoading) {
    return (
      <div className="p-10 text-center font-poppins">Loading orders...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 font-poppins">
        Error: {error instanceof Error ? error.message : "Failed to load"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
      {/* Header */}
      <div className="p-6 border-b border-[#F2F2F2]">
        <h2 className="text-[20px] font-semibold text-black">
          Orders ({meta?.total || 0})
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-[#727272] text-[14px] font-medium border-b border-[#F2F2F2]">
              <th className="p-5 pl-8">No.</th>
              <th className="p-5">Order Id</th>
              <th className="p-5">Product</th>
              <th className="p-5">Date</th>
              <th className="p-5">Price</th>
              <th className="p-5">Payment</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#4D4D4D]">
            {orders.length > 0 ? (
              orders.map((order, index) => {
                const firstItem = order.order_items?.[0];
                const productName =
                  firstItem?.product?.name || firstItem?.product_name || "N/A";
                const imageUrl = getOrderItemImageUrl(firstItem);
                const variantAttributes = firstItem?.variant?.attributes || [];

                const serialNumber = meta
                  ? (meta.page - 1) * meta.limit + index + 1
                  : index + 1;

                return (
                  <tr
                    key={order.id}
                    className="border-b border-[#F9F9F9] hover:bg-[#FF7050]/5 transition-all group"
                  >
                    <td className="p-5 pl-8 text-[#727272]">{serialNumber}</td>
                    <td className="p-5 font-semibold text-black">
                      #{order.order_number}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="w-10 h-10 border border-[#FF7050]/20 rounded-full flex items-center justify-center overflow-hidden shrink-0 relative bg-gray-50">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <FiHeadphones
                              size={18}
                              className="text-[#FF7050]"
                            />
                          )}
                        </div>

                        {/* Product Name & Variant Attributes */}
                        <div className="flex flex-col">
                          <span
                            className="font-medium text-black truncate max-w-[180px]"
                            title={productName}
                          >
                            {productName}
                            {order.order_items.length > 1 && (
                              <span className="text-[#727272] ml-1">
                                (+{order.order_items.length - 1})
                              </span>
                            )}
                          </span>

                          {/* Attributes Display */}
                          {variantAttributes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-0.5 text-[#ff6e50]">
                              {variantAttributes.map((attr, attrIdx) => (
                                <span
                                  key={attrIdx}
                                  className="text-[12px] text-[#ff6e50]"
                                >
                                  {attr.label}:{" "}
                                  <span className="font-medium">
                                    {attr.value}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(order.created_at), "dd-MM-yyyy")}
                        </span>
                        <span className="text-[11px] text-[#727272]">
                          {format(new Date(order.created_at), "hh:mm a")}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-black">
                      ৳{order.total_amount_due}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center">
                        <BsDot
                          size={28}
                          className={
                            order.payment_status === "PAID"
                              ? "text-[#32CD32]"
                              : "text-[#FF7050]"
                          }
                        />
                        <span className="font-medium capitalize">
                          {order.payment_status.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-[#727272]">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 py-8 bg-white border-t border-[#F2F2F2]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer border border-[#D2D2D2] rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>

            {paginationRange.map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`w-10 h-10 cursor-pointer rounded-md text-[14px] font-medium transition-all ${
                  currentPage === page
                    ? "bg-[#FF7050] text-white shadow-md"
                    : page === "..."
                      ? "cursor-default text-[#727272]"
                      : "border border-[#D2D2D2] text-[#727272] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.totalPages}
              className="p-2 cursor-pointer border border-[#D2D2D2] rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <p className="text-[13px] text-[#727272]">
            Showing{" "}
            <span className="font-semibold text-black">
              {(meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-semibold text-black">{meta.total}</span>{" "}
            orders
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

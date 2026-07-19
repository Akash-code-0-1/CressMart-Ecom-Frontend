"use client";
import React, { useState } from "react";
import {
  AiFillStar,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { Product, ProductVariant } from "@/@types/product.type";
import Image from "next/image";
import { FaCheck, FaRegEye } from "react-icons/fa";
interface ProductInfoProps {
  product: Product;
}

interface Attribute {
  label: string;
  value: string;
  type?: string;
  hex?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.sell_price);

  const regularPrice = parseFloat(product.regular_price);
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.quantity;

  // discount calculation
  const discount =
    regularPrice > currentPrice
      ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
      : 0;

  // helper function to create variant name
  const getVariantDisplayLabel = (attributes: Attribute[]) => {
    return attributes.map((attr) => attr.value).join(" / ");
  };

  // brand image
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const rowImage = product.brand?.logo_url || "";
  const iconUrl = rowImage.startsWith("http")
    ? rowImage
    : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;

  return (
    <div className="flex flex-col gap-4 font-poppins px-1 sm:px-0 md:mt-0 mt-4">
      {/* SKU and Unit */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {/* brand */}
        <div className="relative w-12 h-12">
          <Image
            src={iconUrl}
            alt={product.brand?.name || ""}
            unoptimized
            fill
            className="object-contain"
          />
        </div>
        <span className="text-[#727272] text-sm sm:text-[16px] font-medium">
          SKU: {currentSku}
        </span>
        {/* <span className="text-[#727272] text-sm sm:text-[16px] font-medium">
          Unit: {product.unit_name}
        </span> */}
      </div>

      {/* Product Title */}
      <h1 className="text-black text-2xl sm:text-[28px] font-semibold leading-snug">
        {product.name}
      </h1>

      {/* Ratings & Stock Status */}
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap text-sm sm:text-[16px]">
        <div className="flex items-center">
          <span className="text-[#FDCC0D] font-medium mr-1">
            ({product.avg_rating ? product.avg_rating.toFixed(1) : "0.0"})
          </span>
          {[...Array(5)].map((_, i) => (
            <AiFillStar
              key={i}
              size={16}
              className={
                i < Math.floor(product.avg_rating || 0)
                  ? "text-[#FDCC0D]"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-[#727272] font-medium ml-1">
            ({product.total_reviews || 0} Review)
          </span>
        </div>
        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaCheck className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">{product.total_sold || 0}</span> sold
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaRegEye className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">{product.view_count || 0}</span>{" "}
          Viewed
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span
          className={`${currentStock > 0 ? "bg-[#32CD32]" : "bg-red-500"} text-white text-xs sm:text-[14px] font-semibold px-3 py-1 rounded-[8px]`}
        >
          {currentStock > 0 ? `${currentStock} In Stock` : "Out of Stock"}
        </span>
      </div>

      {/* Price Section */}
      <div className="flex justify-between md:flex-row flex-col md:items-center items-start gap-3 border-b-2 border-[#D2D2D2] py-4">
        <div className="flex items-center gap-3">
          <span className="text-[#FF7050] text-2xl sm:text-[32px] font-bold">
            BDT {currentPrice.toLocaleString()}
          </span>
          {discount > 0 && regularPrice > currentPrice && (
            <>
              <span className="text-[#727272] text-lg sm:text-[24px] font-medium line-through">
                BDT {regularPrice.toLocaleString()}
              </span>
              <span className="bg-[#32CD32] text-white text-[11px] px-2 py-0.5 rounded-md">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          {product.suppliers.map((supplier) => {
            const rowImage = supplier.image_url || "";
            const iconUrl = rowImage.startsWith("http")
              ? rowImage
              : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;
            return (
              <div key={supplier.id} className="relative w-14 h-14 rounded-md">
                <Image
                  src={iconUrl}
                  alt={supplier.name}
                  unoptimized
                  fill
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-[#727272] text-sm sm:text-[16px] font-normal leading-relaxed text-justify">
        {product.short_description}
      </p>

      {/* Dynamic variant selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-black text-lg font-semibold">
            {Array.from(
              new Set(
                product.variants.flatMap((v) =>
                  (v.attributes as Attribute[]).map((a) => a.label),
                ),
              ),
            ).join(" / ")}
            :
          </span>

          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;

              // check if there is a color hex
              const colorAttr = (variant.attributes as Attribute[]).find(
                (a) => a.type === "color",
              );

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? "border-[#FF7050] bg-[#FF7050] text-white shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-[#FF7050]"
                  }`}
                >
                  {/* show a small circle if there is a color hex */}
                  {colorAttr && colorAttr.hex && (
                    <span
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: colorAttr.hex }}
                    />
                  )}
                  {getVariantDisplayLabel(variant.attributes as Attribute[])}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 w-full">
        {/* Quantity Counter */}
        <div className="flex items-center justify-between border border-[#E2E2E2] rounded-lg h-[52px] w-full sm:w-auto">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-5 h-full hover:text-[#FF7050] transition-colors"
          >
            <AiOutlineMinus />
          </button>
          <span className="px-6 text-lg font-medium min-w-[50px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-5 h-full hover:text-[#FF7050] transition-colors"
          >
            <AiOutlinePlus />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <button className="w-[52px] h-[52px] border border-[#FF7050] rounded-lg text-[#FF7050] text-2xl flex items-center justify-center hover:bg-[#FF7050]/5 transition-all">
            <AiOutlineHeart />
          </button>
          <button
            disabled={currentStock <= 0}
            className="flex-1 h-[52px] border-[1.5px] border-[#FF7050] text-[#FF7050] font-semibold rounded-[8px] hover:bg-[#FF7050]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ADD TO CART
          </button>
          <button
            disabled={currentStock <= 0}
            className="flex-1 h-[52px] bg-[#32CD32] text-white font-semibold rounded-[8px] hover:bg-[#28a728] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ORDER NOW
          </button>
        </div>
      </div>

      {/* Warranty Info */}
      {product.warranty && (
        <p className="mt-2 text-sm text-gray-500 font-medium">
          * {product.warranty}
        </p>
      )}
    </div>
  );
};

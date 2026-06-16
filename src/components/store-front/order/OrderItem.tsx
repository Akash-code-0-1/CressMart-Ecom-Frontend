import React from "react";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";

interface OrderItemProps {
  title: string;
  price: number;
  discount: string;
  color: string;
  size: string;
  image: string;
}

const OrderItem: React.FC<OrderItemProps> = ({
  title,
  price,
  discount,
  color,
  size,
  image,
}) => (
  // Changed to flex-col on mobile, flex-row on desktop (sm:)
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 sm:py-3 font-poppins bg-white border-b border-gray-100 sm:border-0">
    {/* Upper Row: Image & Details */}
    <div className="flex items-center gap-4 flex-1">
      {/* Product Image - Scaled down slightly on mobile */}
      <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-[16px] sm:rounded-[20px] object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Adjusted text size for mobile */}
        <h4 className="text-[16px] sm:text-[18px] font-medium text-[#7E7E7E] leading-snug line-clamp-1">
          {title}
        </h4>

        {/* Attributes (Color & Size) */}
        <div className="flex gap-4 my-1.5 sm:my-2">
          {/* Color Attribute */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-[#1E1E70] rounded-full">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1E1E70] rounded-full"></div>
            </div>
            <span className="text-[12px] sm:text-[14px] text-[#7E7E7E] font-medium">
              {color}
            </span>
          </div>

          {/* Size Attribute */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-[#FF7050] rounded-full">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FF7050] rounded-full"></div>
            </div>
            <span className="text-[12px] sm:text-[14px] text-[#7E7E7E] font-medium">
              {size}
            </span>
          </div>
        </div>

        {/* Price & Discount */}
        <div className="flex items-center gap-3">
          <span className="text-[#FF7050] font-bold text-[18px] sm:text-[20px]">
            BDT {price}
          </span>
          <span className="bg-[#22C55E] text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
            {discount}
          </span>
        </div>
      </div>
    </div>

    {/* Lower Row: Quantity & Delete Actions (Pushed to bottom on mobile, stays on right for desktop) */}
    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pl-[96px] sm:pl-0">
      {/* Quantity Selector */}
      <div className="flex items-center border border-[#E5E5E5] rounded-[10px] h-9 sm:h-11 px-1 sm:px-2">
        <button className="cursor-pointer w-8 text-[#727272] text-xl sm:text-2xl font-light hover:text-gray-600 transition-colors">
          &minus;
        </button>
        <span className="w-6 sm:w-8 text-center text-base sm:text-lg font-semibold text-[#4D4D4D]">
          1
        </span>
        <button className="cursor-pointer w-8 text-[#727272] text-xl sm:text-2xl font-light hover:scale-110 transition-transform">
          +
        </button>
      </div>

      {/* Delete Button */}
      <button className="cursor-pointer text-[#8C8C8C] hover:text-red-500 transition-colors p-1">
        <RiDeleteBin6Line size={20} />
      </button>
    </div>
  </div>
);

export default OrderItem;

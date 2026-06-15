"use client";
import React, { useState } from "react";
import {
  AiFillStar,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaCheck, FaRegEye } from "react-icons/fa";

export const ProductInfo: React.FC = () => {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-4 font-poppins px-1 sm:px-0 md:mt-0 mt-4">
      {/* Brand & SKU */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-bold text-xl sm:text-2xl italic">oraimo</span>
        <span className="text-[#727272] text-sm sm:text-[16px] font-medium">
          Model: 13240
        </span>
        <span className="text-[#727272] text-sm sm:text-[16px] font-medium">
          SKU 21354645
        </span>
      </div>

      {/* Title */}
      <h1 className="text-black text-2xl sm:text-[32px] font-semibold leading-snug sm:leading-normal">
        Apache Luminous Batman Edition Radium Watch
      </h1>

      {/* Stats - Managed spacing clean layout wrappers */}
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap text-sm sm:text-[16px]">
        <div className="flex items-center">
          <span className="text-[#FDCC0D] font-medium mr-1">(5.0)</span>
          {[...Array(5)].map((_, i) => (
            <AiFillStar key={i} size={16} className="text-[#FDCC0D]" />
          ))}
          <span className="text-[#727272] font-medium ml-1">(7 Review)</span>
        </div>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaCheck className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">6,413</span> sold
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaRegEye className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">15,654</span> Viewed
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="bg-[#32CD32] text-white text-xs sm:text-[16px] font-semibold px-2 py-0.5 rounded-[8px] mt-1 sm:mt-0">
          480 Pc In Stock
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-3 sm:gap-4 border-b-2 border-[#D2D2D2] py-3 sm:py-4">
        <span className="text-[#FF7050] text-2xl sm:text-[32px] font-bold">
          BDT 590
        </span>
        <span className="text-[#727272] text-lg sm:text-[24px] font-medium line-through">
          BDT 750
        </span>
        <span className="bg-[#32CD32] text-white text-[11px] sm:text-[12px] px-2 py-0.5 rounded-md font-medium">
          21% OFF
        </span>
      </div>

      {/* Description */}
      <p className="text-[#727272] text-sm sm:text-[16px] font-normal leading-relaxed text-justify sm:text-left">
        ঘড়ির কাঁটায় আভিজাত্য আর অন্ধকারের রোমাঞ্চ ফুটিয়ে তুলতে আমরা নিয়ে
        এসেছি অ্যাপাচি লুমিনাস ব্যাটম্যান এডিশন রেডিয়াম ওয়াচ। This Apache
        Luminous Batman Edition Radium Watch is a top-tier recommendation for
        fans of the Dark Knight and lovers of unique timepieces. এর বিশেষ
        রেডিয়াম প্রযুক্তি অন্ধকারের মধ্যেও ঘড়ির সময়কে স্পষ্ট করে তোলে, যা
        আপনাকে দেবে এক সাহসী এবং প্রিমিয়াম লুক। সাশ্রয়ী বাজেটে চমৎকার এই
        অ্যাপাচি রেডিয়াম ওয়াচটি বর্তমানে বাংলাদেশের তরুণ প্রজন্মের ফ্যাশনে এক
        নতুন ক্রেজ তৈরি করেছে।
      </p>

      {/* Colour Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-black text-lg sm:text-[24px] font-semibold">
          Colour:
        </span>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="flex items-center gap-3 focus:outline-none text-left">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-900 ring-2 ring-offset-2 ring-blue-900" />
            <span className="text-sm sm:text-[16px] font-medium">
              Navy Blue
            </span>
          </button>
          <button className="flex items-center gap-3 opacity-50 focus:outline-none text-left">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600" />
            <span className="text-sm sm:text-[16px] font-medium">
              Crimson Red
            </span>
          </button>
        </div>
      </div>

      {/* Size Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1">
        <span className="text-black text-lg sm:text-[24px] font-semibold">
          Dial Size:
        </span>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="flex items-center gap-3 focus:outline-none text-left">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF7050] ring-2 ring-offset-2 ring-[#FF7050]" />
            <span className="text-sm sm:text-[16px] font-medium">40mm</span>
          </button>
          <button className="flex items-center gap-3 opacity-50 focus:outline-none text-left">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E2E2E2]" />
            <span className="text-sm sm:text-[16px] font-medium">44mm</span>
          </button>
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 sm:mt-8 w-full">
        {/* Quantity Counter */}
        <div className="flex items-center justify-between sm:justify-start border border-[#E2E2E2] rounded-lg h-[52px] w-full sm:w-auto">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="cursor-pointer px-5 h-full flex items-center text-lg text-black hover:text-[#FF7050] transition-all duration-300 focus:outline-none"
          >
            <AiOutlineMinus />
          </button>
          <span className="px-6 text-lg font-medium h-full flex items-center justify-center min-w-[50px]">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="cursor-pointer px-5 h-full flex items-center text-lg text-black hover:text-[#FF7050] transition-all duration-300 focus:outline-none"
          >
            <AiOutlinePlus />
          </button>
        </div>

        {/* Buttons Group Wrapper */}
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <button className="cursor-pointer w-[52px] h-[52px] flex flex-shrink-0 items-center justify-center border border-[#FF7050] rounded-lg text-[#FF7050] text-2xl hover:bg-[#FF7050]/5 active:scale-95 transition-all">
            <AiOutlineHeart />
          </button>

          <button className="cursor-pointer flex-1 h-[52px] border-[1.5px] border-[#FF7050] text-[#FF7050] text-base sm:text-[20px] font-semibold rounded-[8px] hover:bg-[#FF7050]/10 active:scale-98 transition-all duration-200 whitespace-nowrap">
            ADD TO CART
          </button>

          <button className="cursor-pointer flex-1 h-[52px] bg-[#32CD32] hover:bg-[#28a728] text-white text-base sm:text-[20px] font-semibold rounded-[8px] active:scale-98 transition-all duration-200 whitespace-nowrap">
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

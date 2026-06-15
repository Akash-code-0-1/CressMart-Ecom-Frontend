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
    <div className="flex flex-col gap-4 font-poppins">
      {/* Brand & SKU */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-2xl italic">oraimo</span>
        <span className="text-[#727272] text-[16px] font-medium">
          Model: 13240
        </span>
        <span className="text-[#727272] text-[16px] font-medium ml-4">
          SKU 21354645
        </span>
      </div>

      {/* Title */}
      <h1 className="text-black text-[32px] font-semibold leading-normal">
        Apache Luminous Batman Edition Radium Watch
      </h1>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <span className="text-[#FDCC0D] text-base font-medium mr-1">
            (5.0)
          </span>
          {[...Array(5)].map((_, i) => (
            <AiFillStar key={i} size={16} className="text-[#FDCC0D]" />
          ))}
          <span className="text-[#727272] text-[16px] font-medium ml-1">
            (7 Review)
          </span>
        </div>
        <div className="h-6 w-[1px] bg-[#D2D2D2]"></div>
        <span className="text-[#727272] text-[16px] font-medium flex items-center">
          <FaCheck className="mr-1" />
          <span className="font-bold mr-1"> 6,413</span> sold
        </span>
        <div className="h-6 w-[1px] bg-[#D2D2D2]"></div>
        <span className="text-[#727272] text-[16px] font-medium flex items-center">
          <FaRegEye className="mr-1" />
          <span className="font-bold mr-1"> 15,654 </span> Viewed
        </span>
        <div className="h-6 w-[1px] bg-[#D2D2D2]"></div>
        <span className="bg-[#32CD32] text-white text-[16px] font-semibold px-[6px] py-[2px] rounded-[8px]">
          480 Pc In Stock
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4 border-b-2 border-[#D2D2D2] py-4">
        <span className="text-[#FF7050] text-[32px] font-bold">BDT 590</span>
        <span className="text-[#727272] text-[24px] font-medium line-through">
          BDT 750
        </span>
        <span className="bg-[#32CD32] text-white text-[12px] px-2 py-0.5 rounded-md">
          21% OFF
        </span>
      </div>

      {/* Description */}
      <p className="text-[#727272] text-[16px] font-normal leading-relaxed">
        ঘড়ির কাঁটায় আভিজাত্য আর অন্ধকারের রোমাঞ্চ ফুটিয়ে তুলতে আমরা নিয়ে এসেছি
        অ্যাপাচি লুমিনাস ব্যাটম্যান এডিশন রেডিয়াম ওয়াচ। This Apache Luminous
        Batman Edition Radium Watch is a top-tier recommendation for fans of the
        Dark Knight and lovers of unique timepieces. এর বিশেষ রেডিয়াম প্রযুক্তি
        অন্ধকারের মধ্যেও ঘড়ির সময়কে স্পষ্ট করে তোলে, যা আপনাকে দেবে এক সাহসী এবং
        প্রিমিয়াম লুক। সাশ্রয়ী বাজেটে চমৎকার এই অ্যাপাচি রেডিয়াম ওয়াচটি বর্তমানে
        বাংলাদেশের তরুণ প্রজন্মের ফ্যাশনে এক নতুন ক্রেজ তৈরি করেছে।
      </p>

      {/* Colour Selection */}
      <div className="flex items-center gap-2">
        <span className="text-black text-[24px] font-semibold mr-4">
          Colour:
        </span>
        <div className="inline-flex gap-6 items-center">
          <button className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-900 ring-3 ring-offset-3 ring-blue-900" />
            <span className="text-[16px] font-medium">Navy Blue</span>
          </button>
          <button className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-red-600" />
            <span className="text-[16px] font-medium">Crimson Red</span>
          </button>
        </div>
      </div>

      {/* Size Selection */}
      <div className="flex items-center gap-2">
        <span className="text-black text-[24px] font-semibold mr-4">
          Dial Size:
        </span>
        <div className="inline-flex gap-6 items-center">
          <button className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-[#FF7050] ring-3 ring-offset-3 ring-[#FF7050]" />
            <span className="text-[16px] font-medium">40mm</span>
          </button>
          <button className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#E2E2E2]" />
            <span className="text-[16px] font-medium">44mm</span>
          </button>
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div className="flex items-center border border-[#E2E2E2] rounded-lg h-[52px]">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="cursor-pointer px-4 text-xl text-black hover:text-[#FF7050] transition-all duration-300"
          >
            <AiOutlineMinus />
          </button>
          <span className="px-6 text-xl font-medium h-full flex items-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="cursor-pointer px-4 text-xl text-black hover:text-[#FF7050] transition-all duration-300"
          >
            <AiOutlinePlus />
          </button>
        </div>

        <div className="flex gap-4">
          <button className="cursor-pointer w-[52px] h-[52px] flex items-center justify-center border border-[#FF7050] rounded-lg text-[#FF7050] text-2xl">
            <AiOutlineHeart />
          </button>

          <button className="cursor-pointer px-8 h-[52px] border-[1.5px] border-[#FF7050] text-[#FF7050] text-[20px] font-semibold rounded-[8px] grow lg:grow-0 hover:bg-[#FF7050]/10 active:scale-98 transition-all duration-200">
            ADD TO CART
          </button>

          <button className="cursor-pointer px-8 h-[52px] bg-[#32CD32] hover:bg-[#28a728] text-white text-[20px] font-semibold rounded-[8px] grow lg:grow-0 active:scale-98 transition-all duration-200">
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

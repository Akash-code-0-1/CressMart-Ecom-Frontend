"use client";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { HiMiniMinusSmall } from "react-icons/hi2";
import { MdChevronRight } from "react-icons/md";
import { useState } from "react";

export default function FilterSidebar() {
  const [value, setValue] = useState(500);
  const categories = [
    { name: "Computer Accessories", count: 1246 },
    { name: "Power Bank", count: 246 },
    { name: "Microphone", count: 1246 },
    { name: "Telephone", count: 246 },
    { name: "Smart Watch", count: 246 },
    { name: "Router & Internet", count: 1246 },
    { name: "Mobile Accessories", count: 2246 },
  ];

  const brands = [
    { name: "JBL", count: 6257, logo: "JBL", color: "text-red-600 font-bold" },
    { name: "Smart", count: 3246, logo: "Smart" },
    { name: "Oraimo", count: 2801, logo: "oraimo", color: "font-black" },
    { name: "HnB", count: 1487, logo: "HnB" },
  ];

  return (
    <div className="w-full max-w-[420px] rounded-[22px] bg-[#F7F7F7] p-6 font-poppins flex flex-col gap-[10px]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-4">
        <h3 className="text-black md:text-[32px] text-xl font-medium leading-normal">
          Filter
        </h3>
        <button className="text-[#008CFF] md:text-[24px] text-lg font-medium hover:underline">
          Reset Filter
        </button>
      </div>

      {/* Categories Section */}
      <div className="py-4 border-b border-[#D9D9D9]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-black md:text-[24px] text-xl font-medium">
            Categories
          </h4>
          <HiMiniMinusSmall className="md:text-2xl text-xl text-gray-400" />
        </div>

        <ul className="flex flex-col gap-4">
          {/* All Option */}
          <li className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-2">
              <IoCheckmarkCircleSharp className="text-[#D9D9D9] text-[24px]" />
              <span className="text-black md:text-[20px] text-base font-normal">
                All
              </span>
            </div>
            <span className="text-black md:text-[20px] text-base font-normal">
              63574
            </span>
          </li>

          {/* Active Category */}
          <li className="flex flex-col gap-3">
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-2">
                <IoCheckmarkCircleSharp className="text-[#FF7050] text-[24px]" />
                <span className="text-[#FF7050] md:text-[20px] text-base font-normal">
                  Gadget & Tools
                </span>
              </div>
              <span className="text-[#FF7050] md:text-[20px] text-base font-normal">
                6257
              </span>
            </div>

            {/* Nested Sub-categories */}
            <ul className="flex flex-col gap-3 ml-4">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <MdChevronRight size={24} />
                    <span className="text-[#727272] md:text-[20px] text-sm font-normal group-hover:text-black">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[#727272] md:text-[20px] text-sm font-normal">
                    {cat.count}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* Price Section */}
      <div className="py-4 border-b border-[#D9D9D9]">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-black md:text-[24px] text-xl font-medium">
            Price
          </h4>
          <HiMiniMinusSmall className="md:text-2xl text-xl text-gray-400" />
        </div>
        <p className="text-[#828282] text-[16px] mb-3">0 BDT – {value} BDT</p>

        <div className="relative h-8 flex items-center">
          {/* Track background */}
          <div className="absolute left-0 right-0 h-[5px] rounded-full border border-[#FF7050] bg-gray-100" />

          {/* Filled track */}
          <div
            className="absolute left-0 h-[8px] rounded-full bg-[#FF7050]"
            style={{
              width: `${(value / 100000) * 100}%`,
            }}
          />

          {/* Thumb input */}
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="price-slider absolute w-full z-10"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["500 BDT", "1000 BDT", "1500 BDT"].map((price) => (
            <span
              key={price}
              className="px-3 py-1 border border-[#FF7050] text-[#FF7050] rounded-full text-sm"
            >
              {price}
            </span>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="py-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-black md:text-[24px] text-xl font-medium">
            Brands
          </h4>
          <HiMiniMinusSmall className="text-2xl text-gray-400" />
        </div>
        <ul className="flex flex-col gap-4">
          <li className="flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <IoCheckmarkCircleSharp className="text-[#D9D9D9] text-[24px]" />
              <span className="text-black text-[20px] font-normal">All</span>
            </div>
            <span className="text-black text-[20px] font-normal">63574</span>
          </li>

          {brands.map((brand, i) => (
            <li
              key={i}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <IoCheckmarkCircleSharp
                  className={
                    brand.name === "JBL"
                      ? "text-[#FF7050] text-[24px]"
                      : "text-[#D9D9D9] text-[24px]"
                  }
                />
                <span
                  className={`text-[20px] font-normal ${brand.color || "text-black"}`}
                >
                  {brand.logo}
                </span>
              </div>
              <span className="text-black text-[20px] font-normal">
                {brand.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

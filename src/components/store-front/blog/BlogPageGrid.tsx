"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

const articles = [
  {
    id: 1,
    title: "Techy desk lamps that reduce eye strain and charge your devices",
    author: "Tom Brick",
    time: "21h ago",
    image: "/images/store-front/brand/blog.png",
  },
  {
    id: 2,
    title: "Will the coronavirus kill open-plan offices?",
    author: "Tom Brick",
    time: "21h ago",
    image: "/images/store-front/brand/blog.png",
  },
  {
    id: 3,
    title:
      "Eleven new iOS 14 features to look forward to, from translation to privacy labels",
    author: "Tom Brick",
    time: "21h ago",
    image: "/images/store-front/brand/blog.png",
  },
  {
    id: 4,
    title: "Five ways to protect your privacy during a protest",
    author: "Tom Brick",
    time: "21h ago",
    image: "/images/store-front/brand/blog.png",
  },
  ...Array(8)
    .fill(null)
    .map((_, i) => ({
      id: i + 5,
      title:
        i % 2 === 0
          ? "Will the coronavirus kill open-plan offices?"
          : "Techy desk lamps that reduce eye strain and charge your devices",
      author: "Tom Brick",
      time: "21h ago",
      image:
        i % 2 === 0
          ? "/images/store-front/brand/blog.png"
          : "/images/store-front/brand/blog.png",
    })),
];

const categories = [
  "All Categories",
  "Gadget & Tools",
  "Essentials",
  "Kids Zone",
  "Health, Organic & Supplements",
  "Safety & Security",
  "Gift Item",
];

const BlogPageGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const router = useRouter();

  return (
    <section className="w-full pt-10 px-4 md:px-10 bg-white font-inter">
      <div className="max-w-[1720px] mx-auto">
        {/* --- Top Nav Bar --- */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 mb-12 overflow-x-auto">
          <div className="flex items-center gap-6 md:gap-10 whitespace-nowrap overflow-x-auto no-scrollbar pb-4 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative py-4 text-[13px] md:text-[14px] font-medium transition-all ${
                  activeCategory === cat
                    ? "text-[#FF7050]"
                    : "text-[#727272] hover:text-black"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#FF7050] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <div className="hidden lg:block pb-4 md:pb-0">
            <FiSearch className="text-xl text-[#727272] cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* --- Main Article Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {articles.map((item) => (
            <div
              key={item.id}
              className="flex flex-col group cursor-pointer"
              onClick={() => router.push(`/blog/${item.id}`)}
            >
              {/* Image with Rounded Corners */}
              <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Metadata */}
              <p className="text-[#8C8C8C] text-[13px] font-medium mb-3">
                {item.author} - {item.time}
              </p>

              {/* Title */}
              <h3 className="text-black text-[18px] md:text-[20px] font-bold leading-[1.4] line-clamp-2 hover:text-[#FF7050] transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        <div className="flex items-center justify-center gap-3 mt-20 mb-10">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FF7050] text-white font-bold text-sm">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FDF1EE] text-[#727272] font-bold text-sm hover:bg-[#FF7050] hover:text-white transition-colors">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FDF1EE] text-[#727272] font-bold text-sm hover:bg-[#FF7050] hover:text-white transition-colors">
            3
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPageGrid;

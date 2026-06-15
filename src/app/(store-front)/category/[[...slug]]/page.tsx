"use client";

import { useState } from "react";
import CategoryBanner from "@/components/store-front/category/CategoryBanner";
import FilterSidebar from "@/components/store-front/category/FilterSidebar";
import ProductGridHeader from "@/components/store-front/category/ProductGridHeader";
import SubCategoryBar from "@/components/store-front/category/SubCategoryBar";
import ProductCard from "@/components/store-front/common/ProductCard";
import Link from "next/link";
import { FaChevronRight, FaFilter, FaTimes } from "react-icons/fa";

const CategoryPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const products = Array(20).fill({
    id: 1,
    title: "H20 Mini USB Portable Air Humidifier",
    price: 598,
    oldPrice: 750,
    discount: "25%",
    image: "/images/store-front/products/product02.png",
    rating: 5,
    reviews: 120,
    inStock: true,
  });

  return (
    <div className="px-4 md:px-10 mb-20">
      {/* 1. Breadcrumb & Banner */}
      <div className="max-w-[1720px] mx-auto py-4">
        <nav className="mb-4 font-poppins font-medium text-base flex items-center gap-2">
          <Link href="/" className="text-[#727272]">
            Home
          </Link>{" "}
          <FaChevronRight color="#FF7050" size={15} />
          <span className="text-[#FF7050]">Gadget & Tools</span>
        </nav>
        <CategoryBanner />
      </div>

      {/* 2. Sub-category */}
      <div className="max-w-[1720px] mx-auto mb-6 md:mb-8">
        <SubCategoryBar />
      </div>

      {/* 3. Main Content: Sidebar + Grid */}
      <div className="max-w-[1720px] mx-auto pt-6 md:pt-14">
        <ProductGridHeader totalProducts={6257} />

        {/* Mobile Filter Trigger Button (Visible only below lg breakpoint) */}
        <div className="lg:hidden mt-6 flex justify-start">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#F2F2F2] rounded-lg text-sm font-poppins font-medium  active:scale-95 transition-all"
          >
            <FaFilter className="text-[#FF7050]" size={14} />
            <span className="text-base font-poppins">Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6 lg:mt-10">
          {/* Desktop Sidebar - Unchanged */}
          <aside className="hidden lg:block w-[390px] shrink-0">
            <FilterSidebar />
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-4 gap-2">
              {products.map((product, idx) => (
                <ProductCard key={idx} {...product} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white border border-gray-200 rounded-full hover:bg-orange-500 hover:text-white transition-all cursor-pointer font-poppins">
                Load More
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* 4. Mobile Filter Slide-over Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileFilterOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileFilterOpen(false)}
        />

        {/* Drawer Content Container */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[min(390px,85vw)] bg-white h-full flex flex-col transition-transform duration-300 ease-out ${
            isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header with Close Action */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <span className="font-poppins font-semibold text-lg">Filters</span>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Scrollable Sidebar Wrapper */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <FilterSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

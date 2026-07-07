"use client";
import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import PrimaryButton from "../common/PrimaryButton";
import ImportFileIcon from "@/components/store-front/svg/svg/ImportFileIcon";
import ExportIcon from "@/components/store-front/svg/svg/ExportIcon";
import SelectTrigger from "../common/SelectTrigger";
import PluseIcon from "@/components/store-front/svg/svg/PluseIcon";
import ViewIcon from "@/components/store-front/svg/svg/ViewIcon";

const ProductToolbar = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-white p-5 font-lato">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 className="text-[#023337] text-[22px] font-bold font-lato">
          Products
        </h2>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex items-center bg-[#F9F9F9] rounded-[8px] px-3 py-2 w-full md:w-[292px]">
            <Search size={24} className="text-[#000000] mr-2" />
            <input
              type="text"
              placeholder="Search products/SKU"
              className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-[#7B7B7B]"
            />
            <button className="text-sm cursor-pointer font-normal text-black ml-2">
              Search
            </button>
          </div>

          {/* Deep Search Button */}
          <button className="flex items-center justify-center gap-2 bg-[#F9F9F9] px-4 py-2.5 rounded-[8px] text-sm font-medium text-black w-full sm:w-auto cursor-pointer">
            <ThreeBarIcon color="black" />
            Deep Search
          </button>

          {/* View Toggle - Special Border */}
          <div className="border border-[#F7931E] rounded-[8px] px-3 py-1 flex flex-col justify-center cursor-pointer hover:bg-orange-50 transition-colors w-full sm:w-auto">
            <span className="text-[12px] text-[#070707] font-poppins font-medium">
              View
            </span>
            <div className="flex items-center gap-2">
              <ViewIcon />
              <span className="text-[15px] font-poppins font-normal text-[#070707]">
                Large icons
              </span>
            </div>
          </div>

          {/* Add Product Button container */}
          <div className="w-full sm:w-auto">
            <PrimaryButton
              onClick={() => router.push("/admin/dashboard/products/add")}
              label="Add Product"
              icon={<PluseIcon />}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-4">
        {/* Left Side Actions */}
        <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
          <button className="flex items-center gap-2 text-[#161719] text-sm font-bold hover:opacity-80 cursor-pointer">
            <ImportFileIcon />
            Import
          </button>
          <button className="flex items-center gap-2 text-[#161719] text-sm font-bold hover:opacity-80 cursor-pointer">
            <ExportIcon />
            Export
          </button>

          <SelectTrigger
            label="10 Products"
            onClick={() => console.log("Open Dropdown")}
          />
        </div>

        {/* Right Side Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto mb-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <div className="flex items-center gap-2 mr-2 shrink-0">
            <ThreeBarIcon color="black" />
            <span className="text-sm font-normal text-[#000000]">Filter :</span>
          </div>

          {/* Category Dropdown */}
          <div className="shrink-0">
            <SelectTrigger
              label="All Category"
              onClick={() => console.log("Open Dropdown")}
            />
          </div>
          {/* Brands Dropdown */}
          <div className="shrink-0">
            <SelectTrigger
              label="All Brands"
              onClick={() => console.log("Open Dropdown")}
            />
          </div>

          {/* Status Dropdown */}
          <div className="shrink-0">
            <SelectTrigger
              label="All Status"
              onClick={() => console.log("Open Dropdown")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;

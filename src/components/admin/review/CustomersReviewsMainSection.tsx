"use client";

import { ArrowUpDown } from "lucide-react";
import CustomerTable from "./CustomerTable";
import ReviewTable from "./ReviewTable";
import SearchBar from "../common/SearchBar";
import SelectTrigger from "../common/SelectTrigger";

export default function CustomersReviewsMainSection() {
  return (
    <div className="w-full bg-white min-h-screen font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full px-2">
            {/* Search Input Container */}
            <SearchBar placeholder="Search Customers" />

            {/* Sort Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[12px] text-[#7B7B7B] font-normal">
                Sort by
              </span>
              <SelectTrigger label="Newest" />
              <button className="p-2 bg-[#F9F9F9] rounded-[4px] text-black ">
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>

          {/* Customer Table Component */}
          <CustomerTable />
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4">
          {/* Header Filtering Tools */}
          <div className="flex items-center justify-between w-full h-[42px] px-2">
            <h3 className="text-base text-black font-medium font-poppins">
              Review
            </h3>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[12px] text-[#7B7B7B] font-normal">
                Sort by
              </span>
              <SelectTrigger label="Newest" />
              <button className="p-2 bg-[#F9F9F9] rounded-[4px] text-black ">
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>

          {/* Review Table Component */}
          <ReviewTable />
        </div>
      </div>
    </div>
  );
}

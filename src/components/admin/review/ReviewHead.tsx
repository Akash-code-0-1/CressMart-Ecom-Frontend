"use client";

import PluseIcon from "@/components/store-front/svg/svg/PluseIcon";
import PrimaryButton from "../common/PrimaryButton";
import SearchBar from "../common/SearchBar";
import SelectTrigger from "../common/SelectTrigger";

const ReviewHead = () => {
  return (
    <div className="w-full bg-white p-5 font-lato mt-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-[#023337] text-[22px] font-bold font-lato">
          Customers Review
        </h2>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Search Bar */}
          <SearchBar />
          <SelectTrigger label="All Status" />
          <SelectTrigger label="10 Tags" />

          {/* Add Product Button container */}
          <div className="w-full sm:w-auto">
            <PrimaryButton label="Add Customer" icon={<PluseIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewHead;

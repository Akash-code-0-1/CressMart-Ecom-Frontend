import React from "react";

const PricingList: React.FC = () => (
  <div className="mt-20 font-poppins">
    <h3 className="font-semibold text-xl mb-4 text-black">Pricing List</h3>
    <div className="flex flex-col gap-3 text-lg text-[#727272] bg-[#F9F9F9] p-6 rounded-[12px]">
      <div className="flex justify-between">
        <span>Total Product Cost</span>
        <span className="font-semibold">5600 BDT</span>
      </div>
      <div className="flex justify-between">
        <span>Discount Amount</span>
        <span className="font-medium">600 BDT</span>
      </div>
      <div className="flex justify-between">
        <span>Coupon</span>
        <span className="font-medium">0 BDT</span>
      </div>
      <hr className="border-dashed border-gray-200 my-1" />
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-medium">5000 BDT</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping Fee</span>
        <span className="font-medium">70 BDT</span>
      </div>
      <hr className="border-gray-200 my-1" />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xl font-semibold text-[#FF7050]">
          Payable Amount
        </span>
        <span className="text-xl font-semibold text-[#FF7050]">5070 BDT</span>
      </div>
    </div>
  </div>
);

export default PricingList;

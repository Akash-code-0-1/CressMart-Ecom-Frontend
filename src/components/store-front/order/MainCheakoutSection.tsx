import React from "react";
import InputField from "./InputField";
import OrderItem from "./OrderItem";
import PricingList from "./PricingList";
import { FaCaretDown } from "react-icons/fa";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const MainCheakoutSection: React.FC = () => {
  return (
    <div className="max-w-[1720px] mx-auto p-4 md:p-10 font-poppins bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Shopping Details Form */}
        <div className="lg:col-span-7 flex flex-col gap-5 md:gap-6">
          <h2 className="text-lg md:text-xl font-semibold font-poppins mb-2 md:mb-4">
            Shopping Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              placeholder="Type your Name Here"
              required
            />
            <InputField label="Number" placeholder="Phone Number" required />
          </div>

          <InputField
            label="Address"
            placeholder="House No, Road No, Area, City, District"
            required
          />
          <InputField
            label="Note"
            placeholder="Write your instruction here..."
            isTextArea
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-full">
              {/* Responsive Label Font */}
              <label className="text-[#727272] font-semibold text-base md:text-lg">
                Select Delivery Charge <span className="text-[#FF7050]">*</span>
              </label>
              <div className="relative w-full">
                {/* Responsive input padding & font */}
                <select className="w-full bg-[#F9F9F9] pl-4 md:pl-6 pr-12 py-3.5 md:py-4 rounded-[12px] outline-none text-base md:text-lg border border-transparent appearance-none cursor-pointer">
                  <option>Out Side Dhaka BDT 130</option>
                  <option>In Side Dhaka BDT 70</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#727272]">
                  <FaCaretDown size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full relative">
              <label className="text-[#727272] font-semibold text-base md:text-lg">
                Payment Method <span className="text-[#FF7050]">*</span>
              </label>

              <div className="relative w-full">
                <select className="w-full bg-[#F9F9F9] pl-4 md:pl-6 pr-12 py-3.5 md:py-4 rounded-[12px] outline-none text-base md:text-lg border border-transparent appearance-none cursor-pointer">
                  <option>Cash On Delivery</option>
                  <option>Online Payment</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#727272]">
                  <FaCaretDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#727272] font-semibold text-base md:text-lg">
              Coupon
            </label>
            <div className="flex gap-2 md:flex-row flex-col">
              <input
                placeholder="abc-xyz-123"
                className="bg-[#F9F9F9] py-4 md:py-5 px-4 md:px-6 rounded-[10px] outline-none text-base md:text-lg border border-transparent w-full font-poppins"
              />
              <button className="bg-[#9E9E9E] text-base md:text-lg cursor-pointer hover:bg-gray-500 transition-colors text-white px-10 py-3.5 md:py-4 rounded-[12px] font-medium">
                Apply
              </button>
            </div>
          </div>

          {/* Adjusted warning banner layout for clean scaling on small screens */}
          <div className="bg-[#FFFF00] p-3 md:p-4 rounded-[12px] flex items-start sm:items-center gap-2 text-sm md:text-[16px] font-normal text-left sm:text-center text-black justify-center">
            <span className="text-base leading-none shrink-0">⚠️</span>
            <span>
              A 10% advance is required if the delivery ratio is below 80% or
              spans multiple products.
            </span>
          </div>

          <button className="bg-[#FF7050] text-white py-3.5 md:py-4 rounded-[12px] text-lg md:text-xl font-bold hover:bg-[#ff6b48] active:scale-[0.99] transition-all w-full cursor-pointer">
            Place Order
          </button>
          <p className="text-center text-[#727272] text-sm md:text-base font-normal">
            100% Secure Checkout & Guaranteed Safety
          </p>
        </div>

        {/* Right Side: My Orders */}
        {/* Added top margin on mobile layout to separate the grid blocks nicely */}
        <div className="lg:col-span-5 mt-10 lg:mt-0">
          <h2 className="text-lg md:text-xl font-semibold mb-6 md:mb-10">
            My Orders
          </h2>

          {/* Added y-padding context for mobile navigation offsets */}
          <div className="relative py-4 md:py-0">
            {/* Scroll Up Button */}
            <button className="absolute -top-[20px] md:-top-[30px] left-1/2 -translate-x-1/2 bg-[#F9F9F9] rounded-[8px] px-5 md:px-6 py-2 md:py-3 cursor-pointer z-10 shadow-sm md:shadow-none">
              <IoChevronUpOutline color="#727272" size={18} />
            </button>

            <div className="flex flex-col max-h-[360px] md:max-h-[400px] overflow-y-auto no-scrollbar px-1">
              <OrderItem
                title="Apache Luminous Batman Edition Radium W..."
                price={590}
                discount="21% OFF"
                color="Navy Blue"
                size="40mm"
                image="/images/store-front/products/w.png"
              />
              <OrderItem
                title="Apache Luminous Batman Edition Radium W..."
                price={590}
                discount="21% OFF"
                color="Navy Blue"
                size="40mm"
                image="/images/store-front/products/w.png"
              />
              <OrderItem
                title="Apache Luminous Batman Edition Radium W..."
                price={590}
                discount="21% OFF"
                color="Navy Blue"
                size="40mm"
                image="/images/store-front/products/w.png"
              />
            </div>

            {/* Scroll Down Button with Badge */}
            <div className="absolute -bottom-[20px] md:-bottom-[30px] left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              <button className="bg-[#F9F9F9] rounded-[8px] px-5 md:px-6 py-2 md:py-3 cursor-pointer shadow-sm md:shadow-none">
                <IoChevronDownOutline color="#727272" size={18} />
              </button>
              <span className="bg-[#22C55E] text-white text-[12px] md:text-[14px] font-medium w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full">
                2
              </span>
            </div>
          </div>

          <PricingList />
        </div>
      </div>
    </div>
  );
};

export default MainCheakoutSection;

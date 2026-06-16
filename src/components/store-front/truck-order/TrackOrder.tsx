"use client";
import React from "react";
import { FaTrashAlt, FaFileDownload } from "react-icons/fa";

const TrackOrder = () => {
  return (
    <div className="min-h-screen bg-white font-poppins pb-20">
      {/* Header Section */}
      <div className="bg-[#4D4D4D] text-white md:py-40 py-20 px-4 text-center">
        {/* font-bold changed to font-semibold */}
        <h1 className="text-3xl md:text-[40px] font-semibold mb-4">
          Track Your Order
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Search Section (Floating Card) */}
      <div className="max-w-[900px] mx-auto px-4 -mt-16">
        <div className="bg-white p-8 md:p-12 rounded-[30px] shadow-[0px_10px_40px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-[#4D4D4D] ml-2">
              Order ID
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Please enter your order ID here"
                  className="w-full bg-white border border-[#E5E5E5] rounded-[15px] py-4 px-6 pr-12 outline-none focus:border-[#FF7050] transition-all text-sm"
                />
                <FaTrashAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-red-500 transition-colors" />
              </div>
              {/* font-bold changed to font-semibold */}
              <button className="bg-[#FF7050] hover:bg-[#ff5d39] text-white px-10 py-4 rounded-[15px] font-semibold transition-all active:scale-95 cursor-pointer whitespace-nowrap">
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1200px] mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column: Customer Info */}
          <div className="flex flex-col gap-8">
            <div>
              {/* font-bold changed to font-semibold */}
              <h2 className="text-2xl font-semibold text-black mb-6">
                Customer info
              </h2>
              <div className="flex flex-col gap-3">
                <InfoRow label="Name:" value="I H Ornob" />
                <InfoRow label="Number:" value="+880 18** ***112" />
                <InfoRow
                  label="Address:"
                  value="House No, Road No, Area, City, District House No, Road No, Area, City, District"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-semibold text-gray-400 mb-1">
                Order ID
              </p>
              {/* font-bold changed to font-semibold */}
              <h3 className="text-lg font-semibold text-black">
                #2414151542523523523
              </h3>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <ProductRow
                qty="1x"
                name="LED Monitor With High Quality In The World"
              />
              <ProductRow qty="1x" name="Magic Pen for iPad" />
            </div>

            {/* font-bold changed to font-semibold */}
            <button className="flex items-center gap-2 border border-[#FF7050] text-[#FF7050] px-6 py-3 rounded-[12px] w-fit font-semibold hover:bg-[#FF7050] hover:text-white transition-all cursor-pointer mt-4">
              <FaFileDownload size={18} />
              Download PDF
            </button>
          </div>

          {/* Right Column: Order Timeline */}
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#FF7050]" />

            <div className="flex flex-col gap-12">
              <TimelineItem
                status="Order Delivered"
                date="Sun, 24 Jul 2020, 09:34 AM"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e"
              />
              <TimelineItem
                status="On Shipping"
                date="Sat, 23 Jul 2020, 01:24 PM"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e"
              />
              <TimelineItem
                status="Payment Success"
                date="Fri, 22 Jul 2020, 10:44 AM"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e"
              />
              <TimelineItem
                status="Order Created"
                date="Thu, 21 Jul 2020, 11:49 AM"
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4">
    {/* font-bold changed to font-semibold */}
    <span className="text-base font-semibold text-black min-w-[80px]">
      {label}
    </span>
    <span className="text-base text-[#727272]">{value}</span>
  </div>
);

const ProductRow = ({ qty, name }: { qty: string; name: string }) => (
  <div className="flex gap-4 text-sm font-medium">
    {/* font-bold changed to font-semibold */}
    <span className="text-black font-semibold">{qty}</span>
    <span className="text-[#727272]">{name}</span>
  </div>
);

const TimelineItem = ({
  status,
  date,
  desc,
}: {
  status: string;
  date: string;
  desc: string;
}) => (
  <div className="relative pl-10">
    {/* Circle dot */}
    <div className="absolute left-0 top-1.5 w-4 h-4 bg-[#FF7050] rounded-full border-4 border-white ring-1 ring-[#FF7050]" />

    <div className="flex justify-between items-start mb-2">
      {/* font-bold changed to font-semibold */}
      <h4 className="text-lg font-semibold text-black">{status}</h4>
      <span className="text-xs md:text-sm text-gray-400 font-medium">
        {date}
      </span>
    </div>
    <p className="text-sm text-[#727272] leading-relaxed max-w-[450px]">
      {desc}
    </p>
  </div>
);

export default TrackOrder;

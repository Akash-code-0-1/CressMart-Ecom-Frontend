"use client";

import React from "react";
import { ChevronDown, Trash2, Code, MessageSquare, Info } from "lucide-react";

const SMSSupportContent = () => {
  const sentWhenOptions = [
    "Order Placed", "Order Confirmed", "Order Delivered", "Order Canceled",
    "Admin Notification", "Account registered", "Account Login"
  ];

  return (
    <div className="pb-20 font-lato animate-in fade-in duration-500 text-gray-800">
      {/* Page Header */}
      <div className="mb-10">
        <h3 className="text-[18px] font-normal text-black mb-1 font-lato">SMS Support</h3>
        <p className="text-xs font-normal text-gray-400 font-poppins">Manage SMS notifications and provider integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* --- LEFT COLUMN (40% Width) --- */}
        <div className="w-full lg:w-[40%] space-y-8">
          
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <h4 className="text-[16px] font-normal text-black">Integrate SMS Provider</h4>
              <p className="text-xs font-normal text-gray-400 font-poppins">Please provide your credentials to integrate</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <select className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none appearance-none border border-transparent focus:border-gray-200 cursor-pointer">
                  <option>Select Provider</option>
                  <option>Green Web BD</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200" placeholder="Sender Id" />
                <input className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200" placeholder="Api/Secret key" />
              </div>
              
              <div className="flex justify-end">
                <button className="bg-[#1890FF] text-white px-10 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md">Save</button>
              </div>
            </div>
          </section>

          {/* Provider List */}
          <section className="space-y-4">
            <h4 className="text-[16px] font-normal text-black px-1">Select SMS Provider</h4>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div className="items-center gap-4">
                    {/* 💡 FIXED: Replaced text with Image tag */}
                    <div className="w-34 h-20 flex items-center justify-center bg-white border border-gray-50 rounded-lg">
                      <img 
                        src="/images/admin/smsbd.png" 
                        alt="BDBULKSMS" 
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 font-medium">Configured</span>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute top-0.5 left-1 bg-white w-4 h-4 rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN (Remaining Width) --- */}
        <div className="w-full lg:flex-1 space-y-10">
          
          <section className="space-y-5">
            <h4 className="text-[16px] font-normal text-black">SMS Sent When</h4>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {sentWhenOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-blue-400 transition-all">
                    <div className="w-2 h-2 rounded-full bg-transparent" />
                  </div>
                  <span className="text-sm font-normal text-gray-600 font-poppins">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="space-y-12">
            
            <div className="space-y-4">
              <div>
                <h4 className="text-[16px] font-normal text-black">Customize SMS Messages for Order</h4>
                <p className="text-xs font-normal text-gray-400 font-poppins">Leave blank to use default messages. Add custom text and use dynamic tags to personalize.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-black uppercase tracking-wider mr-2">Quick Insert</span>
                {["Client Name", "Shop Name", "Product name", "Estimate Delivery"].map(tag => (
                  <button key={tag} className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-[11px] font-normal text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-all">{tag}</button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[#F8F9FA] rounded-2xl p-5 text-sm font-normal outline-none min-h-[120px] resize-none text-gray-400 italic placeholder:text-gray-300"
                placeholder="Custom Message For Delivery"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[16px] font-normal text-black">Customize SMS Messages for Login/Registration</h4>
                <p className="text-xs font-normal text-gray-400 font-poppins">Leave blank to use default messages. Add custom text and use dynamic tags to personalize.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-black uppercase tracking-wider mr-2">Quick Insert</span>
                {["Client Name", "Shop Name", "Phone Number", "Attempt Time"].map(tag => (
                  <button key={tag} className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-[11px] font-normal text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-all">{tag}</button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[#F8F9FA] rounded-2xl p-5 text-sm font-normal outline-none min-h-[120px] resize-none text-gray-400 italic placeholder:text-gray-300"
                placeholder="Custom Message For Login/Registration"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[16px] font-normal text-black">Admin Notification</h4>
                <p className="text-xs font-normal text-gray-400 font-poppins">Leave blank to use default messages. Add custom text and use dynamic tags to personalize.</p>
              </div>
              <textarea 
                className="w-full bg-[#F8F9FA] rounded-2xl p-5 text-sm font-normal outline-none min-h-[120px] resize-none text-gray-400 italic placeholder:text-gray-300"
                placeholder="Custom Message For Admin Notification"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-[#1890FF] text-white px-12 py-4 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
              Update delivery Charges
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SMSSupportContent;
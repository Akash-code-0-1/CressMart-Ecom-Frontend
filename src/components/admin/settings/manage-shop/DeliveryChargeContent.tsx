"use client";

import React, { useState } from "react";
import { Plus, XCircle, CheckCircle2 } from "lucide-react";
import PrimaryButton from "../../common/PrimaryButton";

const DeliveryChargeContent = () => {
  const [defaultCod, setDefaultCod] = useState(false);
  const [zoneCod, setZoneCod] = useState(true);
  const [pathaoActive, setPathaoActive] = useState(true);

  return (
    <div className="space-y-6 pb-20 font-poppins text-gray-800">
      {/* 1. Specific Delivery Charge */}

      <h3 className="text-[16px] font-normal text-black mb-4">Delivery Charge</h3>
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">


        <h3 className="text-[16px] font-normal text-black mb-4">
          Specific Delivery Charge
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <input
              className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
              defaultValue="Dhaka"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center bg-[#F8F9FA] rounded-xl px-4 py-3 border border-transparent">
              <span className="text-gray-400 text-sm font-normal mr-2">
                Inside
              </span>
              <input
                className="bg-transparent outline-none w-full text-right font-semibold text-sm"
                defaultValue="0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center bg-[#F8F9FA] rounded-xl px-4 py-3 border border-transparent">
              <span className="text-gray-400 text-sm font-normal mr-2">
                Outside
              </span>
              <input
                className="bg-transparent outline-none w-full text-right font-semibold text-sm"
                defaultValue="120"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center bg-[#F8F9FA] rounded-xl px-4 py-3 border border-transparent">
              <span className="text-gray-400 text-sm font-normal whitespace-nowrap shrink-0 mr-2">
                Sub city
              </span>
              <input
                className="bg-transparent outline-none w-full text-right font-semibold text-sm"
                defaultValue="100"
              />
            </div>
          </div>
        </div>

        <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold font-lato text-[#003032] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
          <Plus size={14} /> Add More
        </button>

        {/* COD Toggle Row */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-between items-center">
          <span className="text-[16px] font-normal text-[#003032]">
            Enable COD for Default Delivery
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">
              [{defaultCod ? "Yes" : "No"}]
            </span>
            <button
              onClick={() => setDefaultCod(!defaultCod)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                defaultCod ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  defaultCod ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Weight-based Extra Charges */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-[16px] font-normal text-black mb-1">
          Weight-based Extra Charges
        </h3>
        <p className="text-xs font-normal text-gray-400 mb-6">
          Add extra delivery charges based on product weight. For example: 5 kg
          = ৳50, 10 kg = ৳80
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-normal text-gray-400 px-1">
            <div className="col-span-5 uppercase tracking-wider">Weight</div>
            <div className="col-span-5 uppercase tracking-wider">Charge</div>
          </div>

          {/* Existing Row */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <input
              className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
              defaultValue="5 kg"
            />
            <input
              className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
              defaultValue="৳50"
            />
            {/* 💡 FIXED: Changed justify-center to justify-end */}
            <div className="col-span-2 flex justify-end pr-1">
              <button className="text-red-400 hover:text-red-600 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
          </div>

          {/* Add Row */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <input
              className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
              placeholder="Ex. 5 kg"
            />
            <input
              className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
              placeholder="Ex. ৳50"
            />
            {/* 💡 FIXED: Changed justify-center to justify-end */}
            <div className="col-span-2 flex justify-end pr-1">
              <button className="flex items-center gap-1.5 text-xs font-semibold font-lato text-[#003032] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all whitespace-nowrap">
                <Plus size={14} /> Add New
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Delivery Option */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-[16px] font-normal text-black mb-6">
          Delivery Option
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-normal text-gray-400 px-1">
            <div className="col-span-5 uppercase tracking-wider">
              Specific Delivery Charge
            </div>
            <div className="col-span-5 text-right pr-4 uppercase tracking-wider">
              Charge
            </div>
          </div>

          {/* Active Configured Option */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 items-center">
              <input
                className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
                defaultValue="Dhaka"
              />
              <div className="col-span-5 flex items-center bg-[#F8F9FA] rounded-xl px-4 py-3 border border-transparent">
                <input
                  className="bg-transparent outline-none w-full text-right font-semibold text-sm"
                  defaultValue="৳80"
                />
              </div>
              <div className="col-span-2" />
            </div>

            {/* Sub-row for Zone COD and Delete */}
            <div className="flex justify-between items-center pl-1 pr-2 mt-2">
              {/* Left Side: Descriptive Text */}
              <span className="text-[16px] font-normal text-[#003032]">
                Enable COD for this zone
              </span>

              {/* Right Side: Toggle Group + Delete Button */}
              <div className="flex items-center gap-6">
                {/* Toggle and Status Text */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">
                    [{zoneCod ? "Yes" : "No"}]
                  </span>
                  <button
                    onClick={() => setZoneCod(!zoneCod)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      zoneCod ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        zoneCod ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Delete Button (X) */}
                <button className="text-red-400 hover:text-red-600 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Add Option Row */}
          <div className="grid grid-cols-12 gap-4 items-center pt-5 border-t border-gray-100">
            <select className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal text-gray-400 outline-none appearance-none cursor-pointer border border-transparent focus:border-gray-200 transition-all">
              <option>Select delivery zone</option>
            </select>
            <input
              className="col-span-5 bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
              placeholder="Price"
            />
            <div className="col-span-2 flex justify-end">
              <button className="flex items-center gap-1.5 text-xs font-semibold font-lato text-[#003032] bg-[#F3F4F6] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
                <Plus size={14} /> Add New
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <PrimaryButton
            label="Update delivery Charges"
            className="px-8 py-3 rounded-xl text-sm shadow-md"
          />
        </div>
      </section>

      {/* 4. Courier Services */}
      <section className="space-y-5">
        <div>
          <h3 className="text-[16px] font-normal text-black mb-1">
            Courier Services
          </h3>
          <p className="text-xs font-normal text-gray-400">
            Enable and configure your preferred delivery services
          </p>
        </div>

        {/* --- Pathao (Active & Configured) --- */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-5 flex justify-between items-center bg-white">
            <div className=" items-center gap-4">
              <div className="w-20 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-xl  shadow-xs">
                <img
                  src="/images/admin/pathao.png"
                  alt="Pathao"
                  className="object-contain h-full w-full"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#6F6F6F] font-normal px-2 py-0.5 rounded-full  items-center gap-1 mt-0.5">
                 Configured and active
                </span>
              </div>
            </div>

            <button
              onClick={() => setPathaoActive(!pathaoActive)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                pathaoActive ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  pathaoActive ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="p-6 border-t border-gray-100 space-y-5 bg-white">
            <p className="text-xs font-normal text-gray-400 italic">
              Please provide your Pathao credentials to integrate Pathao
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
                placeholder="Client ID"
              />
              <input
                className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
                placeholder="Store ID"
              />
              <input
                className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
                placeholder="Email"
              />
              <input
                className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all"
                placeholder="Client Secret"
              />
              <input
                className="bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none placeholder-gray-400 border border-transparent focus:border-gray-200 transition-all md:col-span-2"
                placeholder="Special Instruction (Optional)"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button className="bg-[#1890FF] text-white px-10 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* --- Inactive Couriers --- */}
        {[
          { name: "SteadFast Courier", img: "/images/admin/steadFast.png" },
          { name: "REDX Courier", img: "/images/admin/redx.png" },
          { name: "PAPERFLY", img: "/images/admin/paperfly.png" },
        ].map((courier, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-xl ">
                <img
                  src={courier.img}
                  alt={courier.name}
                  className="object-contain max-h-full"
                />
              </div>
              <div>
                <h4 className="text-[16px] font-normal text-[#003032]">
                  {courier.name}
                </h4>
                <span className="text-xs font-bold text-gray-400">
                  Configure delivery credentials
                </span>
              </div>
            </div>

            <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DeliveryChargeContent;

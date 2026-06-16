"use client";
import { FaPlus } from "react-icons/fa";

const ProfileDetailsForm = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
      {/* Form Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-black">Profile Details</h2>
        <p className="text-sm text-gray-400 mt-2">
          Update your personal information and contact details
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup label="Name" value="Imam Hoshen Ornob" />
          <InputGroup label="Phone" value="+88 017XX XXXXXX" />
          <InputGroup label="Email" value="ornob423@gmail.com" />
        </div>

        {/* Main Address Section */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-base font-semibold text-[#727272]">
            Address
          </label>
          <textarea
            className="w-full bg-[#F9F9F9] rounded-[10px] p-5 text-sm text-gray-700 outline-none min-h-[140px] resize-none border border-transparent focus:border-gray-200"
            defaultValue="Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH"
          />
          {/* Save Changes Button */}
          <div className="flex justify-end mt-4">
            <button className="bg-[#32CD32] text-white px-6 py-3 rounded-[12px] text-base font-semibold flex items-center gap-2 cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        {/* Address 2 Section */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-[#727272]">
            Address 2
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent"
              defaultValue="Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH"
            />
            <button className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold hover:bg-[#e67c00] transition-all cursor-pointer">
              Select
            </button>
          </div>
        </div>

        {/* Add New Address Section */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-[#727272]">
            New Adress
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent"
              placeholder="+88 017XX XXXXXX"
            />
            <button className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e67c00] transition-all cursor-pointer">
              <div className="border-2 border-white rounded-full p-0.5">
                <FaPlus size={10} />
              </div>{" "}
              Add New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Sub-component
const InputGroup = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-base font-semibold text-[#727272]">{label}</label>
    <input
      type="text"
      defaultValue={value}
      className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200"
    />
  </div>
);

export default ProfileDetailsForm;

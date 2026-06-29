// "use client";
// import { FaPlus } from "react-icons/fa";

// const ProfileDetailsForm = () => {
//   return (
//     <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
//       {/* Form Header */}
//       <div className="p-6 border-b border-gray-100">
//         <h2 className="text-lg font-semibold text-black">Profile Details</h2>
//         <p className="text-sm text-gray-400 mt-2">
//           Update your personal information and contact details
//         </p>
//       </div>

//       <div className="p-6 flex flex-col gap-8">
//         {/* Basic Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <InputGroup label="Name" value="Imam Hoshen Ornob" />
//           <InputGroup label="Phone" value="+88 017XX XXXXXX" />
//           <InputGroup label="Email" value="ornob423@gmail.com" />
//         </div>

//         {/* Main Address Section */}
//         <div className="flex flex-col gap-2 relative">
//           <label className="text-base font-semibold text-[#727272]">
//             Address
//           </label>
//           <textarea
//             className="w-full bg-[#F9F9F9] rounded-[10px] p-5 text-sm text-gray-700 outline-none min-h-[140px] resize-none border border-transparent focus:border-gray-200"
//             defaultValue="Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH"
//           />
//           {/* Save Changes Button */}
//           <div className="flex justify-end mt-4">
//             <button className="bg-[#32CD32] text-white px-6 py-3 rounded-[12px] text-base font-semibold flex items-center gap-2 cursor-pointer">
//               Save Changes
//             </button>
//           </div>
//         </div>

//         {/* Address 2 Section */}
//         <div className="flex flex-col gap-2">
//           <label className="text-base font-semibold text-[#727272]">
//             Address 2
//           </label>
//           <div className="flex flex-col md:flex-row gap-4 items-center">
//             <input
//               className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent"
//               defaultValue="Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH"
//             />
//             <button className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold hover:bg-[#e67c00] transition-all cursor-pointer">
//               Select
//             </button>
//           </div>
//         </div>

//         {/* Add New Address Section */}
//         <div className="flex flex-col gap-2">
//           <label className="text-base font-semibold text-[#727272]">
//             New Adress
//           </label>
//           <div className="flex flex-col md:flex-row gap-4 items-center">
//             <input
//               className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent"
//               placeholder="+88 017XX XXXXXX"
//             />
//             <button className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e67c00] transition-all cursor-pointer">
//               <div className="border-2 border-white rounded-full p-0.5">
//                 <FaPlus size={10} />
//               </div>{" "}
//               Add New
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Input Sub-component
// const InputGroup = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-base font-semibold text-[#727272]">{label}</label>
//     <input
//       type="text"
//       defaultValue={value}
//       className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200"
//     />
//   </div>
// );

// export default ProfileDetailsForm;


"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/utils/api";

interface AddressItem {
  id?: string;
  address: string;
  label: "PRIMARY" | "CUSTOM";
}

const ProfileDetailsForm = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isStoreReady = useAuthStore((state) => state._hasHydrated);

  // Core Form Fields State Management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Structured Address States
  const [primaryAddress, setPrimaryAddress] = useState("");
  const [customAddresses, setCustomAddresses] = useState<AddressItem[]>([]);
  const [newAddressInput, setNewAddressInput] = useState("");

  // Global Pipeline Context Flags
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Existing Profile Content
  useEffect(() => {
    if (!isStoreReady) return;

    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const res = await apiFetch("/users/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile data.");
        const rawData = await res.json();
        
        // Handle deeply nested or direct backend objects
        const data = rawData?.data || rawData;

        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");

        // Distribute address nodes based on type labels safely
        const addressList = data.addresses || data.user?.addresses || [];
        if (Array.isArray(addressList)) {
          const primary = addressList.find((addr: AddressItem) => addr.label === "PRIMARY");
          const customs = addressList.filter((addr: AddressItem) => addr.label === "CUSTOM");
          
          if (primary) setPrimaryAddress(primary.address);
          setCustomAddresses(customs);
        }
      } catch (err: any) {
        setStatusMessage({ type: "error", text: err.message || "An error occurred fetching profile info." });
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, [token, isStoreReady, router]);

const handleSaveChanges = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      return setStatusMessage({ type: "error", text: "Name field cannot be left blank." });
    }
    if (cleanName.length < 2) {
      return setStatusMessage({ type: "error", text: "Name must be at least 2 characters long." });
    }

    if (cleanEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanEmail)) {
        return setStatusMessage({ type: "error", text: "Please enter a valid email address format." });
      }
    }

    try {
      setActionLoading(true);
      setStatusMessage(null);

      const res = await apiFetch("/users/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail || undefined,
          primaryAddress: primaryAddress.trim() || undefined,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.message || "Failed to process profile changes.");
      }

      const setAuth = useAuthStore.getState().setAuth;
      if (setAuth && user) {
        setAuth({ ...user, name: cleanName, email: cleanEmail }, token!);
      }

      setStatusMessage({ type: "success", text: "Profile modifications synchronized successfully!" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Could not save adjustments." });
    } finally {
      setActionLoading(false);
    }
  };

  // Add Custom Database Address Form Processing
  const handleAddNewAddress = async () => {
    if (!newAddressInput.trim()) return;

    try {
      setActionLoading(true);
      setStatusMessage(null);

      const res = await apiFetch("/users/addresses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address: newAddressInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save new address.");

      const newAddrObject = data?.data || data;
      setCustomAddresses((prev) => [...prev, newAddrObject]);
      setNewAddressInput("");
      setStatusMessage({ type: "success", text: "New address record appended." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Could not append address." });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isStoreReady || fetching) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 font-poppins gap-3">
        <FaSpinner className="animate-spin text-[#FF7050]" size={32} />
        <p className="text-sm">Assembling profile components...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-black">Profile Details</h2>
        <p className="text-sm text-gray-400 mt-2">
          Update your personal information and contact details
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {statusMessage && (
          <div
            className={`flex items-center gap-3 text-sm font-medium p-4 rounded-[8px] border transition-all ${
              statusMessage.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {statusMessage.type === "success" ? <FaCheckCircle size={16} /> : <FaExclamationCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup label="Name" value={name} onChange={(val) => setName(val)} />
          <InputGroup label="Phone" value={phone} disabled={true} placeholder="No phone record registered" />
          <InputGroup label="Email" value={email} onChange={(val) => setEmail(val)} type="email" />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-base font-semibold text-[#727272]">Primary Address</label>
          <textarea
            className="w-full bg-[#F9F9F9] rounded-[10px] p-5 text-sm text-gray-700 outline-none min-h-[140px] resize-none border border-transparent focus:border-gray-200"
            value={primaryAddress}
            onChange={(e) => setPrimaryAddress(e.target.value)}
            placeholder="Plot No. 23, Sector 7, Uttara Dhaka..."
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveChanges}
              disabled={actionLoading}
              className="bg-[#32CD32] hover:bg-[#2cb92c] transition-colors text-white px-6 py-3 rounded-[12px] text-base font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {actionLoading ? <FaSpinner className="animate-spin" size={16} /> : null}
              Save Changes
            </button>
          </div>
        </div>

        {/* Custom Addresses Mapping Loop with Unique Key Protection */}
        {customAddresses.map((addr, index) => (
          <div key={addr?.id || `address-key-${index}`} className="flex flex-col gap-2">
            <label className="text-base font-semibold text-[#727272]">Address {index + 2}</label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent"
                value={addr?.address || ""}
                readOnly
              />
              <button className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold hover:bg-[#e66345] transition-all cursor-pointer shadow-sm">
                Select
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-[#727272]">New Address</label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200"
              placeholder="Enter new physical address location details..."
              value={newAddressInput}
              onChange={(e) => setNewAddressInput(e.target.value)}
            />
            <button
              onClick={handleAddNewAddress}
              disabled={actionLoading || !newAddressInput.trim()}
              className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e66345] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <div className="border-2 border-white rounded-full p-0.5">
                <FaPlus size={10} />
              </div>
              Add New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}

const InputGroup = ({ label, value, onChange, disabled = false, type = "text", placeholder }: InputGroupProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-base font-semibold text-[#727272]">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

export default ProfileDetailsForm;
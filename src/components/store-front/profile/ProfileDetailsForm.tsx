"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useProfileData, useUpdateProfileMutation, useAddAddressMutation } from "@/hooks/useProfile";

interface AddressItem {
  id?: string;
  address: string;
  label: "PRIMARY" | "CUSTOM";
}

const ProfileDetailsForm = () => {
  // 🚀 Declarative SaaS-Level State Orchestration via custom TanStack Query hooks
  const { data: profile, isLoading, isError, error } = useProfileData();
  
  const updateProfile = useUpdateProfileMutation();
  const addAddress = useAddAddressMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryAddress, setPrimaryAddress] = useState("");
  const [newAddressInput, setNewAddressInput] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Keep local inputs in sync with backend server cache pipeline data updates
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      
      const addressList = profile.addresses || profile.user?.addresses || [];
      if (Array.isArray(addressList)) {
        const primary = addressList.find((addr: AddressItem) => addr.label === "PRIMARY");
        setPrimaryAddress(primary ? primary.address : "");
      }
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      return setStatus({ type: "error", text: "Name field cannot be left blank." });
    }
    if (cleanName.length < 2) {
      return setStatus({ type: "error", text: "Name must be at least 2 characters long." });
    }

    if (cleanEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanEmail)) {
        return setStatus({ type: "error", text: "Please enter a valid email address format." });
      }
    }

    setStatus(null);
    updateProfile.mutate(
      {
        name: cleanName,
        email: cleanEmail || undefined,
        primaryAddress: primaryAddress.trim() || undefined,
      },
      {
        onSuccess: () => {
          setStatus({ type: "success", text: "Profile modifications synchronized successfully!" });
        },
        onError: (err: any) => {
          setStatus({ type: "error", text: err.message || "Could not save adjustments." });
        },
      }
    );
  };

  const handleAddNewAddress = () => {
    const cleanAddress = newAddressInput.trim();
    if (!cleanAddress) return;

    setStatus(null);
    addAddress.mutate(cleanAddress, {
      onSuccess: () => {
        setNewAddressInput("");
        setStatus({ type: "success", text: "New address record appended." });
      },
      onError: (err: any) => {
        setStatus({ type: "error", text: err.message || "Could not append address." });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 font-poppins gap-3">
        <FaSpinner className="animate-spin text-[#FF7050]" size={32} />
        <p className="text-sm">Assembling profile components...</p>
      </div>
    );
  }

  const customAddresses = (profile?.addresses || profile?.user?.addresses || []).filter(
    (addr: AddressItem) => addr.label === "CUSTOM"
  );

  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden font-poppins">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-black">Profile Details</h2>
        <p className="text-sm text-gray-400 mt-2">
          Update your personal information and contact details
        </p>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {(status || isError) && (
          <div
            className={`flex items-center gap-3 text-sm font-medium p-4 rounded-[8px] border transition-all ${
              status?.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {status?.type === "success" ? <FaCheckCircle size={16} /> : <FaExclamationCircle size={16} />}
            <span>{status?.text || error?.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-[#727272]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-[#727272]">Phone</label>
            <input
              type="text"
              value={profile?.phone || ""}
              disabled
              placeholder="No phone record registered"
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-[#727272]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F9F9F9] rounded-[10px] p-4 text-sm text-gray-700 outline-none border border-transparent focus:border-gray-200"
            />
          </div>
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
              disabled={updateProfile.isPending}
              className="bg-[#32CD32] hover:bg-[#2cb92c] transition-colors text-white px-6 py-3 rounded-[12px] text-base font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {updateProfile.isPending && <FaSpinner className="animate-spin" size={16} />}
              Save Changes
            </button>
          </div>
        </div>

        {customAddresses.map((addr: AddressItem, index: number) => (
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
              disabled={addAddress.isPending || !newAddressInput.trim()}
              className="w-full md:w-[150px] bg-[#FF7050] text-white py-3.5 rounded-[10px] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e66345] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {addAddress.isPending ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <div className="border-2 border-white rounded-full p-0.5">
                  <PlusIconShim />
                </div>
              )}
              Add New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon micro-shim to cleanly support legacy font layout structures inside deep trees
const PlusIconShim = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="10" width="10" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 208H240V32c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v176H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v176c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h176c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
  </svg>
);

export default ProfileDetailsForm;
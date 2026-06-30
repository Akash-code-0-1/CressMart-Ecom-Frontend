"use client";

import { useState } from "react";
import { RotateCcw, User } from "lucide-react";
import { ToggleSwitch } from "../ToggleSwitch";
import PrimaryButton from "../../common/PrimaryButton";
import TabItem from "../../catalog/TabItem";
import { usePathname, useRouter } from "next/navigation";
import ChatInterfaceIcon from "@/components/store-front/svg/svg/ChatInterfaceIcon";
import ShopSettingsIcon from "@/components/store-front/svg/svg/ShopSettingsIcon";
import ContentIcon from "@/components/store-front/svg/svg/ContentIcon";
import PhoneIcon from "@/components/store-front/svg/svg/PhoneIcon";
import WhatsappIcon from "@/components/store-front/svg/svg/WhatsappIcon";
import MessangerIcon from "@/components/store-front/svg/svg/MessangerIcon";

const InputField = ({
  label,
  placeholder,
  subLabel,
}: {
  label: string;
  placeholder: string;
  subLabel?: string;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[14px] font-bold text-[#003032] font-lato">
      {label}
    </label>
    {subLabel && <p className="text-[10px] text-gray-400 -mt-1">{subLabel}</p>}
    <input
      type="text"
      placeholder={placeholder}
      className="bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none placeholder:text-gray-400 font-poppins border-none"
    />
  </div>
);

export default function ChatSettingsPage() {
  const [activeSupport, setActiveSupport] = useState("Messenger");
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    {
      id: "web",
      label: "Website Information",
      icon: ContentIcon,
      path: "/admin/dashboard/settings/information",
    },
    {
      id: "chat",
      label: "Chat Settings",
      icon: ChatInterfaceIcon,
      path: "/admin/dashboard/settings/chat",
    },
    {
      id: "shop",
      label: "Manage Shop",
      icon: ShopSettingsIcon,
      path: "/admin/dashboard/settings/manage-shop",
    },
    {
      id: "profile",
      label: "Profile Details",
      icon: User,
      path: "/admin/dashboard/settings/profile",
    },
  ];

  return (
    <div className="w-full p-8 font-lato bg-white">
      <h1 className="text-2xl font-bold text-[#003032] mb-6">Settings</h1>
      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={pathname === tab.path}
            onClick={() => router.push(tab.path)}
          />
        ))}
      </div>
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8 bg-white">
        <h2 className="text-[22px] font-bold text-[#023337]">Chat settings</h2>
        <div className="flex gap-3">
          <button className="cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-[8px] bg-[#F9F9F9] text-[#020202] font-semibold text-sm">
            <RotateCcw size={18} /> Reset
          </button>
          <PrimaryButton label="Save Changes" />
        </div>
      </div>

      {/* Toggles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-poppins bg-white">
        <div className="bg-[#F9F9F9]/50 p-4 rounded-[8px] flex justify-between items-center">
          <div>
            <p className="text-[12px] font-medium text-[#000000]">
              Enable Live Chat
            </p>
            <p className="text-[10px] text-[#B9B9B9]">
              Allow customers to chat with you
            </p>
          </div>
          <ToggleSwitch active={true} />
        </div>
        <div className="bg-[#F9F9F9]/50 p-4 rounded-[8px] flex justify-between items-center text-gray-400">
          <div>
            <p className="text-[12px] font-medium text-[#000000]">
              WhatsApp Fallback
            </p>
            <p className="text-[10px] text-[#B9B9B9]">
              Redirect to WhatsApp when chat disabled
            </p>
          </div>
          <ToggleSwitch active={false} />
        </div>
      </div>

      {/* Message & Hours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 bg-white">
        <div className="md:col-span-8 flex flex-col gap-6">
          <InputField
            label="Welcome Message"
            placeholder="cdfdsds edsfdsdf rgrregtrh"
          />
          <InputField
            label="Offline Message"
            placeholder="cdfdsds edsfdsdf rgrregtrh"
          />
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <InputField label="Support Hour From" placeholder="09:00 AM" />
          <InputField label="Support Hour To" placeholder="09:00 PM" />
        </div>
      </div>

      {/* Chat Support Integration Section */}
      <div className="bg-white p-4 rounded-[8px]">
        <h3 className="text-[20px] font-bold text-black mb-1">Chat Support</h3>
        <p className="text-[12px] text-[#6F6F6F] mb-6 font-poppins">
          Please provide your credentials to integrate
        </p>

        <div className="flex flex-col gap-4">
          {/* Platform Selection Tabs */}
          <div className="flex gap-3">
            {[
              { id: "Phone", icon: PhoneIcon, color: "text-teal-500" },
              { id: "WhatsApp", icon: WhatsappIcon, color: "text-green-500" },
              { id: "Messenger", icon: MessangerIcon, color: "text-blue-600" },
            ].map((plat) => (
              <button
                key={plat.id}
                onClick={() => setActiveSupport(plat.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-[8px] border transition-all cursor-pointer font-medium text-[#000000] text-base
                        ${activeSupport === plat.id ? "border-[#38BDF8] bg-[#F9F9F9]" : "border-[#F9F9F9] bg-[#F9F9F9]"}`}
              >
                <plat.icon />
                {plat.id}
              </button>
            ))}
          </div>

          {/* Platform Input Field */}
          <div className="flex gap-3">
            <input
              type="text"
              defaultValue="www.facebook.com/messages/xyz"
              className="flex-1 bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-400 font-poppins "
            />
            <button className="bg-[#1E90FF] text-white px-10 py-3 rounded-[8px] text-sm font-semibold cursor-pointer">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

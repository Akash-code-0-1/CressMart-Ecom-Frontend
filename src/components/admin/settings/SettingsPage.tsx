"use client";
import { useRouter, usePathname } from "next/navigation";
import { RotateCcw, Plus, User } from "lucide-react";
import CrystalOrangeButton from "./CrystalOrangeButton";
import { LogoUploadCard } from "./LogoUploadCard";
import { RichTextSection } from "./RichTextSection";
import TabItem from "../catalog/TabItem";
import ContentIcon from "@/components/store-front/svg/svg/ContentIcon";
import ChatInterfaceIcon from "@/components/store-front/svg/svg/ChatInterfaceIcon";
import ShopSettingsIcon from "@/components/store-front/svg/svg/ShopSettingsIcon";
import PrimaryButton from "../common/PrimaryButton";

const InputGroup = ({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-3 w-full">
    <label className="text-[15px] font-bold text-[#000000] font-lato">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-base outline-none placeholder:text-[#A2A2A2] border-none font-poppins"
    />
  </div>
);

export default function SettingsPage() {
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
      path: "/admin/dashboard/settings/shop",
    },
    {
      id: "profile",
      label: "Profile Details",
      icon: User,
      path: "/admin/dashboard/settings/profile",
    },
  ];

  return (
    <div className="w-full bg-white p-8 font-lato">
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
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-xl font-bold text-[#003032]">
          Website Information
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-[8px] 
    bg-[#F9F9F9] text-[#020202] font-semibold text-sm sm:text-base whitespace-nowrap transition-colors"
          >
            <RotateCcw size={18} /> Reset
          </button>
          <PrimaryButton
            label="Save Changes"
            className="flex-1 sm:flex-initial text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Logo Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <LogoUploadCard
          title="Primary Store Logo (Fallback)"
          imgSrc="/images/logo.png"
        />
        <LogoUploadCard
          title="Header Logo Override"
          imgSrc="/images/logo.png"
        />
        <LogoUploadCard
          title="Footer Logo Override"
          imgSrc="/images/logo.png"
        />
        <LogoUploadCard title="Favicon (32x32 px)" imgSrc="/images/logo.png" />
      </div>

      {/* Basic Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mb-10">
        <InputGroup label="Announcement" placeholder="Text" />
        <InputGroup label="Email" placeholder="xyz@gmail.com" />
        <InputGroup label="Branding Text" placeholder="Your Brand Text" />
        <InputGroup label="Address" placeholder="Your Address" />
        <InputGroup label="Facebook" placeholder="Facebook link" />
        <InputGroup label="Massager" placeholder="Massager Link" />
        <InputGroup label="Instagram" placeholder="Instagram Link" />
        <InputGroup label="TikTok" placeholder="TikTok Text" />
        <InputGroup label="Social Link" placeholder="Social Link" />
        <div className="flex items-end">
          <CrystalOrangeButton
            label="Add New Link"
            icon={<Plus size={20} strokeWidth={3} />}
            className="w-full"
          />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-12 mb-12">
        {/* Country Settings */}
        <section>
          <h3 className="text-[22px] font-bold text-black mb-6">
            Country Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Shop Country" placeholder="Bangladesh (BD)" />
            <InputGroup label="Shop Currency" placeholder="Taka-BDT (৳)" />
          </div>
        </section>
        {/* Social Login */}
        <section>
          <h3 className="text-[22px] font-bold text-[#000000] mb-6">
            Social Login
          </h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Login Type" placeholder="Google" />
              <InputGroup
                label="Auth/Client ID"
                placeholder="531559968835-..."
              />
            </div>
            <CrystalOrangeButton
              label="Add New"
              icon={<Plus size={18} strokeWidth={3} />}
              className="w-fit px-6"
            />
          </div>
        </section>
        {/* Offer Section */}
        <section>
          <h3 className="text-[22px] font-bold text-[#000000] mb-6">Offer</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Offer Type" placeholder="Registration" />
              <InputGroup label="Discount" placeholder="Ex: 1000 or 20%" />
            </div>
            <CrystalOrangeButton
              label="Add New"
              icon={<Plus size={18} strokeWidth={3} />}
              className="w-fit px-6"
            />
          </div>
        </section>
      </div>

      {/* Rich Text Areas */}
      <RichTextSection title="About us" placeholder="About Your Brand" />
      <RichTextSection
        title="Privacy Policy"
        placeholder="Shop Privacy And Policy"
      />
      <RichTextSection
        title="Terms and Condition"
        placeholder="Shop Terms And Conditions"
      />
      <RichTextSection
        title="Return and Cancellation Policy"
        placeholder="Return and Cancellation Policy"
      />

      {/* Footer Settings Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10">
        <div className="flex flex-col gap-4">
          {[
            {
              t: "Footer Quick Links",
              s: "Shown in the Quick Links column of Footer 2",
            },
            {
              t: "Footer Useful Links",
              s: "Shown in the useful Links column of Footer 3",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#F9F9F9] p-4 rounded-[8px] flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-black font-poppins">
                  {f.t}
                </p>
                <p className="text-[10px] text-[#B9B9B9] font-noraml font-poppins">
                  {f.s}
                </p>
              </div>
              <PrimaryButton label="Add Link" className="px-3 py-2 text-xs" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-black font-poppins">
            Footer Section Settings
          </h4>
          {[
            "Is show new slider",
            "Hide copyright section",
            "Hide copyright text",
            "Powered by System Next IT",
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
              />
              <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
                {item}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-black font-poppins">
            Product Settings
          </h4>
          {[
            "Show Product Sold Count",
            "Allow Product Image Downloads",
            "Show Email Field for Place Order",
            "Enable Promo Code for Place Order",
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-[4px] border-gray-300 accent-[#1DA1F2]"
              />
              <span className="text-xs font-medium text-[#1D1A1A] font-poppins">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react"; // 🚀 FIXED: Added useState
import ChatIcon from "@/components/store-front/svg/svg/ChatIcon";
import GlobalIcon from "@/components/store-front/svg/svg/GlobalIcon";
import NotificationIcon from "@/components/store-front/svg/svg/NotificationIcon";
import VideoCamIcon from "@/components/store-front/svg/svg/VideoCamIcon";
import { useAdminProfileData } from "@/hooks/useProfile";
import AdminChatModal from "@/components/admin/chat/AdminChatModal"; // 🚀 FIXED: Imported newly made Chat Portal
import { Search, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { data: profile } = useAdminProfileData();
  
  // 🚀 FIXED: Interactive modal state toggle variables
  const [chatOpen, setChatOpen] = useState(false);

  const rawUser = profile?.user || profile?.data || profile;
  const adminName = rawUser?.name || "Admin";
  const adminRole = rawUser?.role || "ADMIN";

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";
  
  let finalAvatarUrl = null;
  if (rawUser?.avatar) {
    finalAvatarUrl = rawUser.avatar.startsWith("data:") || rawUser.avatar.startsWith("http")
      ? rawUser.avatar
      : `${backendBaseUrl}/${rawUser.avatar.replace(/^\/+/, "")}`;
  }

  return (
    <header className="flex items-center justify-between bg-white px-4 md:px-6 py-3 mt-2 rounded-[8px] gap-3 mx-2 sm:mx-4">
      {/* LEFT: Hamburger (mobile) + Logo + Actions */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-md text-black hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative w-[120px] h-[32px] md:w-[155px] md:h-[40px]">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 120px, 155px"
          />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 p-2 bg-[#F9F9F9] rounded-[8px] font-poppins cursor-pointer hover:bg-gray-100 transition-colors">
            <GlobalIcon />
            <span className="text-sm font-normal text-black">View Website</span>
          </Link>
          <button className="xl:flex hidden items-center gap-2 p-2 bg-[#F9F9F9] rounded-[8px] font-poppins cursor-pointer hover:bg-gray-100 transition-colors">
            <VideoCamIcon />
            <span className="text-sm font-normal text-black">Tutorials</span>
          </button>
        </div>
      </div>

      {/* CENTER: Search Bar */}
      <div className="flex-1 max-w-[318px] mx-8 hidden md:hidden xl:block">
        <div className="relative group font-poppins">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 bg-[#F9F9F9] border-transparent rounded-[8px] text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            placeholder=""
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none pr-1 z-50">
            <button className="cursor-pointer text-sm font-normal text-black font-sans tracking-tight">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Icons + Profile */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        
        {/* 🚀 FIXED: Clicking this button now safely triggers the Chat Modal Overlay window */}
        <button 
          onClick={() => setChatOpen(true)}
          className="hidden sm:block cursor-pointer p-1 hover:opacity-75 transition-opacity border-none bg-transparent outline-none"
        >
          <ChatIcon />
        </button>

        <button className="hidden sm:block cursor-pointer p-1 hover:opacity-75 transition-opacity border-none bg-transparent outline-none">
          <NotificationIcon />
        </button>

        {/* User Profile */}
        <Link 
          href="/admin/dashboard/profile" 
          className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 font-poppins cursor-pointer group"
        >
          <div className="text-right">
            <p className="text-[10px] md:text-xs font-bold text-[#FF6A00] tracking-wide uppercase leading-tight">
              {adminRole}
            </p>
            <p className="text-xs md:text-sm font-semibold text-black leading-tight group-hover:text-[#FF7050] transition-colors">
              {adminName}
            </p>
          </div>
          <div className="relative">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF9F1C] flex items-center justify-center text-white text-xs md:text-sm font-bold border-2 border-orange-100 group-hover:border-[#FF7050] transition-all overflow-hidden">
              {finalAvatarUrl ? (
                <img 
                  src={finalAvatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                adminName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* 🚀 FIXED: Appended portal overlay portal window controller instance down here */}
      <AdminChatModal 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </header>
  );
};

export default Header;
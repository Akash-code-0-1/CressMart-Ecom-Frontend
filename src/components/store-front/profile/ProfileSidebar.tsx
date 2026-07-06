"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaRegUser, FaRegHeart, FaCamera, FaSpinner } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { SlHandbag } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteSessionToken } from "@/app/actions/auth";
import { useQueryClient } from "@tanstack/react-query";

const sidebarLinks = [
  { name: "Profile Details", href: "/profile", icon: BiUser },
  { name: "Orders", href: "/profile/order", icon: SlHandbag },
  { name: "Wish List", href: "/profile/wishlist", icon: FaRegHeart },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const user = useAuthStore((state) => state.user);
  const isStoreReady = useAuthStore((state) => state._hasHydrated);
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [hydrated, setHydrated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = async () => {
    // 1. Wipe React Query cache stores
    queryClient.clear();
    
    // 2. Wipe layout store state memory safely
    if (clearAuth) {
      clearAuth();
    }

    // 3. Clear secure httpOnly session cookies via Server Action
    await deleteSessionToken();
    
    router.refresh();
    router.push("/signin");
  };

  const handleEditAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      
      // ✅ Backend expects the field name "image"
      formData.append("image", file);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
      const res = await fetch(`${baseUrl}/users/avatar`, {
        method: "PATCH",
        // Browser automatically populates multi-part headers and includes HTTP-only session cookies
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Image upload failed.");
      }

      // ✅ Robust response footprint lookup matching your backend framework schema
      const updatedAvatarPath =
        data?.image_url ??
        data?.avatar ??
        data?.data?.image_url ??
        data?.data?.avatar ??
        data?.user?.avatar ??
        data?.data?.user?.avatar ??
        null;

      if (!updatedAvatarPath) {
        throw new Error("Avatar path not found in server response.");
      }

      if (user && setAuthUser) {
        setAuthUser({
          ...user,
          avatar: updatedAvatarPath,
        });
      }

      // Force React Query cache refresh across app context dependencies
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Force immediate visual layout reload
      setCacheBuster(Date.now());

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      alert(err.message || "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  let avatarUrl = null;
  if (user?.avatar) {
    const cleanPath = user.avatar.replace(/^\/+/, "");
    avatarUrl = `${backendBaseUrl}/${cleanPath}?t=${cacheBuster}`;
  }

  if (!hydrated || !isStoreReady) {
    return (
      <div className="w-full bg-white rounded-[12px] p-6 border border-[#D2D2D2] h-fit font-poppins animate-pulse">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-[#F2F2F2] rounded-full mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[12px] p-6 border border-[#D2D2D2] h-fit font-poppins">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative group w-24 h-24 mb-4">
          <div className="w-full h-full bg-[#F2F2F2] rounded-full overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300 relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <FaRegUser size={40} />
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white z-10 rounded-full">
                <FaSpinner className="animate-spin" size={20} />
              </div>
            )}
          </div>

          <button
            onClick={handleEditAvatarClick}
            disabled={uploading}
            type="button"
            className="absolute bottom-0 right-0 bg-[#FF7050] text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-[#e66345] transition-all cursor-pointer flex items-center justify-center z-20 disabled:opacity-50"
            title="Update Profile Picture"
          >
            <FaCamera size={12} />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-black">
          {user?.name || "User Account"}
        </h3>
        <p className="text-sm text-gray-400 font-medium">
          {user?.phone || "No Phone Info"}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center font-medium gap-4 px-4 py-3.5 rounded-[8px] transition-all relative group ${
                isActive
                  ? "text-black bg-[#F9F9F9]"
                  : "text-[#727272] hover:bg-gray-50"
              }`}
            >
              <Icon
                size={18}
                className={`${isActive ? "text-[#FF7050]" : "text-[#727272]"}`}
              />

              <span className="text-base">{link.name}</span>
              {isActive && (
                <div className="absolute right-0 top-1/4 h-1/2 w-[3px] bg-[#FF7050] rounded-l-full" />
              )}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 mt-4 rounded-[8px] text-[#FF4D4D] hover:bg-red-50 transition-all font-medium cursor-pointer w-full text-left border-none bg-transparent"
        >
          <IoLogOutOutline
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="text-sm">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
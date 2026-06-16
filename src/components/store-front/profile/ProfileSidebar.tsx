"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { SlHandbag } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";

const sidebarLinks = [
  { name: "Profile Details", href: "/profile", icon: BiUser },
  { name: "Orders", href: "/profile/order", icon: SlHandbag },
  { name: "Wish List", href: "/profile/wishlist", icon: FaRegHeart },
];

const ProfileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white rounded-[12px] p-6 border border-[#D2D2D2] h-fit font-poppins">
      {/* User Info Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 bg-[#F2F2F2] rounded-full mb-4 overflow-hidden border border-gray-100 flex items-center justify-center text-gray-300">
          {/* profile image show if never comes defult user icon  */}
          <FaRegUser size={40} />
        </div>
        <h3 className="text-lg font-semibold text-black">Imam Hoshen Ornob</h3>
        <p className="text-sm text-gray-400 font-medium">+88 017XX XXXXXX</p>
      </div>

      {/* Navigation Menu */}
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
              {/* active border */}
              {isActive && (
                <div className="absolute right-0 top-1/4 h-1/2 w-[3px] bg-[#FF7050] rounded-l-full" />
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button className="flex items-center gap-4 px-4 py-3.5 mt-4 rounded-[8px] text-[#FF4D4D] hover:bg-red-50 transition-all font-medium cursor-pointer w-full text-left group">
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

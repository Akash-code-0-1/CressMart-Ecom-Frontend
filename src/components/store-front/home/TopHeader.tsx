// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import ChevronDownIcon from "../svg/ChevronDownIcon";
// import LocationIcon from "../svg/LocationIcon";
// import TrackIcon from "../svg/TrackIcon";

// const TopHeader = () => {
//   const [language, setLanguage] = useState<"BAN" | "ENG">("BAN");
//   const [openLanguage, setOpenLanguage] = useState(false);

//   const languageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         languageRef.current &&
//         !languageRef.current.contains(event.target as Node)
//       ) {
//         setOpenLanguage(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const marqueeText =
//     language === "BAN"
//       ? "Creass Mart এখন হাজারো মানুষের আস্থার অনলাইন দোকান! – সেরা পণ্য, সেরা দাম এবং দ্রুত ডেলিভারি! হাতে পেয়েই টাকা দিন! 💵 থাকছে শতভাগ Original পণ্যের নিশ্চয়তা | Creass Mart – Budget Friendly, Premium Shopping এর সেরা অভিজ্ঞতার জন্য!"
//       : "Creass Mart is trusted by thousands! Best products, best prices, and fast delivery! Pay after receiving your order! 💵 100% Original products guaranteed. Budget Friendly, Premium Shopping Experience.";

//   return (
//     <div className="w-full bg-white border-b border-[#E2E2E2] font-inter py-3 px-4 md:px-10">
//       <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4 lg:gap-10">
//         {/* Left Side */}
//         <div className="hidden lg:flex items-center gap-6 shrink-0">
//           <div className="flex items-center gap-2 cursor-pointer">
//             <LocationIcon />
//             <span className="text-black text-[12px] font-medium whitespace-nowrap">
//               {language === "BAN" ? "স্টোর লোকেশন" : "Store Locations"}
//             </span>
//           </div>

//           <Link
//             href="/track-order"
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <TrackIcon />
//             <span className="text-black text-[12px] font-medium whitespace-nowrap">
//               {language === "BAN" ? "অর্ডার ট্র্যাক করুন" : "Track Your Order"}
//             </span>
//           </Link>
//         </div>

//         {/* Center */}
//         <div className="flex-1 overflow-hidden relative">
//           <div className="whitespace-nowrap flex animate-marquee-normal">
//             <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
//               {marqueeText}
//             </span>

//             <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
//               {marqueeText}
//             </span>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center shrink-0">
//           {/* Currency */}
//           <div className="flex items-center gap-1 cursor-pointer pr-3 md:pr-5">
//             <span className="text-black text-[12px] md:text-[13px] font-medium">
//               BDT
//             </span>
//             <ChevronDownIcon />
//           </div>

//           {/* Language Dropdown */}
//           <div
//             ref={languageRef}
//             className="relative border-l border-[#E2E2E2] pl-3 md:pl-5"
//           >
//             <div className="relative pl-3 md:pl-5">
//               <button
//                 onClick={() => setOpenLanguage((prev) => !prev)}
//                 className="flex items-center gap-1"
//               >
//                 {language === "BAN" ? "বাংলা" : "English"}
//                 <ChevronDownIcon />
//               </button>

//               {openLanguage && (
//                 <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-[#E2E2E2] rounded-md shadow-lg z-[9999]">
//                   <button
//                     onClick={() => {
//                       setLanguage("BAN");
//                       setOpenLanguage(false);
//                     }}
//                     className={`w-full px-4 py-2 text-left text-[13px] hover:bg-gray-100 ${
//                       language === "BAN" ? "font-semibold bg-gray-50" : ""
//                     }`}
//                   >
//                     বাংলা
//                   </button>

//                   <button
//                     onClick={() => {
//                       setLanguage("ENG");
//                       setOpenLanguage(false);
//                     }}
//                     className={`w-full px-4 py-2 text-left text-[13px] hover:bg-gray-100 ${
//                       language === "ENG" ? "font-semibold bg-gray-50" : ""
//                     }`}
//                   >
//                     English
//                   </button>
//                 </div>
//               )}
//             </div>

//             {openLanguage && (
//               <div className="absolute right-0 mt-2 w-36 rounded-md border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
//                 <button
//                   onClick={() => {
//                     setLanguage("BAN");
//                     setOpenLanguage(false);
//                   }}
//                   className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
//                     language === "BAN" ? "bg-gray-100 font-semibold" : ""
//                   }`}
//                 >
//                   বাংলা
//                 </button>

//                 <button
//                   onClick={() => {
//                     setLanguage("ENG");
//                     setOpenLanguage(false);
//                   }}
//                   className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
//                     language === "ENG" ? "bg-gray-100 font-semibold" : ""
//                   }`}
//                 >
//                   English
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHeader;

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/services-api/settingsService";
import ChevronDownIcon from "../svg/ChevronDownIcon";
import LocationIcon from "../svg/LocationIcon";
import TrackIcon from "../svg/TrackIcon";


const TopHeader = () => {
  const [language, setLanguage] = useState<"BAN" | "ENG">("BAN");
  const [openLanguage, setOpenLanguage] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  // Fetch settings to get the dynamic announcement
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const info = settings?.data || settings;
  const announcement = info?.announcement || "Welcome to Creass Mart!";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setOpenLanguage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white border-b border-[#E2E2E2] font-inter py-3 px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4 lg:gap-10">
        {/* Left Side */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer">
            <LocationIcon />
            <span className="text-black text-[12px] font-medium whitespace-nowrap">
              {language === "BAN" ? "স্টোর লোকেশন" : "Store Locations"}
            </span>
          </div>

          <Link
            href="/track-order"
            className="flex items-center gap-2 cursor-pointer"
          >
            <TrackIcon />
            <span className="text-black text-[12px] font-medium whitespace-nowrap">
              {language === "BAN" ? "অর্ডার ট্র্যাক করুন" : "Track Your Order"}
            </span>
          </Link>
        </div>

        {/* Center: Dynamic Announcement */}
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap flex animate-marquee-normal">
            <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
              {announcement}
            </span>
            <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
              {announcement}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center shrink-0">
          <div className="flex items-center gap-1 cursor-pointer pr-3 md:pr-5">
            <span className="text-black text-[12px] md:text-[13px] font-medium">
              BDT
            </span>
            <ChevronDownIcon />
          </div>

          <div
            ref={languageRef}
            className="relative border-l border-[#E2E2E2] pl-3 md:pl-5"
          >
            <button
              onClick={() => setOpenLanguage((prev) => !prev)}
              className="flex items-center gap-1"
            >
              {language === "BAN" ? "বাংলা" : "English"}
              <ChevronDownIcon />
            </button>

            {openLanguage && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-[#E2E2E2] rounded-md shadow-lg z-[9999]">
                <button
                  onClick={() => {
                    setLanguage("BAN");
                    setOpenLanguage(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[13px] hover:bg-gray-100 ${language === "BAN" ? "font-semibold bg-gray-50" : ""}`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => {
                    setLanguage("ENG");
                    setOpenLanguage(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[13px] hover:bg-gray-100 ${language === "ENG" ? "font-semibold bg-gray-50" : ""}`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

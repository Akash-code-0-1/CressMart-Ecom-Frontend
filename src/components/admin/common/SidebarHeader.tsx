// "use client";

// import Image from "next/image";
// import { X } from "lucide-react";

// interface SidebarHeaderProps {
//   onClose?: () => void;
// }

// export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
//   return (
//     <div className="relative mx-auto flex items-center justify-between w-full px-4">
//       <div className="relative w-[120px] h-[30px] sm:w-[140px] sm:h-[35px] lg:w-[160px] lg:h-[40px]">
//         <Image
//           src="/images/admin/logo.png"
//           alt="Logo"
//           fill
//           priority
//           className="object-contain"
//           sizes="(max-width: 768px) 120px, (max-width: 1200px) 140px, 160px"
//         />
//       </div>
//       {onClose && (
//         <button
//           onClick={onClose}
//           className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
//           aria-label="Close sidebar"
//         >
//           <X size={20} />
//         </button>
//       )}
//     </div>
//   );
// };



"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // Added
import { fetchSettings } from "@/services-api/settingsService"; // Added

interface SidebarHeaderProps {
  onClose?: () => void;
}

export const SidebarHeader = ({ onClose }: SidebarHeaderProps) => {
  // 🚀 Fetch dynamic settings for the logo
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const info = settings?.data || settings;
  const rowImage = info?.header_logo || "";
  
  // Construct the usable URL
  const usableImageUrl = rowImage
    ? rowImage.startsWith("http")
      ? rowImage
      : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`
    : "/images/admin/logo.png";

  return (
    <div className="relative mx-auto flex items-center justify-between w-full px-4">
      <div className="relative w-[120px] h-[30px] sm:w-[140px] sm:h-[35px] lg:w-[160px] lg:h-[40px]">
        <Image
          src={usableImageUrl}
          alt="Logo"
          fill
          priority
          unoptimized // Added because dynamic backend images often require this
          className="object-contain"
          sizes="(max-width: 768px) 120px, (max-width: 1200px) 140px, 160px"
        />
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
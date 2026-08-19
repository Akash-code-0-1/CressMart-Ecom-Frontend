
// import { Trash2 } from "lucide-react";
// import { uploadSettingsMedia } from "@/services-api/settingsService";

// export const LogoUploadCard = ({ title, value, onChange }: any) => {
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       try {
//         const url = await uploadSettingsMedia(e.target.files[0]);
//         if (url) {
//           onChange(url); // This passes the clean string (e.g., "/uploads/settings/file.webp") to react-hook-form
//         }
//       } catch (error) {
//         console.error("Upload failed", error);
//       }
//     }
//   };

//   // Construct the absolute image URL
//   // We take the API base URL and remove '/api/v1' to get the root (http://localhost:8082)
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");
//   const fullImageUrl = value ? `${baseUrl}${value}` : "";

//   return (
//     <div className="flex flex-col gap-3 w-full font-poppins">
//       <div className="bg-white rounded-[8px] p-4 flex flex-col items-center border border-dashed border-[#BABABA]">
//         <span className="text-[12px] font-medium text-[#003032] mb-4">
//           {title}
//         </span>

//         {/* Real-time Preview */}
//         <div className="h-16 w-full flex items-center justify-center mb-4">
//           {value ? (
//             <img
//               src={fullImageUrl}
//               alt={title}
//               className="max-h-full object-contain"
//               onError={(e) => {
//                 console.error("Image failed to load:", fullImageUrl);
//                 (e.target as HTMLImageElement).style.display = "none";
//               }}
//             />
//           ) : (
//             <div className="text-gray-400 text-xs">No Image</div>
//           )}
//         </div>

//         <div className="flex gap-2 w-full">
//           <input
//             type="file"
//             id={title}
//             className="hidden"
//             onChange={handleFileChange}
//           />
//           <label
//             htmlFor={title}
//             className="flex-1 cursor-pointer text-center bg-[#F3FBFF] text-[#1DA1F2] text-[12px] font-medium py-2 rounded-[8px]"
//           >
//             Select Image
//           </label>
//           <button
//             type="button"
//             onClick={() => onChange("")}
//             className="p-2 bg-[#FFF1F1] text-[#FF4D4D] rounded-[8px]"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };



import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { uploadSettingsMedia } from "@/services-api/settingsService";

interface LogoUploadCardProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export const LogoUploadCard = ({ title, value, onChange }: LogoUploadCardProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        setIsUploading(true);
        const url = await uploadSettingsMedia(e.target.files[0]);
        if (url) {
          onChange(url); // Updates form state dynamically
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Image upload failed. Please check backend server logs.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Safely construct absolute image URL avoiding double-slash or missing slash issues
  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const cleanBaseUrl = rawBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBaseUrl}${cleanPath}`;
  };

  const fullImageUrl = getFullImageUrl(value);
  const inputId = title.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="flex flex-col gap-3 w-full font-poppins">
      <div className="bg-white rounded-[8px] p-4 flex flex-col items-center border border-dashed border-[#BABABA]">
        <span className="text-[12px] font-medium text-[#003032] mb-4">
          {title}
        </span>

        {/* Real-time Preview Area */}
        <div className="h-16 w-full flex items-center justify-center mb-4 overflow-hidden">
          {isUploading ? (
            <Loader2 className="animate-spin text-[#1DA1F2]" size={24} />
          ) : value ? (
            <img
              src={fullImageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                console.error("Image failed to load:", fullImageUrl);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="text-gray-400 text-xs">No Image</div>
          )}
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="file"
            id={inputId}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor={inputId}
            className={`flex-1 cursor-pointer text-center bg-[#F3FBFF] text-[#1DA1F2] text-[12px] font-medium py-2 rounded-[8px] transition-colors ${
              isUploading ? "opacity-50 pointer-events-none" : "hover:bg-[#e1f3ff]"
            }`}
          >
            {isUploading ? "Uploading..." : "Select Image"}
          </label>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 bg-[#FFF1F1] text-[#FF4D4D] rounded-[8px] hover:bg-[#ffe0e0] transition-colors"
            disabled={isUploading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
// components/settings/LogoUploadCard.tsx
import { Trash2 } from "lucide-react";

interface LogoProps {
  title: string;
  imgSrc: string;
}

export const LogoUploadCard = ({ title, imgSrc }: LogoProps) => (
  <div className="flex flex-col gap-3 w-full font-poppins">
    <div className="bg-white rounded-[8px] p-4 flex flex-col items-center border border-dashed border-[#BABABA]">
      <span className="text-[12px] font-medium text-[#003032] mb-4">
        {title}
      </span>
      <div className="h-16 w-full flex items-center justify-center mb-4">
        <img src={imgSrc} alt={title} className="max-h-full object-contain" />
      </div>
      <div className="flex gap-2 w-full">
        <button className="flex-1 bg-[#F3FBFF] text-[#1DA1F2] text-[12px] font-medium py-2 rounded-[8px] hover:bg-blue-100 transition-colors">
          Select Image
        </button>
        <button className="p-2 bg-[#FFF1F1] text-[#FF4D4D] rounded-[8px] hover:bg-red-100 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

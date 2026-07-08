"use client";

import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  Monitor,
  Smartphone,
  RotateCw,
  SquarePen,
} from "lucide-react";
import PrimaryButton from "../../common/PrimaryButton";
const bannerData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  image:
    i % 2 === 0
      ? "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=600&q=80"
      : "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=600&q=80",
  alt: i % 2 === 0 ? "Product Banner A" : "Product Banner B",
}));

const CarouselWithLivePreview = () => {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [siteUrl, setSiteUrl] = useState("https://creassmart.com/");

  return (
    <div className="w-full p-6 font-lato">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE: CAROUSEL MANAGEMENT (7 Columns) */}
        <div className="lg:col-span-7">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-[#003032] text-xl font-bold">Carousal</h1>
              <p className="text-[#777777] text-base mt-1 font-normal font-poppins">
                Select up to 8 carousal
              </p>
            </div>
            <PrimaryButton
              label="Upload Banners (8/8)"
              icon={<PlusCircle size={18} strokeWidth={2.5} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bannerData.map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <div className="aspect-[16/10] bg-white rounded-[8px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button className="cursor-pointer flex-1 bg-white text-[#131313] py-2.5 rounded-[8px] flex items-center justify-center gap-2 text-base font-medium font-poppins">
                    <SquarePen size={24} /> Edit
                  </button>
                  <button className="cursor-pointer bg-white text-[#000000] px-4 py-2.5 rounded-[8px]">
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW PANEL (5 Columns) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[#003032] text-xl font-bold">Preview</h2>
              <button
                onClick={() => window.location.reload()}
                className="text-gray-400 hover:text-[#1DA1F2]"
              >
                <RotateCw size={16} />
              </button>
            </div>

            {/* View Mode Toggles */}
            <div className="flex bg-white rounded-[8px] p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-2 rounded-[6px] transition-all ${viewMode === "desktop" ? "bg-[#1DA1F2] text-white" : "text-gray-400"}`}
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-2 rounded-[6px] transition-all ${viewMode === "mobile" ? "bg-[#1DA1F2] text-white" : "text-gray-400"}`}
              >
                <Smartphone size={20} />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex justify-center bg-gray-200/50 rounded-[8px] overflow-hidden min-h-[700px] relative">
            <div
              className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden ${
                viewMode === "desktop"
                  ? "w-full"
                  : "w-[375px] my-4 rounded-[30px] border-[8px] border-black"
              }`}
            >
              {/* The Live Iframe */}
              <iframe
                src={siteUrl}
                className="w-full h-full min-h-[700px] border-none"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            {/* Overlay to catch clicks if needed or for styling */}
            <div className="absolute inset-0 pointer-events-none rounded-[8px] border-2 border-transparent" />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 font-medium italic">
              * Live preview of: {siteUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselWithLivePreview;

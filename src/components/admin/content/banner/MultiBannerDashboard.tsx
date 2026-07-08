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

// --- Types & Data ---

interface BannerItem {
  id: number;
  image: string;
}

const topBanners: BannerItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&q=80",
  },
];

const sideBanners: BannerItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  image:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", // Portrait style
}));

const standardBanners: BannerItem[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  image:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
}));

// --- Reusable Sub-component for Sections ---

interface SectionProps {
  title: string;
  subtitle: string;
  countLabel: string;
  gridCols: string;
  aspectRatio: string;
  data: BannerItem[];
}

const BannerManagerSection = ({
  title,
  subtitle,
  countLabel,
  gridCols,
  aspectRatio,
  data,
}: SectionProps) => (
  <div className="mb-12">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-[#003032] text-xl font-bold font-lato">{title}</h2>
        <p className="text-[#777777] text-sm mt-1 font-normal font-poppins">
          {subtitle}
        </p>
      </div>
      <PrimaryButton
        label={`Upload Banners (${countLabel})`}
        icon={<PlusCircle size={18} strokeWidth={2.5} />}
      />
    </div>

    <div className={`grid gap-4 ${gridCols}`}>
      {data.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          {/* Banner Container */}
          <div
            className={`${aspectRatio} bg-white rounded-[8px] overflow-hidden`}
          >
            <img
              src={item.image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex-1 bg-white text-[#131313] py-2 rounded-[8px] flex items-center justify-center gap-2 text-sm font-medium font-poppins border-none outline-none cursor-pointer">
              <SquarePen size={18} /> Edit
            </button>
            <button className="bg-white text-black px-3 py-2 rounded-[8px] cursor-pointer">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Page Component ---

const MultiBannerDashboard = () => {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const siteUrl = "https://creassmart.com/";

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE: MULTIPLE BANNER SECTIONS (7 Columns) */}
        <div className="lg:col-span-7">
          {/* 1. Homepage Top Banners (2 Columns) */}
          <BannerManagerSection
            title="Homepage Top Banners"
            subtitle="Select up to 2 Banners"
            countLabel="2/2"
            gridCols="grid-cols-2"
            aspectRatio="aspect-video"
            data={topBanners}
          />

          {/* 2. Side Banners (5 Columns) */}
          <BannerManagerSection
            title="Side Banners"
            subtitle="Select up to 5 Banners"
            countLabel="5/5"
            gridCols="grid-cols-5"
            aspectRatio="aspect-[3/4]"
            data={sideBanners}
          />

          {/* 3. Standard Banners (3 Columns) */}
          <BannerManagerSection
            title="Banners"
            subtitle="Select up to 3 Banners"
            countLabel="3/3"
            gridCols="grid-cols-3"
            aspectRatio="aspect-square"
            data={standardBanners}
          />
        </div>

        {/* RIGHT SIDE: PREVIEW (5 Columns) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-[#003032] text-xl font-bold font-lato">
                Preview
              </h2>
              <button className="text-gray-400 hover:text-[#1DA1F2] cursor-pointer">
                <RotateCw size={18} />
              </button>
            </div>

            <div className="flex bg-white rounded-[8px] p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-2 rounded-[6px] transition-all cursor-pointer ${viewMode === "desktop" ? "bg-[#1DA1F2] text-white" : "text-gray-400"}`}
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-2 rounded-[6px] transition-all cursor-pointer ${viewMode === "mobile" ? "bg-[#1DA1F2] text-white" : "text-gray-400"}`}
              >
                <Smartphone size={20} />
              </button>
            </div>
          </div>

          {/* Live Website Iframe */}
          <div className="flex justify-center bg-gray-200/40 rounded-[8px] overflow-hidden min-h-[750px] relative">
            <div
              className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden ${
                viewMode === "desktop"
                  ? "w-full"
                  : "w-[375px] my-6 rounded-[32px] border-[10px] border-[#131313]"
              }`}
            >
              <iframe
                src={siteUrl}
                className="w-full h-full min-h-[750px] border-none"
                title="Live Preview"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 font-medium italic">
            * Live preview tracking: {siteUrl}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiBannerDashboard;

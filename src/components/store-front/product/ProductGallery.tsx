"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface MediaItem {
  type: "image" | "video";
  src: string;
  videoId?: string;
}

interface GalleryProps {
  items: MediaItem[];
}

export const ProductGallery: React.FC<GalleryProps> = ({ items }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  const openVideo = (videoId: string) => {
    setCurrentVideoId(videoId);
    setVideoOpen(true);
  };

  return (
    <div className="productgallery w-full max-w-6xl mx-auto font-poppins">
      {/* Main Grid Wrapper - Changed to block/grid structure to prevent Swiper from collapsing on mobile */}
      <div className="block md:flex gap-4 md:h-[600px]">
        {/* 1. Main Media Viewer */}
        <div className="w-full md:flex-1 h-[350px] sm:h-[450px] md:h-full rounded-2xl md:rounded-3xl bg-white overflow-hidden relative group border border-gray-100 mb-4 md:mb-0">
          <Swiper
            spaceBetween={10}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="w-full h-full"
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={index}
                className="w-full h-full flex items-center justify-center bg-gray-50"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.src}
                    alt="product image"
                    fill
                    priority
                    className="object-cover"
                  />
                  {item.type === "video" && (
                    <button
                      onClick={() => openVideo(item.videoId || "")}
                      className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-10"
                    >
                      <FaPlay className="text-[#FF7050] text-2xl sm:text-3xl ml-1" />
                    </button>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 2. Thumbnails */}
        <div className="w-full md:w-[120px] flex flex-col items-center gap-2">
          {/* Top Arrow (Desktop Only) */}
          <button className="thumb-prev cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9] hover:bg-gray-100 transition-colors flex-shrink-0">
            <MdOutlineKeyboardArrowUp size={28} color="#727272" />
          </button>

          <div className="w-full h-[85px] sm:h-[100px] md:h-full overflow-hidden min-w-0">
            <Swiper
              onSwiper={setThumbsSwiper}
              direction="horizontal"
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              navigation={{
                prevEl: ".thumb-prev",
                nextEl: ".thumb-next",
              }}
              breakpoints={{
                768: {
                  direction: "vertical",
                  slidesPerView: 4,
                },
              }}
              className="w-full h-full product-thumbs-slider"
            >
              {items.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="cursor-pointer rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative w-full h-full bg-gray-100">
                    <Image
                      src={item.src}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <FaPlay className="text-white text-[9px] sm:text-[10px] ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Bottom Arrow (Desktop Only) */}
          <button className="thumb-next cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9] hover:bg-gray-100 transition-colors flex-shrink-0">
            <MdOutlineKeyboardArrowDown size={28} color="#727272" />
          </button>
        </div>
      </div>

      {/* 3. Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-[#FF7050] transition-colors focus:outline-none"
            >
              <IoClose size={32} />
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
              title="Product Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Global Style Adjustments */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .product-thumbs-slider .swiper-slide {
            height: calc((600px - 116px) / 4) !important;
            width: 100% !important;
          }
        }
        .product-thumbs-slider .swiper-slide-thumb-active {
          border: 2px solid #ff7050 !important;
        }
      `}</style>
    </div>
  );
};

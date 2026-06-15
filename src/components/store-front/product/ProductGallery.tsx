"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
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
      {/* Main Container - Fixed Height 600px */}
      <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
        {/* 1. Main Media Viewer (Left Side) */}
        <div className="flex-1 w-full h-[400px] md:h-full rounded-3xl bg-white overflow-hidden relative group border border-gray-100">
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
                className="flex items-center justify-center bg-gray-50"
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
                      className="absolute inset-0 m-auto w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <FaPlay className="text-[#FF7050] text-3xl ml-1" />
                    </button>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 2. Vertical Thumbnails (Right Side) */}
        <div className="w-full md:w-[120px] flex flex-col items-center gap-2">
          {/* Top Arrow */}
          <button className="thumb-prev cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9]">
            <MdKeyboardArrowUp size={28} color="#727272" />
          </button>

          <Swiper
            onSwiper={setThumbsSwiper}
            direction="vertical"
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
              0: { direction: "horizontal", slidesPerView: 4 },
              768: { direction: "vertical", slidesPerView: 4 },
            }}
            className="w-full h-[100px] md:h-full product-thumbs-slider"
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={index}
                className="cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent transition-all transition-duration-300"
              >
                {() => (
                  <div
                    className={`relative w-full h-full bg-gray-100 rounded-2xl overflow-hidden`}
                  >
                    <Image
                      src={item.src}
                      alt="thumbnail"
                      fill
                      className={`object-cover`}
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <FaPlay className="text-white text-[10px] ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Bottom Arrow */}
          <button className="thumb-next cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9]">
            <MdKeyboardArrowDown size={28} color="#727272" />
          </button>
        </div>
      </div>

      {/* 3. Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#FF7050] transition-colors"
            >
              <IoClose size={35} />
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

      <style jsx global>{`
        .product-thumbs-slider .swiper-slide {
          height: calc(
            (600px - 110px) / 4
          ) !important; /* Adjusting for arrows and gaps */
        }
        @media (max-width: 768px) {
          .product-thumbs-slider .swiper-slide {
            height: 80px !important;
          }
        }
      `}</style>
    </div>
  );
};

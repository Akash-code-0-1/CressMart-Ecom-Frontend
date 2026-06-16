// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import type { Swiper as SwiperClass } from "swiper";
// import { FreeMode, Navigation, Thumbs } from "swiper/modules";
// import {
//   MdOutlineKeyboardArrowUp,
//   MdOutlineKeyboardArrowDown,
// } from "react-icons/md";
// import { FaPlay } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import "swiper/css";
// import "swiper/css/free-mode";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";

// interface MediaItem {
//   type: "image" | "video";
//   src: string;
//   videoId?: string;
// }

// interface GalleryProps {
//   items: MediaItem[];
// }

// export const ProductGallery: React.FC<GalleryProps> = ({ items }) => {
//   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
//   const [videoOpen, setVideoOpen] = useState(false);
//   const [currentVideoId, setCurrentVideoId] = useState("");

//   const openVideo = (videoId: string) => {
//     setCurrentVideoId(videoId);
//     setVideoOpen(true);
//   };

//   return (
//     <div className="productgallery w-full max-w-6xl mx-auto font-poppins">
//       <div className="block md:flex gap-4 md:h-[600px]">
//         <div className="w-full md:flex-1 h-[350px] sm:h-[450px] md:h-full rounded-2xl md:rounded-3xl bg-white overflow-hidden relative group border border-gray-100 mb-4 md:mb-0">
//           <Swiper
//             spaceBetween={10}
//             thumbs={{
//               swiper:
//                 thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
//             }}
//             modules={[FreeMode, Navigation, Thumbs]}
//             className="w-full h-full"
//           >
//             {items.map((item, index) => (
//               <SwiperSlide
//                 key={index}
//                 className="w-full h-full flex items-center justify-center bg-gray-50"
//               >
//                 <div className="relative w-full h-full">
//                   <Image
//                     src={item.src}
//                     alt="product image"
//                     fill
//                     priority
//                     className="object-cover"
//                   />
//                   {item.type === "video" && (
//                     <button
//                       onClick={() => openVideo(item.videoId || "")}
//                       className="cursor-pointer absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="50"
//                         height="50"
//                         viewBox="0 0 50 50"
//                         fill="none"
//                       >
//                         <path
//                           d="M44.6018 19.4854C45.6024 20.0175 46.4394 20.8118 47.023 21.7833C47.6067 22.7547 47.915 23.8667 47.915 25C47.915 26.1333 47.6067 27.2452 47.023 28.2167C46.4394 29.1881 45.6024 29.9825 44.6018 30.5146L17.9101 45.0292C13.6122 47.3687 8.33301 44.3271 8.33301 39.5167V10.4854C8.33301 5.67291 13.6122 2.63332 17.9101 4.96874L44.6018 19.4854Z"
//                           fill="white"
//                           fillOpacity="0.29"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* 2. Thumbnails */}
//         <div className="w-full md:w-[120px] flex flex-col items-center gap-2">
//           {/* Top Arrow (Desktop Only) */}
//           <button className="thumb-prev cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9] hover:bg-gray-100 transition-colors shrink-0">
//             <MdOutlineKeyboardArrowUp size={28} color="#727272" />
//           </button>

//           <div className="w-full h-[85px] sm:h-[100px] md:h-full overflow-hidden min-w-0">
//             <Swiper
//               onSwiper={setThumbsSwiper}
//               direction="horizontal"
//               spaceBetween={12}
//               slidesPerView={4}
//               freeMode={true}
//               watchSlidesProgress={true}
//               modules={[FreeMode, Navigation, Thumbs]}
//               navigation={{
//                 prevEl: ".thumb-prev",
//                 nextEl: ".thumb-next",
//               }}
//               breakpoints={{
//                 768: {
//                   direction: "vertical",
//                   slidesPerView: 4,
//                 },
//               }}
//               className="w-full h-full product-thumbs-slider"
//             >
//               {items.map((item, index) => (
//                 <SwiperSlide
//                   key={index}
//                   className="cursor-pointer rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300"
//                 >
//                   <div className="relative w-full h-full bg-gray-100">
//                     <Image
//                       src={item.src}
//                       alt="thumbnail"
//                       fill
//                       className="object-cover"
//                     />
//                     {item.type === "video" && (
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                         <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
//                           <FaPlay className="text-white text-[9px] sm:text-[10px] ml-0.5" />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* Bottom Arrow (Desktop Only) */}
//           <button className="thumb-next cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9] hover:bg-gray-100 transition-colors flex-shrink-0">
//             <MdOutlineKeyboardArrowDown size={28} color="#727272" />
//           </button>
//         </div>
//       </div>

//       {/* 3. Video Modal */}
//       {videoOpen && (
//         <div
//           className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4 sm:p-6"
//           onClick={() => setVideoOpen(false)}
//         >
//           <div
//             className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setVideoOpen(false)}
//               className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-[#FF7050] transition-colors focus:outline-none"
//             >
//               <IoClose size={32} />
//             </button>
//             <iframe
//               className="w-full h-full"
//               src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
//               title="Product Video"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       )}

//       {/* Global Style Adjustments */}
//       <style jsx global>{`
//         @media (min-width: 768px) {
//           .product-thumbs-slider .swiper-slide {
//             height: calc((600px - 116px) / 4) !important;
//             width: 100% !important;
//           }
//         }
//         .product-thumbs-slider .swiper-slide-thumb-active {
//           border: 2px solid #ff7050 !important;
//         }
//       `}</style>
//     </div>
//   );
// };

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
import PlayIcon from "../svg/PlayIcon";

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

  const openVideo = (videoUrlOrId: string) => {
    if (!videoUrlOrId) return;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrlOrId.match(regExp);

    const videoId = match && match[2].length === 11 ? match[2] : videoUrlOrId;

    setCurrentVideoId(videoId);
    setVideoOpen(true);
  };

  return (
    <div className="productgallery w-full max-w-6xl mx-auto font-poppins">
      <div className="block md:flex gap-4 md:h-[600px]">
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
                      className="cursor-pointer absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10 bg-transparent border border-white"
                    >
                      <PlayIcon />
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
          <button className="thumb-prev cursor-pointer hidden md:flex w-10 h-10 items-center justify-center rounded-[8px] bg-[#F9F9F9] hover:bg-gray-100 transition-colors shrink-0">
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
                        <div className="flex items-center justify-center">
                          <PlayIcon />
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

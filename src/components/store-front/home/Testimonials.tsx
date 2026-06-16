"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

const Testimonials = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const reviews = Array(6).fill({
    name: "Imam Hoshen Ornob",
    text: "This gadget is sleek, efficient, and user-friendly, making everyday tasks simpler and more enjoyable.",
    image: "/images/store-front/products/t1.png",
  });

  const youtubeVideos = [
    { id: "dQw4w9WgXcQ", thumbnail: "/images/store-front/products/t1.png" },
    { id: "3JZ_D3ELwOQ", thumbnail: "/images/store-front/products/t2.png" },
    { id: "kJQP7kiw5Fk", thumbnail: "/images/store-front/products/t3.png" },
    { id: "dQw4w9WgXcQ", thumbnail: "/images/store-front/products/t1.png" },
  ];

  const PlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
    >
      <path
        d="M44.6018 19.4854C45.6024 20.0175 46.4394 20.8118 47.023 21.7833C47.6067 22.7547 47.915 23.8667 47.915 25C47.915 26.1333 47.6067 27.2452 47.023 28.2167C46.4394 29.1881 45.6024 29.9825 44.6018 30.5146L17.9101 45.0292C13.6122 47.3687 8.33301 44.3271 8.33301 39.5167V10.4854C8.33301 5.67291 13.6122 2.63332 17.9101 4.96874L44.6018 19.4854Z"
        fill="white"
        fillOpacity="0.29"
        stroke="#CEB7B5"
      />
    </svg>
  );

  return (
    <section className="w-full py-10 md:py-20 px-4 md:px-6 lg:px-10 bg-white overflow-x-hidden">
      <div className="max-w-[1720px] mx-auto">
        <h2 className="text-black text-center font-poppins text-2xl md:text-[36px] font-semibold mb-8 md:mb-12">
          Customer Testimonial
        </h2>

        {/* Main Grid Container */}
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 items-stretch">
          {/* --- LEFT SIDE: FACEBOOK REVIEWS --- */}
          <div className="w-full xl:w-[50%] min-w-0 bg-[#F9F9F9] rounded-[24px] p-6 md:p-8 flex flex-col items-center">
            <h3 className="text-black font-poppins text-2xl md:text-[32px] font-semibold mb-8 md:mb-10">
              Facebook Reviews
            </h3>

            <div className="w-full">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 2 },
                  1500: { slidesPerView: 3 },
                }}
                className="testimonial-swiper pb-12"
              >
                {reviews.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="flex flex-col items-center">
                      <div className="bg-white md:min-h-[291px] rounded-[16px] p-6 md:p-8 relative min-h-[180px] flex items-center justify-center text-center">
                        <FaQuoteLeft className="absolute top-4 left-4 text-[#F2F2F2] text-4xl md:text-5xl" />
                        <p className="text-black text-start font-inter text-[14px] md:text-[16px] leading-relaxed relative z-10">
                          {item.text}
                        </p>
                      </div>

                      <div className="flex flex-col items-center mt-[-30px]">
                        <div className="relative w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden mb-3 border-10 border-[#F9F9F9]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 56px, 72px"
                            className="object-cover"
                          />
                        </div>
                        <h4 className="text-black font-poppins text-lg md:text-[20px] font-medium">
                          {item.name}
                        </h4>
                        <div className="flex gap-1 text-[#FF7050] mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={14} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* --- RIGHT SIDE: YOUTUBE REVIEWS (NOW A SLIDER) --- */}
          <div className="w-full xl:flex-1 min-w-0 bg-[#F9F9F9] rounded-[24px] p-6 md:p-8 flex flex-col items-center">
            <h3 className="text-black font-poppins text-2xl md:text-[32px] font-semibold mb-8 md:mb-10 text-center">
              Youtube Reviews
            </h3>

            <div className="w-full">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={15}
                slidesPerView={2}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 2 },
                  1500: { slidesPerView: 3 },
                }}
                className="testimonial-swiper pb-12"
              >
                {youtubeVideos.map((video, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      onClick={() =>
                        setVideoUrl(
                          `https://www.youtube.com/embed/${video.id}?autoplay=1`,
                        )
                      }
                      className="group relative aspect-[9/16] rounded-[16px] overflow-hidden cursor-pointer shadow-md"
                    >
                      <Image
                        src={video.thumbnail}
                        alt="Review"
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Black Overlay and Play Button on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <PlayIcon />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      {videoUrl && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setVideoUrl(null)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-[#FF7050] transition-colors"
          >
            <FiX />
          </button>
          <div className="w-full max-w-[1000px] aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;

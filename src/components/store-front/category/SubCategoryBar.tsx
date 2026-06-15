"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function SubCategoryBar() {
  const subs = [
    "Computer Accessories",
    "Power Bank",
    "Microphone",
    "Telephone",
    "Smart Watch",
    "Router & Internet",
    "Mobile Accessories",
    "Laptops",
    "Computer Accessories",
    "Power Bank",
    "Microphone",
    "Telephone",
    "Smart Watch",
    "Router & Internet",
    "Mobile Accessories",
    "Laptops",
  ];

  return (
    <div className="flex items-center w-full gap-4 mt-2">
      {/* Swiper Container */}
      <div className="grow overflow-hidden">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          loop={false}
          navigation={{
            nextEl: ".cat-next",
            prevEl: ".cat-prev",
          }}
          className="mySwiper"
        >
          {subs.map((item, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <button
                className="flex py-3 px-4 justify-center items-center gap-[10px] 
                           bg-[#F5F5F5] text-black font-poppins xl:text-2xl lg:text-xl md:text-lg text-sm 
                           font-medium leading-normal rounded-xl whitespace-nowrap"
              >
                {item}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Buttons using React Icons */}
      <div className="hidden items-center gap-2 shrink-0 md:flex">
        <button className="cursor-pointer cat-prev [&:not(.swiper-button-disabled)]:text-[#000000] [&.swiper-button-disabled]:text-[#848484] transition-colors">
          <MdChevronLeft className="text-4xl" />
        </button>
        <button className="cursor-pointer cat-next [&:not(.swiper-button-disabled)]:text-[#000000] [&.swiper-button-disabled]:text-[#848484] transition-colors">
          <MdChevronRight className="text-4xl" />
        </button>
      </div>
    </div>
  );
}

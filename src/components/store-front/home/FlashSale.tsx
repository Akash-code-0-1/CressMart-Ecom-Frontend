"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "05",
    hours: "42",
    minutes: "19",
    seconds: "54",
  });

  // Simulated countdown effect
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    return () => clearInterval(timer);
  }, []);

  const products = Array(6).fill({
    title: "Awei Y525 RGB Portable Bluetooth Speaker",
    price: 2050,
    oldPrice: 2290,
    stockLeft: 5,
    totalStock: 20,
    image: "/images/store-front/products/product3.png",
  });

  return (
    <section className="w-full md:pb-20 pb-10 px-4 md:px-10 bg-white overflow-hidden">
      <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-[35%] flex flex-col shrink-0">
          <h2 className="text-black font-poppins text-[32px] md:text-[56px] font-semibold leading-tight mb-3">
            Flash Sale
          </h2>
          <p className="text-[#8C8C8C] font-poppins text-[14px] md:text-[16px] font-normal leading-relaxed mb-6 md:mb-10 max-w-[566px]">
            Dont miss out on these amazing deals! Theyre available for a limited
            time only, so act fast and grab them before theyre gone!
          </p>

          {/* Countdown Timer Box */}
          <div className="bg-[#32CD32] rounded-[12px] p-3 md:p-4 flex items-center justify-center gap-3 md:gap-6 mb-6 md:mb-8 w-fit">
            {[
              timeLeft.days,
              timeLeft.hours,
              timeLeft.minutes,
              timeLeft.seconds,
            ].map((val, i) => (
              <React.Fragment key={i}>
                <span className="text-white font-poppins text-[22px] md:text-[40px] font-semibold">
                  {val}
                </span>
                {i < 3 && (
                  <span className="text-white font-poppins text-[24px] md:text-[40px] font-semibold opacity-80">
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <Link
            href="/flash-sale"
            className="flex items-center gap-4 text-[#FF7050] font-poppins text-[16px] md:text-[20px] font-semibold group hover:opacity-80 transition-all"
          >
            Go to Flash Sale Page
            <FiArrowRight className="text-xl md:text-2xl transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        {/* RIGHT SLIDER */}
        <div className="w-full lg:w-[65%] min-w-0">
          <div className="relative overflow-hidden sm:px-8 px-0">
            {/* Navigation Buttons */}
            <button className="cursor-pointer flash-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-xl hidden sm:flex items-center justify-center text-black text-2xl border border-gray-100 hover:bg-[#FF7050] hover:text-white transition-all disabled:opacity-0">
              <FiChevronLeft />
            </button>
            <button className="cursor-pointer flash-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-xl hidden sm:flex items-center justify-center text-black text-2xl border border-gray-100 hover:bg-[#FF7050] hover:text-white transition-all disabled:opacity-0">
              <FiChevronRight />
            </button>

            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1.2}
              navigation={{
                prevEl: ".flash-prev",
                nextEl: ".flash-next",
              }}
              breakpoints={{
                480: { slidesPerView: 1.5, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 25 },
                1280: { slidesPerView: 3, spaceBetween: 25 },
              }}
            >
              {products.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative min-h-[380px] sm:min-h-[447px] rounded-[24px] overflow-hidden p-4 sm:p-6 flex flex-col justify-end"
                    style={{
                      /* CHANGED: Initial gradient color to transparent to eliminate the edge artifact */
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.73) 100%)",
                    }}
                  >
                    {/* Product Image Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10 mb-28 sm:mb-20">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={260}
                        height={260}
                        className="object-contain max-h-[180px] sm:max-h-full"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 space-y-2 sm:space-y-3">
                      <h3 className="text-white font-poppins text-[16px] md:text-[24px] font-semibold leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[#32CD32] font-poppins text-[18px] sm:text-[24px] font-semibold">
                          BDT {item.price}
                        </span>
                        <span className="text-white font-poppins text-[13px] sm:text-[16px] font-semibold line-through">
                          BDT {item.oldPrice}
                        </span>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="pt-1 sm:pt-2">
                        <div className="flex justify-end mb-1">
                          <span className="text-white font-poppins text-[12px] sm:text-[14px]">
                            {item.stockLeft} left
                          </span>
                        </div>
                        <div className="w-full h-[5px] sm:h-[6px] bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{
                              width: `${(item.stockLeft / item.totalStock) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;

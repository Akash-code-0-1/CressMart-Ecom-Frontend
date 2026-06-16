'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import Image from "next/image";

const RecentlyViewed = () => {
  const products = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="w-full bg-white">
      {/* Main Container with 1720px max-width */}
      <div className="max-w-[1720px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-[32px] text-[20px] font-semibold text-black font-poppins">
            Recently viewed
          </h2>

          {/* Custom Navigation Arrows */}
          <div className="flex items-center gap-4">
            <button className="recentview-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed">
              <FaChevronLeft className="text-xl" />
            </button>
            <button className="recentview-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed">
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1.2}
          navigation={{
            prevEl: ".recentview-prev",
            nextEl: ".recentview-next",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
            1720: { slidesPerView: 5 },
          }}
          className="mySwiper"
        >
          {products.map((_, index) => (
            <SwiperSlide key={index}>
              {/* Product Card */}
              <div className="bg-[#F3F3F3] rounded-[16px] p-4 flex items-center gap-4 h-[130px]">
                {/* Product Image Box */}
                <div className="min-w-[100px] h-[100px] bg-white rounded-[12px] flex items-center justify-center p-2">
                  <Image
                    src="/images/store-front/products/product02.png"
                    alt="Smart Watch"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-black font-poppins text-[16px] font-medium leading-[1.2] mb-1.5">
                    Eclipse Smart Fitness Tracker
                  </h3>

                  <p className="text-[#FF7050] font-poppins text-[12px] font-bold mb-1">
                    BDT 1200
                  </p>

                  {/* Rating Section */}
                  <div className="flex items-center gap-1">
                    <div className="flex gap-[3px] text-[#FDCC0D]">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="text-[14px]"
                          color="#FDCC0D"
                        />
                      ))}
                    </div>
                    <span className="text-[#8C8C8C] text-[12px] font-medium font-poppins">
                      (12)
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../common/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BestSalesProducts = () => {
  const products = Array(8).fill({
    title: "H2O Mini USB Portable Air Humidifier",
    price: 590,
    oldPrice: 750,
    discount: "21% OFF",
    rating: 5.0,
    reviews: 7,
    image: "/images/store-front/products/product02.png",
    inStock: true,
  });

  return (
    <section className="w-full bg-white md:py-[80px] py-[40px] px-4 md:px-10 overflow-hidden">
      <div className="max-w-[1710px] mx-auto">
        {/* Header with Custom Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold leading-normal">
            Best Deals
          </h2>

          {/* Custom Navigation Arrows */}
          <div className="flex items-center gap-4">
            <button className="bestdeals-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed">
              <FaChevronLeft className="text-xl" />
            </button>
            <button className="bestdeals-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed">
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={12} /* Clean gap for mobile 2-column look */
          slidesPerView={2}  /* Changed from 1.2 to 2 for 2 items per row on mobile */
          navigation={{
            prevEl: ".bestdeals-prev",
            nextEl: ".bestdeals-next",
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 25 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1536: { slidesPerView: 5, spaceBetween: 35 },
          }}
          className="product-slider"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BestSalesProducts;
"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

interface BannerProps {
  bannerImages?: string[];
}

export default function BannerSlider({ bannerImages = [] }: BannerProps) {
  const defaultBanners = ["/images/store-front/banner/banner.png"];

  const displayImages = bannerImages.length > 0 ? bannerImages : defaultBanners;

  return (
    <section className="max-w-[1720px] mx-auto">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={displayImages.length > 1}
        autoplay={
          displayImages.length > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        speed={1000}
        className="w-full"
      >
        {displayImages.map((src, index) => (
          <SwiperSlide key={index} className="w-full">
            <div className="relative w-full aspect-[16/9] sm:aspect-[12/5] md:aspect-[3/1]">
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-stretch"
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

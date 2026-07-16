"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { getPublicBanners } from "@/services-api/bannerService";

export default function BannerSlider() {
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const {
    data: banners,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-banners"],
    queryFn: getPublicBanners,
    staleTime: 1000 * 60 * 10,
  });

  // Loading State / Placeholder
  if (isLoading) {
    return (
      <div className="w-full aspect-[16/9] sm:aspect-[12/5] md:aspect-[3/1] bg-gray-100 animate-pulse" />
    );
  }

  // Error State or Empty Data
  if (isError || !banners || banners.length === 0) {
    return (
      <section className="">
        <div className="relative w-full aspect-[16/9] sm:aspect-[12/5] md:aspect-[3/1]">
          <Image
            src="/images/store-front/banner/banner.png"
            alt="Default Banner"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={banners.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        className="w-full"
      >
        {banners.map((banner, index) => {
          const rawPath = banner.image_url?.[0] || "";
          const imageSrc = rawPath.startsWith("http")
            ? rawPath
            : `${backendBaseUrl}/${rawPath.replace(/^\/+/, "")}`;

          return (
            <SwiperSlide key={banner.id ?? index}>
              <Link
                href={banner.link_url || "#"}
                className={
                  banner.link_url ? "cursor-pointer" : "cursor-default"
                }
              >
                <div className="relative w-full aspect-[16/9] sm:aspect-[12/5] md:aspect-[3/1]">
                  <Image
                    src={imageSrc}
                    alt={banner.meta_title || "Promotion Banner"}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="md:object-cover object-fill"
                    unoptimized
                  />
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

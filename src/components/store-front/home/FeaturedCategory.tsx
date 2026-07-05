"use client";

import Image from "next/image";
import { SectionHeader } from "../common/SectionHeader";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Gadget & Tools",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Essentials",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Home & Kitchen",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Kids Zone",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Organic & Supplements",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Safety & Security",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Religious & Traditional",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Gift Item",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Travel Essentials",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Exclusive Collection",
    icon: "/images/store-front/products/headphon.png",
  },
];

export default function FeaturedCategory() {
  const router = useRouter();

  return (
    <section className="w-full pb-[40px] md:pb-[80px] px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto">
        <SectionHeader title="Featured Category" link="/category" />

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-2 sm:gap-x-3 md:gap-x-5 xl:gap-x-[35px] gap-y-3 md:gap-y-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => router.push("/category/demo")}
              className="
                flex flex-col md:flex-row
                items-center
                justify-center md:justify-start
                text-center md:text-left
                gap-2 md:gap-3 lg:gap-4
                p-2 md:p-3 lg:p-4
                bg-[#F2F2F2]
                rounded-[16px]
                cursor-pointer
                hover:shadow-sm
                transition-all
                group
              "
            >
              {/* Icon */}
              <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] md:w-[70px] md:h-[58px] xl:w-[80px] xl:h-[65px] 2xl:w-[100px] 2xl:h-[80px] bg-white rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden">
                <div className="relative w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[40px] md:h-[40px] xl:w-[48px] xl:h-[48px] 2xl:w-[56px] 2xl:h-[56px] grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    sizes="(max-width:768px) 28px, 56px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-black font-poppins text-[9px] sm:text-[10px] md:text-[15px] lg:text-[15px] xl:text-[17px] 2xl:text-[22px] font-medium leading-tight break-words">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
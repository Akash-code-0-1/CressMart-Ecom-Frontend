import Image from "next/image";
import { SectionHeader } from "../common/SectionHeader";

const categories = [
  {
    name: "Gadget & Tools",
    icon: "/images/store-front/products/headphon.png",
  },
  {
    name: "Essentials",
    icon: "/images/store-front/products/headphon.png",
  },
  { name: "Home & Kitchen", icon: "/images/store-front/products/headphon.png" },
  { name: "Kids Zone", icon: "/images/store-front/products/headphon.png" },
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
  { name: "Gift Item", icon: "/images/store-front/products/headphon.png" },
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
  return (
    <section className="w-full pb-[40px] md:pb-[80px] px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto">
        <SectionHeader title="Featured Category" link="/categories" />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-[20px] xl:gap-x-[35px] gap-y-[16px] md:gap-y-[24px]">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-[12px] lg:gap-[16px] p-3 lg:p-4 bg-[#F2F2F2] rounded-[16px] cursor-pointer hover:shadow-sm transition-shadow group"
            >
              {/* Icon container */}
              <div className="w-[60px] h-[50px] md:w-[70px] md:h-[58px] xl:w-[80px] xl:h-[65px] 2xl:w-[100px] 2xl:h-[80px] bg-white rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden">
                <div className="relative w-[36px] h-[36px] md:w-[40px] md:h-[40px] xl:w-[48px] xl:h-[48px] 2xl:w-[56px] 2xl:h-[56px] grayscale group-hover:grayscale-0 transition-all">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-black font-poppins text-[15px] md:text-[16px] lg:text-[15px] xl:text-[17px] 2xl:text-[22px] font-medium leading-tight">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

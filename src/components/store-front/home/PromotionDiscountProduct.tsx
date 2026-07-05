import React from "react";
import Image from "next/image";

const PromotionDiscountProduct = () => {
  const promoData = [
    {
      title: "PlayStation 5",
      offer: "MIN 25% OFF",
      image: "/images/store-front/products/promotionproduct.png",
    },
    {
      title: "Nike, Adidas",
      offer: "MIN 40% OFF",
      image: "/images/store-front/products/promotionproduct.png",
    },
    {
      title: "PlayStation 5",
      offer: "MIN 25% OFF",
      image: "/images/store-front/products/promotionproduct.png",
    },
  ];

  return (
    <section className="w-full bg-white pb-[40px] md:pb-[80px] px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto">
        <div className="flex gap-3 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-[35px]">
          {promoData.map((item, index) => (
            <div
              key={index}
              className="
                flex-1
                flex flex-col items-center justify-center
                bg-[#FAFAFA]
                border border-[#E3E3E3]
                rounded-[18px] md:rounded-[28px] lg:rounded-[36px] 2xl:rounded-[51px]
                py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10
                px-2 sm:px-3 md:px-5 lg:px-6 xl:px-10 2xl:px-[118px]
                transition-transform duration-300 hover:shadow-md
                h-auto lg:h-[320px] xl:h-[360px] 2xl:h-[413px]
              "
            >
              {/* Title */}
              <div className="text-center">
                <h2 className="font-poppins text-[12px] sm:text-[16px] md:text-[22px] lg:text-[28px] xl:text-[34px] 2xl:text-[44px] font-medium text-black leading-tight">
                  {item.title}
                </h2>

                <p className="mt-1 font-poppins text-[8px] sm:text-[10px] md:text-[13px] lg:text-[16px] xl:text-[20px] 2xl:text-[26px] font-normal text-black uppercase">
                  {item.offer}
                </p>
              </div>

              {/* Image */}
              <div className="relative flex items-center justify-center my-3 md:my-5 w-full h-[55px] sm:h-[75px] md:h-[100px] lg:h-[120px] xl:h-[150px] 2xl:h-[180px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={180}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Button */}
              <button
                className="
                  cursor-pointer
                  bg-[#FF7050]
                  text-white
                  rounded-full
                  font-inter
                  font-medium
                  transition-all
                  hover:bg-[#e66345]
                  active:scale-95
                  text-[8px]
                  sm:text-[10px]
                  md:text-[13px]
                  lg:text-[15px]
                  xl:text-[17px]
                  2xl:text-[20px]
                  px-3
                  sm:px-4
                  md:px-5
                  lg:px-6
                  xl:px-7
                  2xl:px-8
                  py-1.5
                  sm:py-2
                  md:py-2.5
                  lg:py-3
                "
              >
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionDiscountProduct;
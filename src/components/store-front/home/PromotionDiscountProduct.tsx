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
        {/* Row with 35px gap as requested */}
        <div className="flex flex-wrap justify-center gap-[35px]">
          {promoData.map((item, index) => (
            <div
              key={index}
              className="
                flex flex-col shrink-0 items-center justify-center
                w-full max-w-[550px] h-auto md:h-[413px]
                py-10 md:py-[10px] px-6 md:px-[118px]
                bg-[#FAFAFA] border border-[#E3E3E3] rounded-[51px]
                transition-transform duration-300 hover:shadow-md
              "
            >
              {/* Title Section */}
              <div className="text-center space-y-1">
                <h2 className="font-poppins text-[28px] md:text-[44px] font-medium text-black leading-tight">
                  {item.title}
                </h2>
                <p className="font-poppins text-[16px] md:text-[26.457px] font-normal text-black uppercase">
                  {item.offer}
                </p>
              </div>

              {/* Image Container */}
              <div className="relative w-full h-[150px] md:h-[180px] my-4 flex justify-center items-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={180}
                  className="object-contain"
                />
              </div>

              {/* Shop Now Button */}
              <button
                className=" cursor-pointer
                  bg-[#FF7050] text-white px-8 py-3 
                  rounded-[44.75px] font-inter text-[16px] md:text-[20px]
                  font-medium transition-all hover:bg-[#e66345] active:scale-95
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

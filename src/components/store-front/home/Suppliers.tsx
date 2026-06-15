"use client";
import Image from "next/image";
import { SectionHeader } from "../common/SectionHeader";

const Suppliers = () => {
  const suppliers = [
    { name: "Mohasagor", logo: "/images/store-front/brand/supplyer.png" },
    { name: "SHP Bazar", logo: "/images/store-front/brand/s2.png" },
    { name: "EasyDrop Asea", logo: "/images/store-front/brand/s3.png" },
    { name: "Komdamer Bazar", logo: "/images/store-front/brand/s5.png" },
    { name: "Bongo mart", logo: "/images/store-front/brand/s6.png" },
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-10 bg-white">
      <div className="max-w-[1720px] mx-auto">
        {/* Reusable Header */}
        <SectionHeader title="Suppliers" link="/suppliers" />

        {/* Suppliers Grid - Changed from grid-cols-1 to grid-cols-2 for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-[30px] mt-6 md:mt-8">
          {suppliers.map((item, index) => (
            <div
              key={index}
              style={{ aspectRatio: "78 / 97" }}
              className="flex flex-col items-center gap-3 sm:gap-[17px] p-2.5 pb-5 sm:p-[12px_12px_32px_12px] rounded-[16px] bg-[#F2F2F2] w-full transition-transform hover:translate-y-[-5px] duration-300"
            >
              {/* Middle Image Box - Optimized mobile padding */}
              <div className="flex flex-col justify-center items-center w-full h-full max-w-[292px] max-h-[296px] p-3 sm:p-[25px_23px] bg-white rounded-[12px]">
                <div className="relative w-full h-full">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Supplier Title - Scaled text for phone screens */}
              <h3 className="text-black text-center font-poppins text-sm sm:text-base md:text-[20px] lg:text-[24px] font-semibold leading-normal px-1 truncate w-full">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Suppliers;

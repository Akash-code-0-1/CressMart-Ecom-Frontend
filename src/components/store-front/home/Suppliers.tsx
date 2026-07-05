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
        <SectionHeader title="Suppliers" link="/suppliers" />

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-[30px] mt-6 md:mt-8">
          {suppliers.map((item, index) => (
            <div
              key={index}
              style={{ aspectRatio: "78 / 97" }}
              className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-[17px] p-2 sm:p-3 lg:p-[12px_12px_32px_12px] rounded-[12px] lg:rounded-[16px] bg-[#F2F2F2] w-full transition-transform hover:translate-y-[-5px] duration-300"
            >
              {/* Logo */}
              <div className="flex flex-col justify-center items-center w-full h-full p-2 sm:p-3 lg:p-[25px_23px] bg-white rounded-[10px] lg:rounded-[12px]">
                <div className="relative w-full h-full min-h-[60px] sm:min-h-[90px] lg:min-h-[150px]">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    sizes="(max-width:768px) 33vw, (max-width:1024px) 33vw, 20vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-black text-center font-poppins text-[10px] sm:text-sm md:text-[18px] lg:text-[24px] font-semibold leading-tight px-1 line-clamp-2">
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
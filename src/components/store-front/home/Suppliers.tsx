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
    <section className="w-full py-16 px-4 md:px-10 bg-white">
      <div className="max-w-[1720px] mx-auto">
        {/* Reusable Header */}
        <SectionHeader title="Suppliers" link="/suppliers" />

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[30px] mt-8">
          {suppliers.map((item, index) => (
            <div
              key={index}
              style={{ aspectRatio: "78 / 97" }}
              className="flex flex-col items-center gap-[17px] p-[12px_12px_32px_12px] rounded-[16px] bg-[#F2F2F2] w-full transition-transform hover:translate-y-[-5px] duration-300"
            >
              {/* Middle Image Box */}
              <div className="flex flex-col justify-center items-center w-full h-full max-w-[292px] max-h-[296px] p-[25px_23px] bg-white rounded-[12px]">
                <div className="relative w-full h-full">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Supplier Title */}
              <h3 className="text-black text-center font-poppins text-[20px] lg:text-[24px] font-semibold leading-normal">
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

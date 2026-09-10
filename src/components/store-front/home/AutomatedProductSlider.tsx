// "use client";

// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "../common/ProductCard";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// interface Props {
//   title: string;
//   products: any[];
//   id: string; // unique ID for swiper navigation
// }

// const AutomatedProductSlider = ({ title, products, id }: Props) => {
//   const [isClient, setIsClient] = useState(false);

//   // Prevent hydration mismatch for Swiper
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!products || products.length === 0 || !isClient) {
//     return null;
//   }

//   return (
//     <section className="w-full bg-[#F9F9F9] py-8 px-4 md:px-10 overflow-hidden">
//       <div className="max-w-[1710px] mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold leading-normal">
//             {title}
//           </h2>

//           <div className="flex items-center gap-4">
//             {/* Unique classes based on ID to avoid multiple sliders moving at once */}
//             <button className={`${id}-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}>
//               <FaChevronLeft className="text-xl" />
//             </button>
//             <button className={`${id}-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}>
//               <FaChevronRight className="text-xl" />
//             </button>
//           </div>
//         </div>

//         <Swiper
//           modules={[Navigation]}
//           spaceBetween={12}
//           slidesPerView={2}
//           navigation={{
//             prevEl: `.${id}-prev`,
//             nextEl: `.${id}-next`,
//           }}
//           breakpoints={{
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             1024: { slidesPerView: 3, spaceBetween: 25 },
//             1280: { slidesPerView: 4, spaceBetween: 30 },
//             1536: { slidesPerView: 5, spaceBetween: 35 },
//           }}
//           className="product-slider"
//         >
//           {products.map((product) => (
//             <SwiperSlide key={product.id}>
//               {/* ProductCard receives formatted data directly */}
//               <ProductCard product={product} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default AutomatedProductSlider;




"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../common/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { translations } from "@/locales";

interface Props {
  title: string; // This acts as a fallback
  products: any[];
  id: string; // unique ID for swiper navigation
}

const AutomatedProductSlider = ({ title, products, id }: Props) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch for Swiper
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!products || products.length === 0 || !isClient) {
    return null;
  }

  // 1. Dynamic Title based on ID and Language
  const getTranslatedTitle = () => {
    switch (id) {
      case "new-arrival":
        return t.home.newArrivals;
      case "best-deals":
        return t.home.bestDeals;
      case "weekly-best":
        return t.home.weeklyBestSellers;
      default:
        return title; // Fallback to prop if id doesn't match
    }
  };

  // 2. Determine Link
  const getViewAllLink = () => {
    switch (id) {
      case "new-arrival":
        return "/shop?sort=newest";
      case "best-deals":
        return "/shop?sort=price_low";
      case "weekly-best":
        return "/shop?sort=popularity";
      default:
        return "/shop";
    }
  };

  return (
    <section className="w-full bg-[#F9F9F9] py-8 px-4 md:px-10 overflow-hidden">
      <div className="max-w-[1710px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Translated Title */}
            <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold leading-normal">
              {getTranslatedTitle()}
            </h2>
            
            {/* Translated View All Link */}
            {/* <Link 
              href={getViewAllLink()} 
              className="text-[#3b82f6] hover:text-blue-700 font-medium text-sm md:text-lg transition-colors underline-offset-4 hover:underline"
            >
              {t.home.viewAll}
            </Link> */}
          </div>

          <div className="flex items-center gap-4">
            <button className={`${id}-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}>
              <FaChevronLeft className="text-xl" />
            </button>
            <button className={`${id}-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}>
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{
            prevEl: `.${id}-prev`,
            nextEl: `.${id}-next`,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 25 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1536: { slidesPerView: 5, spaceBetween: 35 },
          }}
          className="product-slider"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AutomatedProductSlider;


// "use client";

// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "../common/ProductCard";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useLanguage } from "@/providers/LanguageProvider";
// import { translations } from "@/locales";

// interface Props {
//   title: string;
//   products: any[];
//   id: string;
// }

// const AutomatedProductSlider = ({ title, products, id }: Props) => {
//   const { language } = useLanguage();
//   const t = translations[language];
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => { setIsClient(true); }, []);

//   if (!products || products.length === 0 || !isClient) return null;

// const formattedProducts = products.map((p) => ({
//   ...p,
//   // ProductCard needs these specific keys
//   sell_price: p.price?.toString() || "0",
//   regular_price: p.old_price?.toString() || "0",
//   // THIS IS WHY IMAGES WERE MISSING: ProductCard expects [{url: '...'}]
//   images: p.image 
//     ? [{ url: p.image.startsWith('http') ? p.image : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}/${p.image.replace(/^\/+/, '')}` }] 
//     : [{ url: "/images/placeholder.svg" }],
//   avg_rating: Number(p.rating) || 0,
//   total_reviews: p.review_count || 0,
//   quantity: p.quantity_left || 0,
// }));

//   const getTranslatedTitle = () => {
//     switch (id) {
//       case "new-arrival": return t.home.newArrivals;
//       case "best-deals": return t.home.bestDeals;
//       case "weekly-best": return t.home.weeklyBestSellers;
//       default: return title;
//     }
//   };

//   return (
//     <section className="w-full bg-[#F9F9F9] py-8 px-4 md:px-10 overflow-hidden">
//       <div className="max-w-[1710px] mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold">{getTranslatedTitle()}</h2>
//           <div className="flex items-center gap-4">
//             <button className={`${id}-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white`}><FaChevronLeft className="text-xl" /></button>
//             <button className={`${id}-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white`}><FaChevronRight className="text-xl" /></button>
//           </div>
//         </div>

//         <Swiper
//           modules={[Navigation]}
//           spaceBetween={20}
//           slidesPerView={2}
//           navigation={{ prevEl: `.${id}-prev`, nextEl: `.${id}-next` }}
//           breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 }, 1536: { slidesPerView: 5 } }}
//         >
//           {formattedProducts.map((product) => (
//             <SwiperSlide key={product.id}>
//               <ProductCard product={product} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default AutomatedProductSlider;
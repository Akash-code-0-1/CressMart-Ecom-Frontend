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
//  const { language } = useLanguage();
//   const t = translations[language];
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // DEBUG LOGS
//   useEffect(() => {
//     // console.log(`DEBUG: Slider ${id} products received:`, products);
//     // console.log(`DEBUG: Slider ${id} isClient:`, isClient);
//   }, [products, isClient, id]);

//   // If this returns null, one of these conditions is true
//   if (!isClient) return null;
//   if (!Array.isArray(products)) {
//     // console.warn(`DEBUG: Slider ${id} products is NOT an array!`);
//     return null;
//   }
//   if (products.length === 0) {
//     // console.warn(`DEBUG: Slider ${id} products array is empty.`);
//     return null;
//   }
//   // 1. Dynamic Title based on ID and Language
//   const getTranslatedTitle = () => {
//     switch (id) {
//       case "new-arrival":
//         return t.home.newArrivals;
//       case "best-deals":
//         return t.home.bestDeals;
//       case "weekly-best":
//         return t.home.weeklyBestSellers;
//       default:
//         return title;
//     }
//   };

//   return (
//     <section className="w-full bg-[#F9F9F9] py-8 px-4 md:px-10 overflow-hidden">
//       <div className="max-w-[1710px] mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4 md:gap-6">
//             <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold leading-normal">
//               {getTranslatedTitle()}
//             </h2>
//           </div>

//           <div className="flex items-center gap-4">
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
//             <SwiperSlide key={product.id || Math.random()}>
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
import { useLanguage } from "@/providers/LanguageProvider";
import { translations } from "@/locales";

interface Props {
  title: string;
  products: any[];
  id: string;
}

const AutomatedProductSlider = ({ title, products, id }: Props) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Defensive check: only render if products is a valid array
  if (!isClient) return null;
  if (!Array.isArray(products) || products.length === 0) return null;

  const normalizedProducts = products.map((p) => {
    let imageUrl = "/images/placeholder.svg";

    // Check multiple possible sources for the image
    const rawImage = p.image || (Array.isArray(p.images) ? p.images[0] : null);

    if (typeof rawImage === "string") {
      imageUrl = rawImage;
    } else if (rawImage && typeof rawImage === "object" && "url" in rawImage) {
      imageUrl = (rawImage as any).url;
    }

    return {
      ...p,
      images: [{ url: imageUrl }], // Standardized format for the Card
      sell_price: p.sell_price || p.price || 0,
      regular_price: p.regular_price || p.old_price || 0,
      quantity: p.quantity ?? p.quantity_left ?? 0,
      avg_rating: p.avg_rating || p.rating || 0,
    };
  });

  const getTranslatedTitle = () => {
    switch (id) {
      case "new-arrival":
        return t.home.newArrivals;
      case "best-deals":
        return t.home.bestDeals;
      case "weekly-best":
        return t.home.weeklyBestSellers;
      default:
        return title;
    }
  };

  return (
    <section className="w-full bg-[#F9F9F9] py-8 px-4 md:px-10 overflow-hidden">
      <div className="max-w-[1710px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 md:gap-6">
            <h2 className="text-black font-poppins text-[24px] md:text-[32px] font-semibold leading-normal">
              {getTranslatedTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              className={`${id}-prev cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              className={`${id}-next cursor-pointer w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white text-black transition-colors duration-200 [&.swiper-button-disabled]:border-[#E2E2E2] [&.swiper-button-disabled]:text-[#E2E2E2] [&.swiper-button-disabled]:cursor-not-allowed`}
            >
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
          {normalizedProducts.map((product) => (
            <SwiperSlide key={product.id || Math.random()}>
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

//   // Transform backend product to match ProductCard expectation
//   const formattedProducts = products.map((p) => ({
//     ...p,
//     // Use the values directly from the API
//     sell_price: p.sell_price?.toString() || "0",
//     regular_price: p.regular_price?.toString() || "0",
//     // Ensure images exist. If not, use placeholder.
//     images: Array.isArray(p.images) && p.images.length > 0
//       ? p.images
//       : [{ url: "/images/placeholder.svg" }],
//     avg_rating: Number(p.avg_rating) || 0,
//     total_reviews: p.total_reviews || 0,
//     quantity: p.quantity || 0,
//     // Add logic to show stock status based on quantity
//     stock_status: p.quantity > 0 ? "In Stock" : "Out of Stock"
//   }));

//   const getTranslatedTitle = () => {
//     switch (id) {
//       case "new-arrival": return t.home.newArrivals;
//       case "best-deals": return t.home.bestDeals;
//       case "weekly-best": return t.home.weeklyBestSellers;
//       default: return title;
//     }
//   };

//   console.log("Raw product data from API:", products[0]);

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
//           spaceBetween={12}
//           slidesPerView={2}
//           navigation={{ prevEl: `.${id}-prev`, nextEl: `.${id}-next` }}
//           breakpoints={{
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             1024: { slidesPerView: 3, spaceBetween: 25 },
//             1280: { slidesPerView: 4, spaceBetween: 30 },
//             1536: { slidesPerView: 5, spaceBetween: 35 },
//           }}
//           className="product-slider"
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

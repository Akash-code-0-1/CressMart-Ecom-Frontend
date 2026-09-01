// "use client";

// import Image from "next/image";
// import { SectionHeader } from "../common/SectionHeader";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { Category, getFeaturedCategory } from "@/services-api/categoryService";
// import { useLanguage } from "@/providers/LanguageProvider";
// import { translations } from "@/locales";
// import { extractImageUrl } from "@/utils/image";

// export default function FeaturedCategory() {
//   const router = useRouter();
//   const { data: categories = [] as Category[], isLoading } = useQuery<
//     Category[]
//   >({
//     queryKey: ["categories-tree"],
//     queryFn: getFeaturedCategory,
//     staleTime: 1000 * 60 * 30,
//   });

//   const { language } = useLanguage();
//   const t = translations[language];

//   return (
//     <section className="w-full pb-[40px] md:pb-[80px] px-4 md:px-10">
//       <div className="max-w-[1720px] mx-auto">
//         <SectionHeader title={t.featuredCategory} link="/category" />

//         <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-2 sm:gap-x-3 md:gap-x-5 xl:gap-x-[35px] gap-y-3 md:gap-y-6">
//           {isLoading
//             ? Array.from({ length: 10 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-[80px] md:h-[120px] bg-gray-100 animate-pulse rounded-[16px]"
//                 />
//               ))
//             : categories.slice(0, 8).map((category) => {
//                 const iconUrl =
//                   extractImageUrl(category?.image_url) ||
//                   "/images/placeholder.svg";

//                 return (
//                   <div
//                     key={category.id}
//                     onClick={() => router.push(`/category/${category.slug}`)}
//                     className="
//                     flex flex-col md:flex-row
//                     items-center
//                     justify-center md:justify-start
//                     text-center md:text-left
//                     gap-2 md:gap-3 lg:gap-4
//                     p-2 md:p-3 lg:p-4
//                     bg-[#F2F2F2]
//                     rounded-[16px]
//                     cursor-pointer
//                     hover:shadow-md
//                     hover:bg-[#EAEAEA]
//                     transition-all
//                     group
//                   "
//                   >
//                     {/* Icon Container */}
//                     <div className="relative w-[110px] h-[65px] shrink-0">
//                       <Image
//                         src={iconUrl}
//                         alt={category.name || "Category"}
//                         fill
//                         className="object-cover rounded-[8px]"
//                         unoptimized
//                       />
//                     </div>
//                     {/* Category Name */}
//                     <h3 className="text-black font-poppins text-[9px] sm:text-[10px] md:text-[15px] lg:text-[15px] xl:text-[17px] 2xl:text-[22px] font-medium leading-tight break-words">
//                       {category.name}
//                     </h3>
//                   </div>
//                 );
//               })}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import { SectionHeader } from "../common/SectionHeader";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Category, getFeaturedCategory } from "@/services-api/categoryService";
import { useLanguage } from "@/providers/LanguageProvider";
import { translations } from "@/locales";
import { extractImageUrl } from "@/utils/image";

export default function FeaturedCategory() {
  const router = useRouter();
  const { data: categories = [] as Category[], isLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories-tree"],
    queryFn: getFeaturedCategory,
    staleTime: 1000 * 60 * 30,
  });

  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="w-full pb-[40px] md:pb-[80px] px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto">
        <SectionHeader title={t.featuredCategory} link="/category" />
        <div className="grid grid-cols-4 gap-3 md:gap-5 xl:gap-[25px]">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[80px] md:h-[110px] bg-gray-100 animate-pulse rounded-[16px]"
                />
              ))
            : categories.slice(0, 8).map((category) => {
                const iconUrl =
                  extractImageUrl(category?.image_url) ||
                  "/images/placeholder.svg";

                return (
                  <div
                    key={category.id}
                    onClick={() => router.push(`/category/${category.slug}`)}
                    className="
                    flex items-center md:flex-row flex-col text-center md:text-left
                    gap-2 md:gap-4
                    p-2 md:p-4
                    bg-[#F2F2F2]
                    rounded-[12px] md:rounded-[16px]
                    cursor-pointer
                    hover:shadow-md
                    hover:bg-[#EAEAEA]
                    transition-all
                    group
                    min-h-[70px] md:min-h-[100px]
                    overflow-hidden
                  "
                  >
                    {/* Icon Container - Fixed size to prevent breaking */}
                    <div className="relative w-[50px] h-[50px] md:w-[128] md:h-[84px] shrink-0">
                      <Image
                        src={iconUrl}
                        alt={category.name || "Category"}
                        fill
                        className="object-cover rounded-[8px]"
                        unoptimized
                      />
                    </div>

                    {/* Category Name - Line clamp ensures text doesn't overflow */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-black font-poppins text-[12px] md:text-[16px] xl:text-[18px] font-medium leading-tight line-clamp-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

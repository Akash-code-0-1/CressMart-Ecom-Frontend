// "use client";

// import React from "react";
// import { Star, Sparkles, Play } from "lucide-react";

// // ==========================================
// // 1. TYPES & INTERFACES
// // ==========================================
// export interface OfferItem {
//   icon?: string;
//   title?: string;
//   subTitle?: string;
// }

// export interface FeatureItem {
//   icon?: string;
//   title?: string;
//   subTitle?: string;
// }

// export interface ReviewItem {
//   name?: string;
//   quote?: string;
//   image?: string;
// }

// export interface FAQItem {
//   question?: string;
//   answer?: string;
// }

// export interface LandingPageData {
//   title?: string;
//   headline?: string;
//   subHeadline?: string;
//   topImage?: string;
//   backgroundColor?: string;
//   textColor?: string;
//   buttonColor?: string;
//   videoLink?: string;
//   productId?: string;
//   productImages?: string[];
//   offers?: OfferItem[];
//   features?: FeatureItem[];
//   reviews?: ReviewItem[];
//   faqs?: FAQItem[];
//   product?: {
//     id?: string;
//     name?: string;
//     sell_price?: number | string;
//     regular_price?: number | string;
//     price?: number | string;
//     originalPrice?: number | string;
//     short_description?: string;
//     description?: string;
//     avg_rating?: number | string;
//     rating?: number | string;
//     total_reviews?: number | string;
//     images?: string[];
//   };
// }

// interface LandingPageRendererProps {
//   liveData: LandingPageData;
//   productList?: any[];
// }

// // ==========================================
// // 2. HELPER UTILITIES
// // ==========================================
// export const getImageUrl = (path?: string | null): string | null => {
//   if (!path || path.trim() === "") return null;
//   if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
//     return path;
//   }

//   const rawApiUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://localhost:8082/api/v1";

//   const baseUrl = rawApiUrl.replace(/\/api(\/v1)?\/?$/, "");
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return `${baseUrl}${cleanPath}`;
// };

// export const getYoutubeThumbnail = (url?: string | null): string | null => {
//   if (!url) return null;
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   if (match && match[2].length === 11) {
//     return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
//   }
//   return null;
// };

// // Helper for parsing JSON safely
// const parseJsonArray = <T,>(data: any): T[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   if (typeof data === "string") {
//     try {
//       return JSON.parse(data);
//     } catch {
//       return [];
//     }
//   }
//   return [];
// };

// // ==========================================
// // 3. MAIN COMPONENT
// // ==========================================
// export default function LandingPageRenderer({
//   liveData,
//   productList = [],
// }: LandingPageRendererProps) {
//   // Parse data collections safely
//   const offers = parseJsonArray<OfferItem>(liveData.offers);
//   const features = parseJsonArray<FeatureItem>(liveData.features);
//   const productImages = parseJsonArray<string>(liveData.productImages);
//   const reviews = parseJsonArray<ReviewItem>(liveData.reviews);
//   const faqs = parseJsonArray<FAQItem>(liveData.faqs);

//   const selectedProduct =
//     liveData.product ||
//     (Array.isArray(productList)
//       ? productList.find((p: any) => p.id === liveData.productId)
//       : null);

//   return (
//     <div
//       className="w-full flex flex-col transition-all min-h-screen"
//       style={{
//         backgroundColor: liveData.backgroundColor || "#ffffff",
//         color: liveData.textColor || "#111827",
//       }}
//     >
//       {/* 🚀 1. HERO SECTION */}
//       <div className="px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto w-full">
//         {/* Left Side Content Container */}
//         <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
//           <h1
//             className="text-3xl md:text-5xl font-black tracking-tight leading-tight md:leading-[1.15]"
//             style={{ color: liveData.textColor || "#0f172a" }}
//           >
//             {liveData.headline ? (
//               liveData.headline.endsWith(".") ? (
//                 liveData.headline
//               ) : (
//                 `${liveData.headline}.`
//               )
//             ) : (
//               <>
//                 Pre Workout
//                 <br />
//                 Supplements.
//               </>
//             )}
//           </h1>

//           <p className="text-sm md:text-base text-zinc-600 font-medium leading-relaxed max-w-lg">
//             {liveData.subHeadline ||
//               "Write here about your product short description."}
//           </p>

//           <div className="pt-2">
//             <button
//               style={{
//                 backgroundColor: liveData.buttonColor || "#38bdf8",
//                 boxShadow: `0 10px 25px -5px ${liveData.buttonColor || "#38bdf8"}80`,
//               }}
//               className="px-8 py-3.5 rounded-full text-white font-extrabold text-xs md:text-sm uppercase tracking-widest transition-transform active:scale-95 cursor-pointer hover:opacity-90"
//             >
//               PURCHASE NOW
//             </button>
//           </div>
//         </div>

//         {/* Right Side Hero Image */}
//         <div className="w-full aspect-[4/3] md:aspect-[1.1/1] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/60">
//           {liveData.topImage ? (
//             <img
//               src={getImageUrl(liveData.topImage)!}
//               alt="Hero Product"
//               className="w-full h-full object-cover object-center"
//             />
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 text-sm font-semibold gap-1">
//               <span>Hero Image</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🚀 2. TRUST BAR / OFFERS BANNER */}
//       {offers.length > 0 && (
//         <div className="bg-[#f3f4f6] py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full max-w-6xl mx-auto rounded-2xl my-4">
//           {offers.map((off, i) => (
//             <div
//               key={i}
//               className="flex flex-col items-center text-center space-y-2 px-2"
//             >
//               <div className="mb-1 flex items-center justify-center">
//                 {off.icon ? (
//                   <img
//                     src={getImageUrl(off.icon)!}
//                     className="w-8 h-8 object-contain"
//                     alt={off.title || "Offer Icon"}
//                   />
//                 ) : (
//                   <Sparkles
//                     size={28}
//                     style={{ color: liveData.buttonColor || "#38bdf8" }}
//                     className="stroke-[1.75]"
//                   />
//                 )}
//               </div>

//               <p className="text-base font-black text-slate-900 leading-tight tracking-tight">
//                 {off.title || "100% High Quality Product"}
//               </p>

//               {off.subTitle && (
//                 <p className="text-xs font-normal text-slate-600 leading-normal max-w-xs">
//                   {off.subTitle}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🚀 3. PRODUCT GALLERY SHOWCASE (2x2 GRID) */}
//       <div className="px-6 md:px-12 py-16 text-center space-y-8 max-w-6xl mx-auto w-full">
//         <div className="space-y-2 max-w-md mx-auto">
//           <h2
//             className="text-2xl md:text-3xl font-black tracking-tight"
//             style={{ color: liveData.textColor || "#0f172a" }}
//           >
//             Product Image
//           </h2>
//           <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
//             Explore our high quality gallery photos and product angles.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {[0, 1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 transition-transform duration-300 hover:scale-[1.02]"
//             >
//               {productImages?.[i] ? (
//                 <img
//                   src={getImageUrl(productImages[i])!}
//                   className="w-full h-full object-cover object-center"
//                   alt={`Product Gallery ${i + 1}`}
//                 />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
//                   <span className="text-xs font-bold">Slot {i + 1}</span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🚀 4. FEATURES SECTION */}
//       <div className="px-6 md:px-12 py-16 text-center space-y-10 border-t border-slate-100 max-w-6xl mx-auto w-full">
//         <div className="space-y-2 max-w-md mx-auto">
//           <h2
//             className="text-2xl md:text-3xl font-black tracking-tight"
//             style={{ color: liveData.textColor || "#0f172a" }}
//           >
//             Why To Use Supple
//           </h2>
//           <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
//             Explore our high quality features and advantages.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
//           {/* LEFT COLUMN */}
//           <div className="space-y-8">
//             {[0, 1, 2].map((idx) => {
//               const feat = features?.[idx];
//               const defaultTitles = ["Feature One", "Feature Two", "Feature Three"];
//               const defaultSubs = [
//                 "Lorem ipsum dolor sit amet consectetur. Molestie aenean enim.",
//                 "Nisl vel porttitor feugiat ornare mollis ac. Dignissim amet feugiat.",
//                 "Urna posuere egestas nunc et sit vel. Nam cursus interdum urna.",
//               ];

//               return (
//                 <div key={idx} className="flex items-start md:items-center justify-start md:justify-end gap-3 text-left md:text-right">
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
//                       {feat?.title || defaultTitles[idx]}
//                     </h3>
//                     <p className="text-xs text-slate-500 font-normal leading-relaxed">
//                       {feat?.subTitle || defaultSubs[idx]}
//                     </p>
//                   </div>
//                   <div className="shrink-0 w-8 h-8 flex items-center justify-center">
//                     {feat?.icon ? (
//                       <img
//                         src={getImageUrl(feat.icon)!}
//                         className="w-6 h-6 object-contain"
//                         alt=""
//                       />
//                     ) : (
//                       <Sparkles
//                         size={22}
//                         style={{ color: liveData.buttonColor || "#38bdf8" }}
//                         className="stroke-[1.75]"
//                       />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* CENTER IMAGE */}
//           <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/60 max-w-xs mx-auto w-full">
//             {liveData.topImage || productImages?.[0] ? (
//               <img
//                 src={getImageUrl(liveData.topImage || productImages?.[0])!}
//                 className="w-full h-full object-cover object-center"
//                 alt="Featured Product"
//               />
//             ) : (
//               <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
//                 <span className="text-xs font-bold">Featured Image</span>
//               </div>
//             )}
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="space-y-8">
//             {[3, 4, 5].map((idx) => {
//               const feat = features?.[idx];
//               const defaultTitles = ["Feature Four", "Feature Five", "Feature Six"];
//               const defaultSubs = [
//                 "Neque aliquam risus ut gravida commodo nec integer viverra.",
//                 "In nulla laoreet amet platea feugiat purus at consequat orci.",
//                 "Velit sed sem scelerisque gravida ornare enim. Venenatis pharetra.",
//               ];

//               return (
//                 <div key={idx} className="flex items-start md:items-center justify-start gap-3 text-left">
//                   <div className="shrink-0 w-8 h-8 flex items-center justify-center">
//                     {feat?.icon ? (
//                       <img
//                         src={getImageUrl(feat.icon)!}
//                         className="w-6 h-6 object-contain"
//                         alt=""
//                       />
//                     ) : (
//                       <Sparkles
//                         size={22}
//                         style={{ color: liveData.buttonColor || "#38bdf8" }}
//                         className="stroke-[1.75]"
//                       />
//                     )}
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
//                       {feat?.title || defaultTitles[idx - 3]}
//                     </h3>
//                     <p className="text-xs text-slate-500 font-normal leading-relaxed">
//                       {feat?.subTitle || defaultSubs[idx - 3]}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* 🚀 5. CUSTOMER REVIEWS SECTION */}
//       <div className="px-6 md:px-12 py-16 text-center space-y-8 max-w-6xl mx-auto w-full">
//         <h2
//           className="text-2xl md:text-3xl font-black tracking-tight"
//           style={{ color: liveData.textColor || "#0f172a" }}
//         >
//           Customer Reviews
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-2xl mx-auto">
//           {/* LEFT TESTIMONIAL CARD */}
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-left space-y-4 border border-slate-100">
//             <div className="flex items-center gap-2 text-slate-800">
//               <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
//                 👍
//               </div>
//               <span className="text-xs font-black tracking-tight uppercase">Testimonial</span>
//             </div>

//             <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
//               {reviews?.[0]?.quote ||
//                 "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit."}
//             </p>

//             <div className="flex justify-between items-end pt-2">
//               <div>
//                 <h4 className="text-sm font-extrabold text-slate-900 leading-none">
//                   {reviews?.[0]?.name || "Simon Árpád"}
//                 </h4>
//                 <span className="text-xs text-slate-400 font-medium leading-tight block mt-1">
//                   Verified Customer
//                 </span>
//               </div>
//               <span className="text-4xl font-serif text-slate-300 leading-none">
//                 “
//               </span>
//             </div>
//           </div>

//           {/* RIGHT PRODUCT / CUSTOMER PHOTO */}
//           <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-slate-100 max-w-xs mx-auto w-full">
//             {reviews?.[0]?.image || liveData.topImage ? (
//               <img
//                 src={getImageUrl(reviews?.[0]?.image || liveData.topImage)!}
//                 className="w-full h-full object-cover object-center"
//                 alt="Customer Review Product"
//               />
//             ) : (
//               <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🚀 6. FAQS SECTION */}
//       <div className="px-6 md:px-12 py-16 text-center space-y-8 max-w-3xl mx-auto w-full">
//         <div className="space-y-2">
//           <h2
//             className="text-2xl md:text-3xl font-black tracking-tight"
//             style={{ color: liveData.textColor || "#0f172a" }}
//           >
//             FAQs
//           </h2>
//           <p className="text-xs md:text-sm text-slate-500 font-normal">
//             Frequently asked questions.
//           </p>
//         </div>

//         <div className="space-y-3 text-left">
//           {(faqs.length > 0
//             ? faqs
//             : [
//                 {
//                   question: "How This Supplement Works?",
//                   answer:
//                     "Et nec ipsum tincidunt ut felis elementum proin eget dignissim egestas quis velit maecenas magnis. Etiam faucibus et ultrices sit aliquet ultrices.",
//                 },
//                 { question: "Is There Refund Policy?", answer: "Yes, we offer a 30-day money back guarantee." },
//                 { question: "How Can I Trust Your Supplements?", answer: "All products are 3rd party lab tested for purity and potency." },
//               ]
//           ).map((faq, i) => (
//             <div
//               key={i}
//               className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-2"
//             >
//               <div className="flex justify-between items-center gap-2 cursor-pointer">
//                 <h3 className="text-sm font-bold text-slate-900 leading-snug">
//                   {faq.question || "Frequently Asked Question Title?"}
//                 </h3>
//               </div>

//               {faq.answer && (
//                 <p className="text-xs text-slate-600 font-normal leading-relaxed pt-2 border-t border-slate-100">
//                   {faq.answer}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 🚀 7. VIDEO BANNER */}
//       <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto w-full">
//         <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 relative group border border-slate-200">
//           {getYoutubeThumbnail(liveData.videoLink) ||
//           liveData.topImage ||
//           productImages?.[0] ? (
//             <img
//               src={
//                 getYoutubeThumbnail(liveData.videoLink) ||
//                 getImageUrl(liveData.topImage || productImages?.[0])!
//               }
//               alt="Product Video Preview"
//               className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
//             />
//           ) : (
//             <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm" />
//           )}

//           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
//             <div className="w-14 h-14 bg-black/80 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
//               <Play
//                 size={22}
//                 style={{
//                   color: liveData.buttonColor || "#38bdf8",
//                   fill: "transparent",
//                 }}
//                 className="stroke-[2.5] ml-1"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🚀 8. "ORDER OUR PRODUCT" SECTION */}
//       <div className="px-6 md:px-12 py-16 text-center space-y-10 pb-24 max-w-5xl mx-auto w-full">
//         <div className="space-y-2">
//           <h2
//             className="text-2xl md:text-3xl font-black tracking-tight"
//             style={{ color: liveData.textColor || "#0f172a" }}
//           >
//             Order Our Product
//           </h2>
//           <p className="text-xs md:text-sm text-slate-500 font-normal">
//             This is the only way to get this product in discount.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-left max-w-3xl mx-auto">
//           {/* LEFT COLUMN */}
//           <div className="space-y-4">
//             <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
//               {liveData.topImage || selectedProduct?.images?.[0] ? (
//                 <img
//                   src={
//                     getImageUrl(
//                       liveData.topImage || selectedProduct?.images?.[0]
//                     )!
//                   }
//                   alt={selectedProduct?.name || "Product Image"}
//                   className="w-full h-full object-cover object-center"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm" />
//               )}
//             </div>

//             <div className="grid grid-cols-3 gap-3">
//               {[0, 1, 2].map((i) => {
//                 const imgPath =
//                   productImages?.[i] || selectedProduct?.images?.[i];
//                 return (
//                   <div
//                     key={i}
//                     className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs"
//                   >
//                     {imgPath && (
//                       <img
//                         src={getImageUrl(imgPath)!}
//                         alt={`Thumbnail ${i + 1}`}
//                         className="w-full h-full object-cover object-center"
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="space-y-4 pt-2">
//             <div className="flex items-center gap-1 text-amber-400">
//               {[...Array(5)].map((_, i) => {
//                 const rating = Number(
//                   selectedProduct?.avg_rating ?? selectedProduct?.rating ?? 5
//                 );
//                 return (
//                   <Star
//                     key={i}
//                     size={16}
//                     fill={i < rating ? "currentColor" : "none"}
//                     className={
//                       i < rating
//                         ? "border-none text-amber-400"
//                         : "text-slate-300"
//                     }
//                   />
//                 );
//               })}
//             </div>

//             <h3 className="text-xl font-black text-slate-900 leading-tight">
//               {selectedProduct?.name || liveData.title || (
//                 <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-200">
//                   Select Target Product
//                 </span>
//               )}
//             </h3>

//             <div className="flex items-center gap-3">
//               {selectedProduct?.sell_price !== undefined ||
//               selectedProduct?.price !== undefined ? (
//                 <span
//                   className="text-2xl font-black"
//                   style={{ color: liveData.buttonColor || "#38bdf8" }}
//                 >
//                   ৳{selectedProduct?.sell_price ?? selectedProduct?.price}
//                 </span>
//               ) : (
//                 <span className="text-2xl font-black text-slate-400">
//                   ৳ --.--
//                 </span>
//               )}

//               {(selectedProduct?.regular_price ||
//                 selectedProduct?.originalPrice) && (
//                 <span className="text-sm text-slate-400 font-medium line-through">
//                   ৳
//                   {selectedProduct?.regular_price ??
//                     selectedProduct?.originalPrice}
//                 </span>
//               )}
//             </div>

//             <p className="text-xs text-slate-600 font-normal leading-relaxed">
//               {selectedProduct?.short_description ||
//                 liveData.subHeadline || (
//                   <span className="italic text-slate-400">
//                     No product short description provided.
//                   </span>
//                 )}
//             </p>

//             <div className="pt-2">
//               <button
//                 style={{
//                   backgroundColor: liveData.buttonColor || "#38bdf8",
//                   boxShadow: `0 8px 20px -4px ${liveData.buttonColor || "#38bdf8"}80`,
//                 }}
//                 className="w-full py-3.5 rounded-full text-white font-extrabold text-xs uppercase tracking-widest transition-transform active:scale-95 cursor-pointer hover:opacity-90"
//               >
//                 PURCHASE NOW
//               </button>
//             </div>

//             <div className="border-t border-slate-200/80 pt-3 my-2" />

//             <div className="flex items-center gap-4 text-xs font-bold">
//               <span
//                 className="cursor-pointer"
//                 style={{ color: liveData.buttonColor || "#38bdf8" }}
//               >
//                 Description
//               </span>
//               <span className="text-slate-800 cursor-pointer">
//                 Reviews (
//                 {selectedProduct?.total_reviews ??
//                   reviews.length ??
//                   0}
//                 )
//               </span>
//             </div>

//             <p className="text-xs text-slate-500 font-normal leading-relaxed">
//               {selectedProduct?.description || (
//                 <span className="italic text-slate-400">
//                   Detailed product description will render automatically when bound.
//                 </span>
//               )}
//             </p>
//           </div>


//         </div>


//       </div>

      
//     </div>
//   );
// }


"use client";

import React from "react";
import { Star, Sparkles, Play } from "lucide-react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
export interface OfferItem {
  icon?: string;
  title?: string;
  subTitle?: string;
}

export interface FeatureItem {
  icon?: string;
  title?: string;
  subTitle?: string;
}

export interface ReviewItem {
  name?: string;
  quote?: string;
  image?: string;
}

export interface FAQItem {
  question?: string;
  answer?: string;
}

export interface LandingPageData {
  title?: string;
  headline?: string;
  subHeadline?: string;
  topImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  videoLink?: string;
  productId?: string;
  productImages?: string[];
  offers?: OfferItem[];
  features?: FeatureItem[];
  reviews?: ReviewItem[];
  faqs?: FAQItem[];
  product?: {
    id?: string;
    name?: string;
    sell_price?: number | string;
    regular_price?: number | string;
    price?: number | string;
    originalPrice?: number | string;
    short_description?: string;
    description?: string;
    avg_rating?: number | string;
    rating?: number | string;
    total_reviews?: number | string;
    images?: string[];
  };
}

interface LandingPageRendererProps {
  liveData: LandingPageData;
  productList?: any[];
}

// ==========================================
// 2. HELPER UTILITIES
// ==========================================
export const getImageUrl = (path?: string | null): string | null => {
  if (!path || path.trim() === "") return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8082/api/v1";

  const baseUrl = rawApiUrl.replace(/\/api(\/v1)?\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const getYoutubeThumbnail = (url?: string | null): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
};

const parseJsonArray = <T,>(data: any): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function LandingPageRenderer({
  liveData,
  productList = [],
}: LandingPageRendererProps) {
  const offers = parseJsonArray<OfferItem>(liveData.offers);
  const features = parseJsonArray<FeatureItem>(liveData.features);
  const productImages = parseJsonArray<string>(liveData.productImages);
  const reviews = parseJsonArray<ReviewItem>(liveData.reviews);
  const faqs = parseJsonArray<FAQItem>(liveData.faqs);

  const selectedProduct =
    liveData.product ||
    (Array.isArray(productList)
      ? productList.find((p: any) => p.id === liveData.productId)
      : null);

  return (
    <div
      className="w-full flex flex-col transition-all min-h-screen"
      style={{
        backgroundColor: liveData.backgroundColor || "#ffffff",
        color: liveData.textColor || "#111827",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 🚀 1. HERO SECTION */}
      <section className="min-h-[80vh] flex items-center px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              {liveData.headline ? (liveData.headline.endsWith(".") ? liveData.headline : `${liveData.headline}.`) : "Pre Workout Supplements."}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-md">
              {liveData.subHeadline || "Write here about your product short description."}
            </p>
            <button
              style={{
                backgroundColor: liveData.buttonColor || "#38bdf8",
                boxShadow: `0 10px 25px -5px ${liveData.buttonColor || "#38bdf8"}80`,
              }}
              className="px-8 py-3.5 rounded-full text-white font-extrabold text-xs md:text-sm uppercase tracking-widest transition-transform active:scale-95 hover:opacity-90"
            >
              PURCHASE NOW
            </button>
          </div>
          <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl border border-slate-200/60">
            {liveData.topImage ? (
              <img src={getImageUrl(liveData.topImage)!} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold">Hero Image</div>
            )}
          </div>
        </div>
      </section>

      {/* 🚀 2. TRUST BAR */}
      {offers.length > 0 && (
        <div className="px-6 py-4">
          <div className="bg-[#f3f4f6] py-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto rounded-[2rem]">
            {offers.map((off, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                {off.icon ? (
                  <img src={getImageUrl(off.icon)!} className="w-8 h-8 object-contain" alt="" />
                ) : (
                  <Sparkles size={28} style={{ color: liveData.buttonColor || "#38bdf8" }} />
                )}
                <p className="text-base font-black text-slate-900 tracking-tight">{off.title || "100% High Quality"}</p>
                {off.subTitle && <p className="text-xs text-slate-600 leading-normal max-w-xs">{off.subTitle}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 3. PRODUCT GALLERY SHOWCASE (2x2 GRID TO FIT SCREEN) */}
      <section className="min-h-[80vh] flex items-center px-6 py-12">
        <div className="text-center space-y-8 max-w-5xl mx-auto w-full">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">Product Image</h2>
            <p className="text-xs md:text-sm text-slate-500 font-normal">Explore our high quality gallery photos and product angles.</p>
          </div>
          {/* Changed to 2 columns in desktop to fit height better */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] bg-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200/60">
                {productImages?.[i] ? (
                  <img src={getImageUrl(productImages[i])!} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">Slot {i + 1}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 4. FEATURES SECTION */}
      <section className="min-h-[90vh] flex items-center px-6 py-12 border-t border-slate-50">
        <div className="text-center space-y-10 max-w-6xl mx-auto w-full">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">Why To Use Supple</h2>
            <p className="text-xs md:text-sm text-slate-500">High quality features and advantages.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* LEFT COLUMN */}
            <div className="space-y-10">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center justify-end gap-4 text-right">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-900">{features?.[idx]?.title || `Feature ${idx + 1}`}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[180px] ml-auto">{features?.[idx]?.subTitle || "Lorem ipsum dolor sit amet."}</p>
                  </div>
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg">
                    {features?.[idx]?.icon ? <img src={getImageUrl(features[idx].icon)!} className="w-5 h-5" alt="" /> : <Sparkles size={20} style={{ color: liveData.buttonColor || "#38bdf8" }} />}
                  </div>
                </div>
              ))}
            </div>
            {/* CENTER IMAGE */}
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-xl border-4 border-white max-w-[280px] mx-auto">
              <img src={getImageUrl(liveData.topImage || productImages?.[0])!} className="w-full h-full object-cover" alt="" />
            </div>
            {/* RIGHT COLUMN */}
            <div className="space-y-10">
              {[3, 4, 5].map((idx) => (
                <div key={idx} className="flex items-center justify-start gap-4 text-left">
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg">
                    {features?.[idx]?.icon ? <img src={getImageUrl(features[idx].icon)!} className="w-5 h-5" alt="" /> : <Sparkles size={20} style={{ color: liveData.buttonColor || "#38bdf8" }} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-900">{features?.[idx]?.title || `Feature ${idx + 1}`}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">{features?.[idx]?.subTitle || "Lorem ipsum dolor sit amet."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 5. CUSTOMER REVIEWS SECTION */}
      <section className="min-h-[80vh] flex items-center px-6 py-12">
        <div className="text-center space-y-10 max-w-6xl mx-auto w-full">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl text-left space-y-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-800">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">👍</div>
                <span className="text-[10px] font-black uppercase tracking-tight">Testimonial</span>
              </div>
              <p className="text-sm md:text-lg text-slate-600 font-medium italic">"{reviews?.[0]?.quote || "Amet minim mollit non deserunt ullamco est sit aliqua dolor."}"</p>
              <div className="pt-2">
                <h4 className="text-base font-extrabold text-slate-900">{reviews?.[0]?.name || "Simon Árpád"}</h4>
                <span className="text-xs text-slate-400 font-medium">Verified Customer</span>
              </div>
            </div>
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg max-w-[320px] mx-auto w-full">
              <img src={getImageUrl(reviews?.[0]?.image || liveData.topImage)!} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 6. FAQS SECTION */}
      <section className="min-h-[70vh] flex items-center px-6 py-12">
        <div className="max-w-2xl mx-auto w-full text-center space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">FAQs</h2>
            <p className="text-xs text-slate-500">Frequently asked questions.</p>
          </div>
          <div className="space-y-3 text-left">
            {(faqs.length > 0 ? faqs : [{question: "Supplement FAQ?", answer: "Answer here."}]).map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 flex justify-between items-center">{faq.question} <span className="text-lg">+</span></h3>
                {faq.answer && <p className="text-xs text-slate-600 pt-3 border-t mt-3 border-slate-50">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 7. VIDEO BANNER */}
      <section className="min-h-[60vh] flex items-center px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-slate-200">
          <img src={getYoutubeThumbnail(liveData.videoLink) || getImageUrl(liveData.topImage)!} alt="Video" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play size={24} style={{ color: liveData.buttonColor || "#38bdf8", fill: "currentColor" }} />
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 8. "ORDER OUR PRODUCT" SECTION */}
      <section className="min-h-screen flex items-center px-6 py-12">
        <div className="max-w-6xl mx-auto w-full text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">Order Our Product</h2>
            <p className="text-xs text-slate-500">Limited time discount.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-left max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-md border">
                <img src={getImageUrl(selectedProduct?.images?.[0] || liveData.topImage)!} alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border">
                    <img src={getImageUrl(productImages[i] || selectedProduct?.images?.[i])!} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 py-2">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Number(selectedProduct?.avg_rating || 5) ? "currentColor" : "none"} />)}
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none">{selectedProduct?.name || liveData.title || "Product Name"}</h3>
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-black" style={{ color: liveData.buttonColor || "#38bdf8" }}>৳{selectedProduct?.sell_price || selectedProduct?.price || "--"}</span>
                {(selectedProduct?.regular_price || selectedProduct?.originalPrice) && <span className="text-xl text-slate-300 line-through">৳{selectedProduct?.regular_price || selectedProduct?.originalPrice}</span>}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct?.short_description || liveData.subHeadline}</p>
              <button style={{ backgroundColor: liveData.buttonColor || "#38bdf8" }} className="w-full py-4 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl">PURCHASE NOW</button>
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
                  <span style={{ color: liveData.buttonColor || "#38bdf8" }}>Description</span>
                  <span className="text-slate-400">Reviews ({selectedProduct?.total_reviews || 0})</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{selectedProduct?.description || "Detailed description."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
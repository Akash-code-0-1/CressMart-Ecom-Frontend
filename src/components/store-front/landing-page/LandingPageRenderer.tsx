"use client";

import React, { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Star, Sparkles, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import { translations } from "@/locales";
import { Product } from "@/@types/product.type";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleProduct } from "@/services-api/productService";
import { useRouter } from "next/navigation";

import { extractImageUrl } from "@/utils/image";

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
  productList?: Product[];
}

// Union type of the two possible "selected product" shapes
type SelectedProduct = Product | LandingPageData["product"];

// ==========================================
// 2. HELPER UTILITIES
// ==========================================
export const getImageUrl = (path?: unknown): string | null => {
  const url = extractImageUrl(path);
  return url || null;
};

export const getYoutubeThumbnail = (url?: string | null): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
};

const parseJsonArray = <T,>(data: unknown): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed as T[];
      } catch {
        // Fall through
      }
    }
    if (trimmed !== "") return [trimmed as unknown as T];
  }
  return [];
};

const getProductImageAt = (
  product: SelectedProduct,
  index: number,
): unknown | undefined => {
  if (!product) return undefined;
  const rawImages = (product as any)?.images;
  const images = parseJsonArray<unknown>(rawImages);
  if (images && images.length > index && images[index] !== undefined) {
    return images[index];
  }
  if (index === 0) {
    return (
      (product as any)?.featured_image ||
      (product as any)?.image ||
      (product as any)?.featuredImage ||
      (product as any)?.url
    );
  }
  return undefined;
};

// Safely reads `originalPrice` off either member of the SelectedProduct
// union without unsafe casts — only the `product` shape actually has it.
const getOriginalPrice = (
  product?: SelectedProduct,
): number | string | undefined => {
  if (product && "originalPrice" in product && product.originalPrice) {
    return product.originalPrice;
  }
  return undefined;
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function LandingPageRenderer({
  liveData,
  productList = [],
}: LandingPageRendererProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const offers = parseJsonArray<OfferItem>(liveData.offers);
  const features = parseJsonArray<FeatureItem>(liveData.features);
  const productImages = parseJsonArray<unknown>(
    liveData.productImages || (liveData as any).product_images || (liveData as any).images,
  );
  const reviews = parseJsonArray<ReviewItem>(liveData.reviews);
  const faqs = parseJsonArray<FAQItem>(liveData.faqs);
  const swiperRef = useRef<SwiperType | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [playVideo, setPlayVideo] = useState(false);

  const { data: fetchedProduct } = useQuery({
    queryKey: ["product", liveData.productId],
    queryFn: () => fetchSingleProduct(liveData.productId as string),
    enabled: !!liveData.productId, // শুধুমাত্র productId থাকলে রান করবে
  });

  const productFromList = Array.isArray(productList)
    ? productList.find((p) => p.id === liveData.productId)
    : null;

  const selectedProduct = fetchedProduct ?? productFromList ?? liveData.product;

  const heroImageSrc =
    getImageUrl(liveData.topImage) ||
    getImageUrl((liveData as any).top_image) ||
    getImageUrl((liveData as any).banner_url) ||
    getImageUrl((liveData as any).banner_image) ||
    getImageUrl(productImages?.[0]) ||
    getImageUrl(getProductImageAt(selectedProduct, 0));

  const featureCenterImg =
    heroImageSrc ||
    getImageUrl(productImages?.[0]) ||
    getImageUrl(getProductImageAt(selectedProduct, 0));

  const orderMainImg =
    getImageUrl(getProductImageAt(selectedProduct, 0)) ||
    heroImageSrc;

  const videoThumbSrc =
    getYoutubeThumbnail(liveData.videoLink) ||
    heroImageSrc;

  const getYoutubeVideoId = (url?: string) => {
    if (!url) return "";

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    );

    return match ? match[1] : "";
  };

  const router = useRouter();

  const handlePurchase = () => {
    if (selectedProduct && "slug" in selectedProduct && selectedProduct.slug) {
      router.push(`/product/${selectedProduct.slug}`);
    } else {
      // স্লাগ না থাকলে নিচের অর্ডার সেকশনে নিয়ে যাবে
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="w-full flex flex-col transition-all min-h-screen"
      style={{
        backgroundColor: liveData.backgroundColor || "#ffffff",
        color: liveData.textColor || "#111827",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 🚀 NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto 6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={handlePurchase}
            className="flex items-center gap-1 cursor-pointer md:mx-0 mx-4"
          >
            <span
              className="text-base md:text-2xl font-syne font-bold"
              style={{ color: liveData.textColor || "#111827" }}
            >
              {selectedProduct?.name || liveData.title || "N/A"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-syne font-medium uppercase tracking-wider">
            <a href="#about" className="hover:text-sky-500 transition-colors">
              {t.landingPage.about}
            </a>

            <a href="#gallery" className="hover:text-sky-500 transition-colors">
              {t.landingPage.gallery}
            </a>

            <a
              href="#features"
              className="hover:text-sky-500 transition-colors"
            >
              {t.landingPage.features}
            </a>

            <a href="#reviews" className="hover:text-sky-500 transition-colors">
              {t.landingPage.reviews}
            </a>

            <a href="#video" className="hover:text-sky-500 transition-colors">
              {t.landingPage.video}
            </a>

            <a href="#faqs" className="hover:text-sky-500 transition-colors">
              {t.landingPage.faqs}
            </a>

            <a href="#order" className="hover:text-sky-500 transition-colors">
              {t.landingPage.order}
            </a>
          </nav>

          {/* CTA Button */}
          <a
            href="#order"
            style={{
              backgroundColor: liveData.buttonColor || "#38bdf8",
            }}
            className="hidden lg:flex items-center justify-center px-6 py-3 rounded-full text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
          >
            {t.landingPage.buyNow}
          </a>
        </div>
      </header>
      {/* 🚀 1. HERO SECTION */}
      <section
        id="about"
        className="min-h-[80vh] flex items-center px-6 md:px-12 py-10 scroll-mt-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center container mx-auto w-full h-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tight leading-[1.1]">
              {liveData.headline
                ? liveData.headline.endsWith(".")
                  ? liveData.headline
                  : `${liveData.headline}.`
                : t.landingPage.defaultHeadline}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 font-montserrat leading-relaxed max-w-md">
              {liveData.subHeadline || t.landingPage.defaultSubHeadline}
            </p>
            <button
              onClick={handlePurchase}
              style={{
                backgroundColor: liveData.buttonColor || "#38bdf8",
                boxShadow: `0 10px 25px -5px ${liveData.buttonColor || "#38bdf8"}80`,
              }}
              className="px-8 py-3.5 rounded-full text-white cursor-pointer font-extrabold text-xs md:text-sm uppercase tracking-widest transition-transform active:scale-95 hover:opacity-90"
            >
              {t.landingPage.purchaseNow}
            </button>
          </div>
          <div className="w-full relative aspect-[760/649] rounded-3xl overflow-hidden">
            {heroImageSrc ? (
              <Image
                src={heroImageSrc}
                alt="Hero"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold">
                {t.landingPage.heroImage}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* 🚀 2. TRUST BAR */}
      {offers.length > 0 && (
        <div className="px-6 py-4">
          <div className="bg-[#f3f4f6] py-8 px-6 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-full mx-auto rounded-[2rem]">
            {offers.map((off, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-2"
              >
                {off.icon && getImageUrl(off.icon) ? (
                  <img
                    src={getImageUrl(off.icon)!}
                    className="w-10 h-10 object-contain"
                    alt=""
                  />
                ) : (
                  <Sparkles
                    size={28}
                    style={{ color: liveData.buttonColor || "#38bdf8" }}
                  />
                )}
                <p className="text-base font-syne font-medium text-slate-900 tracking-tight">
                  {off.title || "100% High Quality"}
                </p>
                {off.subTitle && (
                  <p className="text-xs text-slate-600 font-montserrat leading-normal max-w-xs">
                    {off.subTitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 🚀 3. PRODUCT GALLERY SHOWCASE (2x2 GRID TO FIT SCREEN) */}
      <section
        id="gallery"
        className="md:min-h-[80vh] min-h-[vh] flex items-center px-6 py-12 scroll-mt-28"
      >
        <div className="text-center space-y-8 container mx-auto w-full">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-syne font-bold tracking-tight">
              {t.landingPage.productImage}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-montserrat font-normal">
              {t.landingPage.galleryDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[0, 1, 2, 3].map((i) => {
              const galleryImg =
                getImageUrl(productImages?.[i]) ||
                getImageUrl(getProductImageAt(selectedProduct, i)) ||
                (i === 0 ? heroImageSrc : null);
              return (
                <div
                  key={i}
                  className="aspect-[16/10] bg-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-200/60"
                >
                  {galleryImg ? (
                    <img
                      src={galleryImg}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">
                      Slot {i + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* 🚀 4. FEATURES SECTION */}
      <section
        id="features"
        className="min-h-[70vh] flex items-center py-16 scroll-mt-28"
      >
        <div className="text-center space-y-14 container mx-auto w-full">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-syne font-bold tracking-tight">
              {t.landingPage.whyUse}
            </h2>

            <p className="text-sm md:text-base font-montserrat text-slate-500">
              {t.landingPage.featureDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center md:mx-0 mx-4">
            {/* LEFT COLUMN */}
            <div className="space-y-14">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="flex items-center md:justify-end justify-start gap-5 md:text-right text-left"
                >
                  <div className="md:hidden flex shrink-0 w-12 h-12 items-center justify-center">
                    {features?.[idx]?.icon ? (
                      <Image
                        src={getImageUrl(features[idx].icon)!}
                        className="w-12 h-12"
                        alt=""
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Sparkles
                        size={28}
                        style={{ color: liveData.buttonColor || "#38bdf8" }}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-syne font-bold text-slate-900">
                      {features?.[idx]?.title || `Feature ${idx + 1}`}
                    </h3>

                    <p className="text-sm font-montserrat text-slate-500 leading-relaxed max-w-[220px] ml-auto">
                      {features?.[idx]?.subTitle ||
                        "Lorem ipsum dolor sit amet."}
                    </p>
                  </div>

                  <div className="md:flex hidden shrink-0 w-12 h-12 items-center justify-cente">
                    {features?.[idx]?.icon ? (
                      <Image
                        src={getImageUrl(features[idx].icon)!}
                        className="w-12 h-12"
                        alt=""
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Sparkles
                        size={28}
                        style={{ color: liveData.buttonColor || "#38bdf8" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER IMAGE */}
            <div className="rounded-3xl overflow-hidden max-w-[495px] h-[323px] md:h-[623px] mx-auto bg-slate-100">
              {featureCenterImg ? (
                <Image
                  src={featureCenterImg}
                  className="w-full h-full object-cover"
                  alt=""
                  width={495}
                  height={623}
                  unoptimized
                />
              ) : null}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-14">
              {[3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-start gap-5 text-left"
                >
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                    {features?.[idx]?.icon ? (
                      <Image
                        src={getImageUrl(features[idx].icon)!}
                        className="w-12 h-12"
                        alt=""
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Sparkles
                        size={28}
                        style={{ color: liveData.buttonColor || "#38bdf8" }}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-syne font-bold text-slate-900">
                      {features?.[idx]?.title || `Feature ${idx + 1}`}
                    </h3>

                    <p className="text-sm font-montserrat text-slate-500 leading-relaxed max-w-[220px]">
                      {features?.[idx]?.subTitle ||
                        "Lorem ipsum dolor sit amet."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 🚀 5. CUSTOMER REVIEWS SECTION */}
      <section
        id="reviews"
        className="min-h-[70vh] flex items-center px-6 py-12 scroll-mt-28"
      >
        <div className="text-center space-y-10 container mx-auto w-full">
          <h2 className="text-2xl md:text-4xl font-syne font-bold tracking-tight">
            {t.landingPage.customerReviews}
          </h2>

          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="reviewSwiper"
          >
            {(reviews?.length ? reviews : [{}]).map(
              (review: ReviewItem, index: number) => {
                const reviewImg =
                  getImageUrl(review?.image) || heroImageSrc;
                return (
                  <SwiperSlide key={index}>
                    <div className="flex flex-col md:flex-row items-center justify-center container mx-auto">
                      {/* Testimonial Card */}
                      <div className="relative bg-white p-8 md:p-12 rounded-[2rem]  border border-slate-100 text-left max-w-lg w-full">
                        {/* Badge */}
                        <div className="flex items-center gap-2 mb-6">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            👍
                          </div>

                          <span className="text-xs font-black uppercase tracking-wider">
                            {t.landingPage.testimonial}
                          </span>
                        </div>

                        {/* Quote */}
                        <p className="text-base md:text-lg text-slate-600 italic leading-8 pr-10">
                          {review?.quote || t.landingPage.noReview}
                        </p>

                        {/* Footer */}
                        <div className="flex justify-between items-end mt-8">
                          <div>
                            <h4 className="text-lg font-bold">
                              {review?.name || t.landingPage.customer}
                            </h4>

                            <span className="text-sm text-slate-400">
                              {t.landingPage.verifiedCustomer}
                            </span>
                          </div>

                          {/* Decorative Quote */}
                          <span className="text-[110px] leading-none text-slate-200 font-serif select-none">
                            “
                          </span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative w-[340px] h-[550px] rounded-[2rem] overflow-hidden bg-slate-100">
                        {reviewImg ? (
                          <img
                            src={reviewImg}
                            alt={review?.name || "Customer"}
                            className="w-full h-full object-cover"
                          />
                        ) : null}

                        {/* Next Button */}
                        <button
                          onClick={() => swiperRef.current?.slideNext()}
                          className="absolute bottom-5 right-5 bg-black text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer"
                        >
                          {t.landingPage.next}
                          <span className="text-lg">›</span>
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              },
            )}
          </Swiper>
        </div>
      </section>
      {/* 🚀 6. FAQS SECTION */}
      <section
        id="faqs"
        className="min-h-[70vh] flex items-center px-6 py-12 scroll-mt-28"
      >
        <div className="max-w-[1022px] mx-auto w-full text-center space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-syne font-bold tracking-tight">
              {t.landingPage.faqTitle}
            </h2>

            <p className="text-xs text-slate-500">
              {t.landingPage.faqSubtitle}
            </p>
          </div>

          <div className="space-y-4 text-left">
            {(faqs.length > 0
              ? faqs
              : [
                  {
                    question: t.landingPage.defaultQuestion,
                    answer: t.landingPage.defaultAnswer,
                  },
                ]
            ).map((faq, i) => {
              const isOpen = openFaq === i;

              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Header */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex justify-between items-center p-5 text-left"
                  >
                    <h3 className="text-sm md:text-base font-bold text-slate-900">
                      {faq.question}
                    </h3>

                    <span
                      className={`text-2xl font-light transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Content */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-slate-100">
                        <p className="pt-4 text-sm text-slate-600 leading-7">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* 🚀 7. VIDEO BANNER */}
      <section
        id="video"
        className="md:min-h-[60vh] min-h-[40vh] flex items-center py-4 container mx-auto w-full scroll-mt-28"
      >
        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-200">
          {!playVideo ? (
            <>
              {videoThumbSrc ? (
                <Image
                  src={videoThumbSrc}
                  alt="Video"
                  className="w-full h-full object-cover"
                  width={1200}
                  height={630}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">
                  Video Preview
                </div>
              )}

              <div
                onClick={() => setPlayVideo(true)}
                className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <Play
                    size={24}
                    style={{
                      color: liveData.buttonColor || "#38bdf8",
                      fill: "currentColor",
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                liveData.videoLink,
              )}?autoplay=1&rel=0`}
              title="Product Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </section>
      {/* 🚀 8. "ORDER OUR PRODUCT" SECTION */}
      <section
        id="order"
        className="min-h-screen flex items-center px-6 py-12 scroll-mt-28"
      >
        <div className="container mx-auto w-full text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-syne font-bold tracking-tight">
              {t.landingPage.orderTitle}
            </h2>
            <p className="text-xs text-slate-500 font-montserrat">
              {t.landingPage.limitedOffer}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-left mx-auto max-w-6xl">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image using Next.js Image */}
              <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-md">
                {orderMainImg ? (
                  <Image
                    src={orderMainImg}
                    alt={selectedProduct?.name || "Product Image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnail Grid using Next.js Image */}
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => {
                  const thumbImg =
                    getImageUrl(productImages?.[i]) ||
                    getImageUrl(getProductImageAt(selectedProduct, i)) ||
                    (i === 0 ? heroImageSrc : null);
                  return (
                    <div
                      key={i}
                      className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden shadow-sm"
                    >
                      {thumbImg ? (
                        <Image
                          src={thumbImg}
                          alt={`Product Thumb ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 15vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 text-xs">
                          Slot {i + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-5 py-2">
              {/* Rating */}
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Number(selectedProduct?.avg_rating || 5)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>

              {/* Product Name */}
              <h3 className="text-2xl md:text-3xl font-syne font-bold tracking-tight leading-tight">
                {selectedProduct?.name ||
                  liveData.title ||
                  t.landingPage.productName}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl md:text-4xl font-syne font-bold"
                  style={{ color: liveData.buttonColor || "#38bdf8" }}
                >
                  ৳{" "}
                  {selectedProduct?.sell_price ||
                    selectedProduct?.price ||
                    "--"}
                </span>

                {(selectedProduct?.regular_price ||
                  getOriginalPrice(selectedProduct)) && (
                  <span className="text-lg text-slate-300 line-through">
                    ৳{" "}
                    {selectedProduct?.regular_price ||
                      getOriginalPrice(selectedProduct)}
                  </span>
                )}
              </div>

              {/* Short Description (HTML Rendered) */}
              <div
                className="text-sm md:text-[15px] text-slate-600 leading-7 font-montserrat order-desc"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedProduct?.short_description ||
                    liveData.subHeadline ||
                    "",
                }}
              />

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                style={{
                  backgroundColor: liveData.buttonColor || "#38bdf8",
                }}
                className="w-full cursor-pointer py-4 rounded-full text-white font-black text-sm uppercase tracking-wider shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                {t.landingPage.purchaseNow}
              </button>

              {/* Full Description Section */}
              <div className="border-t pt-5 space-y-3">
                <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider mb-2">
                  <span style={{ color: liveData.buttonColor || "#38bdf8" }}>
                    {t.landingPage.description}
                  </span>
                  <span className="text-slate-400">
                    {t.landingPage.productReviews} (
                    {selectedProduct?.total_reviews || 0})
                  </span>
                </div>

                {/* HTML Description Rendering Fix */}
                <div
                  className="text-sm text-slate-500 leading-relaxed font-montserrat order-desc"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedProduct?.description ||
                      t.landingPage.detailedDescription,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          .order-desc p {
            margin-bottom: 0.6rem;
          }
          .order-desc strong {
            font-weight: 700;
            color: inherit;
          }
          .order-desc span {
            line-height: inherit;
          }
        `}</style>
      </section>
    </div>
  );
}

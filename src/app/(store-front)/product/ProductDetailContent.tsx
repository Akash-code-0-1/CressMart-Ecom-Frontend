"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services-api/productService";
import { fetchLandingPageByProductId } from "@/services-api/landingPageService";
import { Breadcrumbs } from "@/components/store-front/product/Breadcrumbs";
import { ProductGallery } from "@/components/store-front/product/ProductGallery";
import { ProductInfo } from "@/components/store-front/product/ProductInfo";
import ProductDetailsTabs from "@/components/store-front/product/Productdetailstabs";
import RecentlyViewed from "@/components/store-front/common/RecentViewSection";
import { getAllcategoryFlatList } from "@/services-api/categoryService";
import { getBreadcrumbPath } from "@/utils/categoryHelper";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { extractImageUrl } from "@/utils/image";
import { useMemo } from "react";

interface Props {
  slug: string;
}

function getImageUrl(img: unknown): string {
  return extractImageUrl(img);
}

export default function ProductDetailContent({ slug }: Props) {


  // 1. Fetch main Product Data
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  // 2. Fetch ALL categories (merged into the same component scope)
  const { data: categoryList } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => getAllcategoryFlatList(),
  });

  // 3. 🚀 CHECK FOR LANDING PAGE
  const { data: landingPage } = useQuery({
    queryKey: ["landing-page-check", product?.id],
    queryFn: () => fetchLandingPageByProductId(product!.id),
    enabled: !!product?.id,
    retry: false,
  });

  // Calculate breadcrumbs once we have both the product and the category list
  const breadcrumbs = useMemo(() => {
    if (!product?.category_id || !categoryList?.data) return [];
    return getBreadcrumbPath(categoryList.data, product.category_id);
  }, [product?.category_id, categoryList?.data]);

  // Handle loading state
  if (isProductLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Handle not found
  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <Link href="/" className="px-6 py-2.5 bg-[#FF7050] text-white rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  const imagesList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/images/placeholder.svg"];

  const galleryItems = imagesList.map((img) => ({
    type: "image" as const,
    src: getImageUrl(img),
  }));

  const videoItems =
    product.video_urls?.map((v) => ({
      type: "video" as const,
      src: getImageUrl(imagesList[0]),
      videoId: v,
    })) || [];
  const allMedia = [...videoItems, ...galleryItems];

  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-[1720px] mx-auto px-4">
        <Breadcrumbs paths={breadcrumbs} activePath={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-[40px] xl:gap-[72px] mt-4">
          <div>
            <ProductGallery items={allMedia} />
          </div>
          <div className="flex flex-col">
            <ProductInfo product={product} />

            {/* 🚀 LANDING PAGE LINK SECTION (Upgraded Professional Theme) */}
            {landingPage && landingPage.slug && (
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50/70 via-white to-white border border-orange-100/80 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/80 text-[#FF7050] text-[10px] font-bold tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7050] animate-pulse"></span>
                      Featured Showcase
                    </div>
                    <h3 className="text-base font-bold text-gray-900 tracking-tight">
                      Explore the Complete Experience
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                      Discover deep-dive visual guides, exclusive highlights,
                      and complete specifications for this item.
                    </p>
                  </div>
                  <Link
                    href={`/landing-page/${landingPage.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF7050] text-white text-xs font-bold rounded-xl transition-all duration-200 hover:bg-[#e05b3d] hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 whitespace-nowrap shrink-0"
                  >
                    View Special Page <FiExternalLink size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProductDetailsTabs product={product} />

        <div className="pt-8 md:pt-16">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}

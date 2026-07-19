"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services-api/productService";
import { Breadcrumbs } from "@/components/store-front/product/Breadcrumbs";
import { ProductGallery } from "@/components/store-front/product/ProductGallery";
import { ProductInfo } from "@/components/store-front/product/ProductInfo";
import ProductDetailsTabs from "@/components/store-front/product/Productdetailstabs";
import RecentlyViewed from "@/components/store-front/common/RecentViewSection";
import { notFound } from "next/navigation";

interface Props {
  slug: string;
}

export default function ProductDetailContent({ slug }: Props) {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const galleryItems = product.images.map((img) => ({
    type: "image" as const,
    src: img,
  }));

  const videoItems =
    product.video_urls?.map((v) => ({
      type: "video" as const,
      src: product.images[0],
      videoId: v,
    })) || [];

  const allMedia = [...videoItems, ...galleryItems];

  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-[1720px] mx-auto px-4">
        <Breadcrumbs paths={["Home", "Products"]} activePath={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-[40px] xl:gap-[72px] mt-4">
          <div>
            <ProductGallery items={allMedia} />
          </div>
          <div>
            <ProductInfo product={product} />
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

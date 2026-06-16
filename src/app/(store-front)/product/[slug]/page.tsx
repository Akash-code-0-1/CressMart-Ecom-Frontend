import RecentlyViewed from "@/components/store-front/common/RecentViewSection";
import { Breadcrumbs } from "@/components/store-front/product/Breadcrumbs";
import ProductDetailsTabs from "@/components/store-front/product/Productdetailstabs";
import { ProductGallery } from "@/components/store-front/product/ProductGallery";
import { ProductInfo } from "@/components/store-front/product/ProductInfo";

export default function ProductDetailsPage() {
  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-[1720px] mx-auto px-4">
        <Breadcrumbs
          paths={["Home", "Gadget & Tools", "Watch", "Child Category"]}
          activePath="Apache Luminous Batman Edition Radium Watch"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-[40px] xl:gap-[72px] mt-4">
          <div className="">
            <ProductGallery
              items={[
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },

                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },

                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "image",
                  src: "/images/store-front/products/w.png",
                },
                {
                  type: "video",
                  src: "/images/store-front/products/w.png",
                  videoId: "https://www.youtube.com/watch?v=PFjYt66h_i4",
                },
              ]}
            />
          </div>
          <div className="">
            <ProductInfo />
          </div>
        </div>
        <ProductDetailsTabs />

        <div className="pt-8 md:pt-16">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}

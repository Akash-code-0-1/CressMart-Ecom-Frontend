import { Breadcrumbs } from "@/components/store-front/product/Breadcrumbs";
import { ProductGallery } from "@/components/store-front/product/ProductGallery";
import { ProductInfo } from "@/components/store-front/product/ProductInfo";

export default function ProductDetailsPage() {
  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-[1720px] mx-auto px-4 py-8">
        <Breadcrumbs
          paths={["Home", "Gadget & Tools", "Watch", "Child Category"]}
          activePath="Apache Luminous Batman Edition Radium Watch"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[72px] mt-4">
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
                  src: "https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg",
                  videoId: "VIDEO_ID",
                },
              ]}
            />
          </div>
          <div className="">
            <ProductInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

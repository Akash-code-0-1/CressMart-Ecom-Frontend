import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface RelatedProduct {
  id: number;
  name: string;
  originalPrice: string;
  salePrice: string;
  rating: number;
  reviewCount: number;
  image: string;
}

const relatedProducts: RelatedProduct[] = [
  {
    id: 1,
    name: "Eclipse Smart Fitness Tracker",
    originalPrice: "BDT 1200",
    salePrice: "BDT 999",
    rating: 4,
    reviewCount: 10,
    image: "/images/store-front/products/w.png",
  },
  {
    id: 2,
    name: "Eclipse Smart Fitness Tracker",
    originalPrice: "BDT 1200",
    salePrice: "BDT 999",
    rating: 4,
    reviewCount: 10,
    image: "/images/store-front/products/w.png",
  },
  {
    id: 3,
    name: "Eclipse Smart Fitness Tracker",
    originalPrice: "BDT 1200",
    salePrice: "BDT 999",
    rating: 4,
    reviewCount: 10,
    image: "/images/store-front/products/w.png",
  },
  {
    id: 4,
    name: "Eclipse Smart Fitness Tracker",
    originalPrice: "BDT 1200",
    salePrice: "BDT 999",
    rating: 4,
    reviewCount: 10,
    image: "/images/store-front/products/w.png",
  },
];

const RelatedProductCard = ({ product }: { product: RelatedProduct }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group bg-[#F2F2F2] mb-4 last:mb-0">
    {/* Product Image */}
    <div className="w-[94px] h-[116px] rounded-xl overflow-hidden bg-gray-200 shrink-0">
      <Image
        src={product.image}
        alt={product.name}
        width={70}
        height={70}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Product Info */}
    <div className="flex-1 min-w-0">
      <h4 className="text-base font-semibold text-black leading-snug line-clamp-2 mb-1 max-w-[155px]">
        {product.name}
      </h4>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-[#FF7050]">
          {product.salePrice}
        </span>

        <span className="text-xs text-gray-400 line-through">
          {product.originalPrice}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex text-[#FFB800] text-xs gap-[1px]">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={
                i < product.rating ? "text-[#FFB800]" : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
      </div>
    </div>
  </div>
);

const RelatedProducts = () => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold font-poppins text-black mb-4 px-1">
        Related Product
      </h3>
      <div className="bg-white rounded-2xl">
        {relatedProducts.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

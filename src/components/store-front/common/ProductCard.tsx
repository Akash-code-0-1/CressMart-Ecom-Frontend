import Image from "next/image";
import WishIcon from "../svg/WishIcon";
import { FaStar } from "react-icons/fa";

interface ProductCardProps {
  title: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
}

const ProductCard = ({
  title,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
  image,
  inStock,
}: ProductCardProps) => {
  return (
    <div className="group flex flex-col p-3 bg-[#F2F2F2] border-[1.5px] border-[#E3E3E3] rounded-[16px] w-full max-w-[350px] font-poppins">
      {/* Product Image Section */}
      <div className="relative bg-white rounded-[12px] p-4 flex items-center justify-center aspect-square mb-3 overflow-hidden">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 left-2 bg-[#FF7050] text-white text-[12px] font-medium px-[6px] py-[2px] rounded-[8px] z-10">
            {discount}
          </div>
        )}

        {/* Wishlist Icon */}
        <button className="cursor-pointer absolute top-2 right-2 z-10 hover:scale-110 transition-transform">
          <WishIcon className="w-7" />
        </button>

        <Image
          src={image}
          alt={title}
          width={220}
          height={220}
          className="object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-black font-poppins md:text-[20px] text-base font-medium leading-tight tuncate">
          {title}
        </h3>

        {/* Rating Section */}
        <div className="flex items-start gap-1 flex-wrap">
          <div className="flex text-[#EABC01] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[14px]">
                <FaStar />
              </span>
            ))}
          </div>
          <span className="text-[#727272] text-[12px] font-medium font-poppins">
            ({rating.toFixed(1)})
          </span>
          <span className="text-[#FF7050] text-[12px] font-medium font-poppins md:ml-auto ml-0">
            ({reviews} Review)
          </span>
        </div>

        {/* Pricing & Stock Section */}
        <div className="flex items-center justify-between md:mt-1 mt-0 flex-wrap">
          <div className="flex md:flex-row flex-col md:items-center items-start md:gap-2 gap-0">
            <span className="text-[#FF7050] font-poppins text-[20px] font-semibold">
              BDT {price}
            </span>
            {oldPrice && (
              <span className="text-[#727272] font-poppins text-[16px] font-medium line-through">
                BDT {oldPrice}
              </span>
            )}
          </div>
          {inStock && (
            <div className="bg-[#32CD32] text-white text-[12px] font-medium px-[6px] py-[2px] rounded-[8px]">
              In Stock
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-2 mt-3 w-full">
          <button className="w-full md:flex-1 cursor-pointer bg-[#FF7050] text-white font-poppins md:text-[18px] text-sm font-medium py-[7px] rounded-[8px] transition-all hover:shadow-[0_4px_7.8px_0_rgba(255,112,80,0.56)] border border-[#E2E2E2] hover:border-transparent">
            Order Now
          </button>
          <button className="w-full md:flex-1 cursor-pointer bg-white font-poppins md:text-[18px] text-sm font-medium py-[7px] rounded-[8px] border border-[#E2E2E2] hover:bg-gray-50 transition-colors">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

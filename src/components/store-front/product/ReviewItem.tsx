import { FaStar } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Image from "next/image";

export default function ReviewItem({
  name,
  rating,
  comment,
  hasImage = false,
}: {
  name: string;
  rating: number;
  comment: string;
  hasImage?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start pb-8 last:pb-0">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 shrink-0">
          <Image
            src="/images/store-front/products/t1.png"
            alt={name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="font-semibold text-base md:text-[18px] leading-tight text-black">
            {name}
          </h4>
          <div className="flex items-center gap-1 text-[#8C8C8C] text-xs font-semibold mt-1">
            <HiBadgeCheck color="#FF7050" size={16} />
            <span>Verified Buyer</span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="flex-1 space-y-3">
        <p className="text-base text-[18px] max-w-[700px] text-center leading-relaxed">
          {comment}
        </p>
        {hasImage && (
          <div className="w-full max-w-sm h-[260px] bg-[#D9D9D9] rounded-3xl flex items-center justify-center text-3xl text-gray-400 font-bold">
            Image
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="md:text-[48px] text-[24px] font-semibold  text-[#FF7050]">
          {rating}.0
        </span>
        <div className="flex text-[#FFB800] text-lg gap-[2px]">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "" : "text-gray-300"} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
interface ItemType {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  image: string;
}

export default function WishlistItem({ item }: { item: ItemType }) {
  return (
    <div className="bg-[#F9F9F9] rounded-[16px] p-4 flex flex-col gap-4 group border border-transparent hover:border-[#FF7050]/20 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
      {/* Product Image Container */}
      <div className="bg-white rounded-[12px] aspect-square flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-500">
          <Image
            src="/images/store-front/products/product02.png"
            alt={item.title}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[14px] font-semibold text-black leading-snug line-clamp-2 h-[40px]">
          {item.title}
        </h3>

        {/* Quantity & Price Row */}
        <div className="flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2.5 text-[#727272]">
            <button className="cursor-pointer hover:text-[#FF7050] transition-colors active:scale-90">
              <AiOutlineMinusCircle size={22} />
            </button>
            <span className="text-base font-bold text-black min-w-[12px] text-center">
              1
            </span>
            <button className="cursor-pointer hover:text-[#FF7050] transition-colors active:scale-90">
              <AiOutlinePlusCircle size={22} />
            </button>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#A0A0A0] line-through font-medium">
              {item.oldPrice} BDT
            </span>
            <span className="text-[15px] font-bold text-[#FF7050]">
              {item.price} BDT
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 mt-1">
          <button className="flex-1 bg-[#FF7050] hover:bg-[#ff5d39] text-white py-3 rounded-[10px] text-sm font-bold transition-all cursor-pointer active:scale-95 shadow-sm shadow-orange-50">
            Place Order
          </button>
          <button className="w-11 h-11 border border-[#FF4D4D] rounded-[10px] flex items-center justify-center text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all cursor-pointer active:scale-95">
            <FaRegTrashAlt size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

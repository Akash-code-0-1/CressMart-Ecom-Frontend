"use client";
import WishlistItem from "./WishlistItem";

const wishlistData = [
  {
    id: 1,
    title: "HOCO EQ24 Wireless Bluetooth Headphones",
    price: 750,
    oldPrice: 950,
    image: "/images/headphones.png",
  },
  {
    id: 2,
    title: "HOCO EQ24 Wireless Bluetooth Headphones",
    price: 750,
    oldPrice: 950,
    image: "/images/headphones.png",
  },
  {
    id: 3,
    title: "HOCO EQ24 Wireless Bluetooth Headphones",
    price: 750,
    oldPrice: 950,
    image: "/images/headphones.png",
  },
  {
    id: 4,
    title: "HOCO EQ24 Wireless Bluetooth Headphones",
    price: 750,
    oldPrice: 950,
    image: "/images/headphones.png",
  },
];

const WishlistPage = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#D2D2D2] p-6 font-poppins">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b border-[#F2F2F2] pb-5">
        <h2 className="text-[20px] font-semibold text-black">Wish List</h2>
        <button className="bg-[#FF7050] hover:bg-[#ff5d39] text-white px-8 py-2.5 rounded-[12px] text-base font-semibold transition-all cursor-pointer active:scale-95 shadow-sm shadow-orange-100">
          Place All Order
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlistData.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

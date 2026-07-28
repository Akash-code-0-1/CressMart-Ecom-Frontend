import { CartItem } from "@/@types/order.type";
import React from "react";

interface PricingListProps {
  items: CartItem[];
  shippingFee: number;
  couponDiscount?: number;
}

const PricingList: React.FC<PricingListProps> = ({
  items = [],
  shippingFee,
  couponDiscount = 0,
}) => {
  // Calculate Total Product Cost (Price * Quantity)
  const totalProductCost = items.reduce((acc, item) => {
    const rawPrice = item.price ?? item.product?.price ?? 0;
    const priceNum =
      typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
    return acc + priceNum * (item.quantity || 1);
  }, 0);

  // Assuming price in the cart is the selling price.
  // If you have a separate 'originalPrice' field, you can calculate specific discounts here.
  const subtotal = totalProductCost - couponDiscount;
  const payableAmount = subtotal + shippingFee;

  return (
    <div className="mt-20 font-poppins">
      <h3 className="font-semibold text-xl mb-4 text-black">Pricing List</h3>
      <div className="flex flex-col gap-3 text-lg text-[#727272] bg-[#F9F9F9] p-6 rounded-[12px]">
        <div className="flex justify-between">
          <span>Total Product Cost</span>
          <span className="font-semibold">{totalProductCost} BDT</span>
        </div>

        <div className="flex justify-between">
          <span>Coupon Discount</span>
          <span className="font-medium text-red-500">
            {couponDiscount > 0 ? `-${couponDiscount}` : "0"} BDT
          </span>
        </div>

        <hr className="border-dashed border-gray-200 my-1" />

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">{subtotal} BDT</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span className="font-medium">{shippingFee} BDT</span>
        </div>

        <hr className="border-gray-200 my-1" />

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-semibold text-[#FF7050]">
            Payable Amount
          </span>
          <span className="text-xl font-semibold text-[#FF7050]">
            {payableAmount} BDT
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingList;

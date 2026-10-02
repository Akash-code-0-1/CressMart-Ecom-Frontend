// import { CartItem } from "@/@types/order.type";
// import { translations } from "@/locales";
// import { useLanguage } from "@/providers/LanguageProvider";
// import React, { useEffect } from "react";

// interface PricingListProps {
//   items: CartItem[];
//   shippingFee: number;
//   couponDiscount?: number;
// }

// const PricingList: React.FC<PricingListProps> = ({
//   items = [],
//   shippingFee,
//   couponDiscount = 0,
// }) => {
//   const { language } = useLanguage();
//   const t = translations[language];
//   // Calculate Total Product Cost (Price * Quantity)
//   const totalProductCost = items.reduce((acc, item) => {
//     const rawPrice = item.price ?? item.product?.price ?? 0;
//     const priceNum =
//       typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
//     return acc + priceNum * (item.quantity || 1);
//   }, 0);

//   const subtotal = totalProductCost - couponDiscount;
//   const payableAmount = subtotal + shippingFee;

//   useEffect(() => {
//   console.log("PricingList received couponDiscount:", couponDiscount);
// }, [couponDiscount]);

//   return (
//     <div className="mt-20 font-poppins">
//       <h3 className="font-semibold text-xl mb-4 text-black">
//         {t.pricing.pricingList}
//       </h3>
//       <div className="flex flex-col gap-3 text-lg text-[#727272] bg-[#F9F9F9] p-6 rounded-[12px]">
//         <div className="flex justify-between">
//           <span>{t.pricing.totalProductCost}</span>
//           <span className="font-semibold">
//             {totalProductCost} {t.pricing.currency}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span>{t.pricing.couponDiscount}</span>
//           <span className="font-medium text-red-500">
//             {couponDiscount > 0 ? `-${couponDiscount}` : "0"}{" "}
//             {t.pricing.currency}
//           </span>
//         </div>

//         <hr className="border-dashed border-gray-200 my-1" />

//         <div className="flex justify-between">
//           <span>{t.pricing.subtotal}</span>
//           <span className="font-medium">
//             {subtotal} {t.pricing.currency}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span>{t.pricing.shippingFee}</span>
//           <span className="font-medium">
//             {shippingFee} {t.pricing.currency}
//           </span>
//         </div>

//         <hr className="border-gray-200 my-1" />

//         <div className="flex justify-between items-center mt-2">
//           <span className="text-xl font-semibold text-[#FF7050]">
//             {t.pricing.payableAmount}
//           </span>
//           <span className="text-xl font-semibold text-[#FF7050]">
//             {payableAmount} {t.pricing.currency}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingList;

// import { CartItem } from "@/@types/order.type";
// import { translations } from "@/locales";
// import { useLanguage } from "@/providers/LanguageProvider";
// import React, { useEffect } from "react";

// interface PricingListProps {
//   items: CartItem[];
//   shippingFee: number;
//   couponDiscount?: number;
//   advanceDiscount?: number;
// }

// const PricingList: React.FC<PricingListProps> = ({
//   items = [],
//   shippingFee,
//   couponDiscount = 0,
//   advanceDiscount = 0,
// }) => {
//   const { language } = useLanguage();
//   const t = translations[language];
//   // Calculate Total Product Cost (Price * Quantity)
//   const totalProductCost = items.reduce((acc, item) => {
//     const rawPrice = item.price ?? item.product?.price ?? 0;
//     const priceNum =
//       typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
//     return acc + priceNum * (item.quantity || 1);
//   }, 0);

//   const subtotal = totalProductCost - couponDiscount - advanceDiscount;
//   const payableAmount = Math.max(0, subtotal + shippingFee);

//   useEffect(() => {
//     console.log("PricingList received couponDiscount:", couponDiscount);
//   }, [couponDiscount]);

//   return (
//     <div className="mt-20 font-poppins">
//       <h3 className="font-semibold text-xl mb-4 text-black">
//         {t.pricing.pricingList}
//       </h3>
//       <div className="flex flex-col gap-3 text-lg text-[#727272] bg-[#F9F9F9] p-6 rounded-[12px]">
//         <div className="flex justify-between">
//           <span>{t.pricing.totalProductCost}</span>
//           <span className="font-semibold">
//             {totalProductCost} {t.pricing.currency}
//           </span>
//         </div>

//         {advanceDiscount > 0 && (
//           <div className="flex justify-between">
//             <span>Advance Payment Discount</span>
//             <span className="font-medium text-green-600">
//               -{advanceDiscount}
//             </span>
//           </div>
//         )}

//         <div className="flex justify-between">
//           <span>{t.pricing.couponDiscount}</span>
//           <span className="font-medium text-red-500">
//             {couponDiscount > 0 ? `-${couponDiscount}` : "0"}{" "}
//             {t.pricing.currency}
//           </span>
//         </div>

//         <hr className="border-dashed border-gray-200 my-1" />

//         <div className="flex justify-between">
//           <span>{t.pricing.subtotal}</span>
//           <span className="font-medium">
//             {subtotal} {t.pricing.currency}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span>{t.pricing.shippingFee}</span>
//           <span className="font-medium">
//             {shippingFee} {t.pricing.currency}
//           </span>
//         </div>

//         <hr className="border-gray-200 my-1" />

//         <div className="flex justify-between items-center mt-2">
//           <span className="text-xl font-semibold text-[#FF7050]">
//             {t.pricing.payableAmount}
//           </span>
//           <span className="text-xl font-semibold text-[#FF7050]">
//             {payableAmount} {t.pricing.currency}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingList;

import { CartItem } from "@/@types/order.type";
import { translations } from "@/locales";
import { useLanguage } from "@/providers/LanguageProvider";
import React from "react";

interface PricingListProps {
  items: CartItem[];
  shippingFee: number;
  couponDiscount?: number;
  advanceDiscount?: number; // The discount saved by paying advance
  paymentMethod?: string;
  advancePaymentRequired?: number; // The actual cash amount to pay via EPS right now
}

const PricingList: React.FC<PricingListProps> = ({
  items = [],
  shippingFee,
  couponDiscount = 0,
  advanceDiscount = 0,
  paymentMethod = "COD",
  advancePaymentRequired = 0,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // 1. Total Product Cost (Sub Total)
  const totalProductCost = items.reduce((acc, item) => {
    const rawPrice = item.price ?? item.product?.price ?? 0;
    const priceNum =
      typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
    return acc + priceNum * (item.quantity || 1);
  }, 0);

  // 2. Total Discounts (Coupon + Advance Plan Discount/Incentive)
  const totalDiscount = couponDiscount + advanceDiscount;

  // 3. Grand Total = Sub Total + Shipping - Total Discounts
  // (Note: If delivery_charge_only is selected, shippingFee is part of the calculation,
  // but advanceDiscount includes the shipping fee waiver, so they cancel out on the product price!)
  const grandTotal = Math.max(
    0,
    totalProductCost + shippingFee - totalDiscount,
  );

  // 4. Calculate Payable Now vs Due on Delivery (COD)
  let payableNow = grandTotal;
  let dueOnDelivery = 0;

  if (paymentMethod === "COD") {
    payableNow = grandTotal;
    dueOnDelivery = 0;
  } else if (paymentMethod === "full_payment") {
    payableNow = grandTotal;
    dueOnDelivery = 0;
  } else if (paymentMethod === "delivery_charge_only") {
    // For Delivery Charge Only: Payable now is the shipping fee, due on delivery is the product cost minus coupon/incentive
    payableNow = shippingFee;
    dueOnDelivery = Math.max(
      0,
      totalProductCost - couponDiscount - (advanceDiscount - shippingFee),
    );
  } else {
    // For percentage or fixed amount:
    payableNow =
      advancePaymentRequired > 0 ? advancePaymentRequired : advanceDiscount;
    dueOnDelivery = Math.max(0, grandTotal - payableNow);
  }

  return (
    <div className="mt-20 font-poppins">
      <h3 className="font-semibold text-xl mb-4 text-black">
        {t.pricing.pricingList}
      </h3>
      <div className="flex flex-col gap-3 text-lg text-[#727272] bg-[#F9F9F9] p-6 rounded-[12px]">
        <div className="flex justify-between">
          <span>{t.pricing.totalProductCost}</span>
          <span className="font-semibold">
            {totalProductCost} {t.pricing.currency}
          </span>
        </div>

        <div className="flex justify-between">
          <span>{t.pricing.shippingFee}</span>
          <span className="font-medium">
            {shippingFee} {t.pricing.currency}
          </span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>{t.pricing.couponDiscount}</span>
            <span className="font-medium">
              -{couponDiscount} {t.pricing.currency}
            </span>
          </div>
        )}

        {advanceDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Advance Plan Discount / Incentive</span>
            <span className="font-medium">
              -{advanceDiscount.toFixed(2)} {t.pricing.currency}
            </span>
          </div>
        )}

        <hr className="border-dashed border-gray-200 my-1" />

        <div className="flex justify-between font-semibold text-black">
          <span>Grand Total</span>
          <span>
            {grandTotal.toFixed(2)} {t.pricing.currency}
          </span>
        </div>

        {dueOnDelivery > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Due on Delivery (COD)</span>
            <span className="font-medium">
              {dueOnDelivery.toFixed(2)} {t.pricing.currency}
            </span>
          </div>
        )}

        <hr className="border-gray-200 my-1" />

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-semibold text-[#FF7050]">
            {paymentMethod === "COD"
              ? "Total Payable (COD)"
              : "Payable (Advance Now)"}
          </span>
          <span className="text-xl font-semibold text-[#FF7050]">
            {payableNow.toFixed(2)} {t.pricing.currency}
          </span>
        </div>
      </div>

      <img
        src="/images/Checkout-Page-Pay_with_EPS.png"
        alt="Payments"
        width={1709}
        height={40}
        className="object-contain mt-4 pl-6"
      />
    </div>
  );
};

export default PricingList;

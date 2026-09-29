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
import React, { useEffect } from "react";

interface PricingListProps {
  items: CartItem[];
  shippingFee: number;
  couponDiscount?: number;
  advanceDiscount?: number;
}

const PricingList: React.FC<PricingListProps> = ({
  items = [],
  shippingFee,
  couponDiscount = 0,
  advanceDiscount = 0,
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

  const totalDiscount = couponDiscount + advanceDiscount;
  
  // 2. Grand Total = Sub Total + Shipping - Total Discounts
  const grandTotal = Math.max(0, totalProductCost + shippingFee - totalDiscount);

  // 3. Informational display value only (do NOT subtract this again from Grand Total)
  const advancePaid = advanceDiscount; 

  // 4. Payable on Delivery (Due Pay) = Grand Total (No double deduction)
  const duePay = grandTotal;

  useEffect(() => {
    console.log("PricingList received couponDiscount:", couponDiscount);
  }, [couponDiscount]);

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
            <span>Advance Plan Discount</span>
            <span className="font-medium">
              -{advanceDiscount} {t.pricing.currency}
            </span>
          </div>
        )}

        <hr className="border-dashed border-gray-200 my-1" />

        <div className="flex justify-between font-semibold text-black">
          <span>Grand Total</span>
          <span>
            {grandTotal} {t.pricing.currency}
          </span>
        </div>

        {advancePaid > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Advance Paid</span>
            <span className="font-medium">
              -{advancePaid} {t.pricing.currency}
            </span>
          </div>
        )}

        <hr className="border-gray-200 my-1" />

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-semibold text-[#FF7050]">
            Due Pay (Payable)
          </span>
          <span className="text-xl font-semibold text-[#FF7050]">
            {duePay} {t.pricing.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingList;
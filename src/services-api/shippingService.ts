// import { apiFetch } from "@/utils/api";
// import { CartItem } from "@/@types/order.type";

// export interface CourierConfig {
//   inside: number;
//   outside: number;
//   sub_city?: number;
// }

// export interface ShippingSettingsData {
//   id: number;
//   default_shipping_fee: string | number;
//   courier_config: CourierConfig;
//   updated_at?: string;
// }

// export interface ShippingSettingsResponse {
//   success?: boolean;
//   statusCode?: number;
//   message?: string;
//   data: ShippingSettingsData;
// }

// export const fetchShippingSettings =
//   async (): Promise<ShippingSettingsData | null> => {
//     try {
//       const res = await apiFetch("/shipping-settings", {
//         method: "GET",
//       });
//       if (!res.ok) return null;
//       const json = (await res.json()) as ShippingSettingsResponse;
//       return json.data || null;
//     } catch (error) {
//       console.error("Error fetching shipping settings:", error);
//       return null;
//     }
//   };

// export interface ShippingConfigEntry {
//   zone?: string;
//   charge?: number;
// }

// export interface ItemShippingBreakdown {
//   cartItemId: string;
//   shippingType: "FREE" | "CUSTOM" | "DEFAULT";
//   itemShippingFee: number;
// }

// /**
//  * Senior Software Engineer Grade Shipping Fee Calculator
//  * Handles multi-item carts with mixed shipping rules: FREE, CUSTOM (zone specific), and DEFAULT.
//  */
// export const calculateCartShippingDetails = (
//   cartItems: CartItem[],
//   shippingArea: string, // "inside" | "outside" | "sub_city"
//   shippingSettings?: ShippingSettingsData | null,
// ): { totalShippingFee: number; itemShippingFees: ItemShippingBreakdown[] } => {
//   if (!cartItems || cartItems.length === 0) {
//     return { totalShippingFee: 0, itemShippingFees: [] };
//   }

//   // 1. Determine Zone Base Default Rate from /shipping-settings
//   const courierConfig = shippingSettings?.courier_config;
//   const defaultInside = courierConfig?.inside ?? 120;
//   const defaultOutside = courierConfig?.outside ?? 150;
//   const defaultSubCity = courierConfig?.sub_city ?? 100;

//   const zoneDefaultFee =
//     shippingArea === "inside"
//       ? defaultInside
//       : shippingArea === "sub_city"
//         ? defaultSubCity
//         : defaultOutside;

//   // Target zone name for matching custom shipping_config JSON
//   const targetZoneName =
//     shippingArea === "inside"
//       ? "Dhaka"
//       : shippingArea === "sub_city"
//         ? "Sub City"
//         : "Outside Dhaka";

//   // 2. Calculate Item-level Shipping Fee for each product in cart
//   const itemShippingFees: ItemShippingBreakdown[] = cartItems.map((item) => {
//     const prod = (item.product || {}) as Record<string, unknown>;
//     const sType = String(
//       prod.shipping_type ||
//         item.shipping_type ||
//         item.shippingType ||
//         "DEFAULT",
//     ).toUpperCase();

//     const rawConfig =
//       prod.shipping_config || item.shipping_config || item.shippingConfig;

//     let parsedConfig: ShippingConfigEntry[] = [];
//     if (Array.isArray(rawConfig)) {
//       parsedConfig = rawConfig as ShippingConfigEntry[];
//     } else if (typeof rawConfig === "string") {
//       try {
//         parsedConfig = JSON.parse(rawConfig) as ShippingConfigEntry[];
//       } catch {
//         parsedConfig = [];
//       }
//     }

//     let fee = zoneDefaultFee;

//     if (sType === "FREE") {
//       fee = 0;
//     } else if (
//       sType === "CUSTOM" &&
//       Array.isArray(parsedConfig) &&
//       parsedConfig.length > 0
//     ) {
//       // Find matching zone in custom config: [{ "zone": "Dhaka", "charge": 35 }, ...]
//       const match = parsedConfig.find((sc) => {
//         const z = String(sc.zone || "").toLowerCase();
//         const target = targetZoneName.toLowerCase();
//         const area = shippingArea.toLowerCase();

//         if (z === target || z === area) return true;
//         if (target === "dhaka" && z.includes("dhaka") && !z.includes("outside"))
//           return true;
//         if (target === "outside dhaka" && z.includes("outside")) return true;
//         if (target === "sub city" && z.includes("sub")) return true;
//         return false;
//       });

//       if (match && match.charge !== undefined && match.charge !== null) {
//         fee = Number(match.charge);
//       } else {
//         fee = Number(parsedConfig[0]?.charge ?? zoneDefaultFee);
//       }
//     } else {
//       // DEFAULT shipping_type
//       fee = zoneDefaultFee;
//     }

//     return {
//       cartItemId: String(item.id),
//       shippingType: sType as "FREE" | "CUSTOM" | "DEFAULT",
//       itemShippingFee: fee,
//     };
//   });

//   // 3. E-commerce Industry Standard Rule for Order Shipping Fee:
//   // - If ALL items are FREE -> Total Fee = 0
//   // - If Cart has mixed items (Free + Custom/Default) -> Lowest non-free shipping fee is used
//   const allFree = itemShippingFees.every((it) => it.shippingType === "FREE");

//   if (allFree) {
//     return { totalShippingFee: 0, itemShippingFees };
//   }

//   const nonFreeFees = itemShippingFees
//     .filter((it) => it.shippingType !== "FREE")
//     .map((it) => it.itemShippingFee)
//     .filter((fee) => fee !== undefined && fee !== null);

//   const totalShippingFee = nonFreeFees.length
//     ? Math.min(...nonFreeFees)
//     : zoneDefaultFee;

//   return {
//     totalShippingFee,
//     itemShippingFees,
//   };
// };

import { apiFetch } from "@/utils/api";
import { CartItem } from "@/@types/order.type";

export interface CourierConfig {
  inside: number;
  outside: number;
  sub_city?: number;
}

export interface ShippingSettingsData {
  id: number;
  default_shipping_fee: string | number;
  courier_config: CourierConfig;
  updated_at?: string;
}

export interface ShippingSettingsResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: ShippingSettingsData;
}

/**
 * API থেকে গ্লোবাল শিপিং সেটিংস আনা
 */
export const fetchShippingSettings =
  async (): Promise<ShippingSettingsData | null> => {
    try {
      const res = await apiFetch("/shipping-settings", { method: "GET" });
      if (!res.ok) return null;
      const json = (await res.json()) as ShippingSettingsResponse;
      return json.data || null;
    } catch (error) {
      console.error("Error fetching shipping settings:", error);
      return null;
    }
  };

export interface ShippingConfigEntry {
  zone?: string;
  charge?: number | string;
}

export interface ItemShippingBreakdown {
  cartItemId: string;
  shippingType: string;
  itemShippingFee: number;
}

/**
 * Senior Software Engineer Grade Shipping Fee Calculator
 * Logic: Product Level (Custom/Free) takes priority, Global Default fallback.
 * Industry Standard: Result is the Maximum shipping fee from the cart.
 */
export const calculateCartShippingDetails = (
  cartItems: CartItem[],
  shippingArea: string, // "inside" | "outside" | "sub_city"
  shippingSettings?: ShippingSettingsData | null,
): { totalShippingFee: number; itemShippingFees: ItemShippingBreakdown[] } => {
  if (!cartItems || cartItems.length === 0) {
    return { totalShippingFee: 0, itemShippingFees: [] };
  }

  // ১. গ্লোবাল সেটিংস থেকে ডিফল্ট ভ্যালু নেওয়া (Fallback)
  const courierConfig = shippingSettings?.courier_config;
  const zoneDefaultFee =
    shippingArea === "inside"
      ? Number(courierConfig?.inside) || 120
      : shippingArea === "sub_city"
        ? Number(courierConfig?.sub_city) || 100
        : Number(courierConfig?.outside) || 150;

  // জোন ম্যাচ করার জন্য লেবেল (ডাটাবেজের JSON-এর সাথে ম্যাচ করতে)
  const isInside = shippingArea === "inside";
  const isOutside = shippingArea === "outside";
  const isSubCity = shippingArea === "sub_city";

  // ২. কার্টের প্রতিটি আইটেম ক্যালকুলেট করা
  const itemShippingFees: ItemShippingBreakdown[] = cartItems.map((item) => {
    // মোহাসাগর/এক্সটার্নাল প্রোডক্ট চেক
    const isExternal =
      item.productId?.startsWith("mohasagor-") || (item as any).isExternal;

    const prod = (item.product || {}) as any;
    const sType = String(prod.shipping_type || "DEFAULT").toUpperCase();
    const rawConfig = prod.shipping_config || item.shipping_config;

    let fee = zoneDefaultFee;

    if (isExternal) {
      // এক্সটার্নাল আইটেম হলে সরাসরি ডিফল্ট জোনে পড়বে
      fee = zoneDefaultFee;
    } else if (sType === "FREE") {
      // FREE লজিক
      fee = 0;
    } else if (sType === "CUSTOM" && rawConfig) {
      // CUSTOM লজিক: JSON থেকে ভ্যালু খোঁজা
      let parsedConfig: ShippingConfigEntry[] = [];
      try {
        parsedConfig =
          typeof rawConfig === "string" ? JSON.parse(rawConfig) : rawConfig;
      } catch (e) {
        parsedConfig = [];
      }

      // জোন অনুযায়ী ডাটাবেজের সঠিক চার্জ বের করা (যেমন আপনার ছবিতে Outside-এর জন্য 70)
      const match = parsedConfig.find((sc) => {
        const z = String(sc.zone || "").toLowerCase();
        if (isInside && z === "dhaka") return true;
        if (isOutside && z.includes("outside")) return true;
        if (isSubCity && z.includes("sub")) return true;
        return false;
      });

      if (match && match.charge !== undefined) {
        fee = Number(match.charge);
      } else {
        // যদি কনফিগে না থাকে তবে প্রথম চার্জটা ধরবে নতুবা গ্লোবাল ডিফল্ট
        fee =
          parsedConfig.length > 0
            ? Number(parsedConfig[0].charge)
            : zoneDefaultFee;
      }
    } else {
      // DEFAULT শিপিং টাইপ
      fee = zoneDefaultFee;
    }

    return {
      cartItemId: String(item.id),
      shippingType: sType,
      itemShippingFee: fee,
    };
  });

  // ৩. ফাইনাল ক্যালকুলেশন (Industry Standard Rule):
  // যদি মিক্সড আইটেম থাকে, তবে কার্টের মধ্যে 'সর্বোচ্চ' (Math.max) ফি নেওয়া হবে।
  // যেমন: আইটেম ১ (CUSTOM=35), আইটেম ২ (DEFAULT=150) -> টোটাল ফি হবে ১৫০।
  const nonFreeFees = itemShippingFees
    .map((it) => it.itemShippingFee)
    .filter((fee) => fee >= 0);

  const totalShippingFee =
    nonFreeFees.length > 0 ? Math.max(...nonFreeFees) : zoneDefaultFee;

  return {
    totalShippingFee,
    itemShippingFees,
  };
};

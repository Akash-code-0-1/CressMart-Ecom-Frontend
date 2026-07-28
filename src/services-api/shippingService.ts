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

export const fetchShippingSettings = async (): Promise<ShippingSettingsData | null> => {
  try {
    const res = await apiFetch("/shipping-settings", {
      method: "GET",
    });
    if (!res.ok) return null;
    const json: ShippingSettingsResponse = await res.json();
    return json.data || (json as any);
  } catch (error) {
    console.error("Error fetching shipping settings:", error);
    return null;
  }
};

export interface ItemShippingBreakdown {
  cartItemId: string;
  shippingType: "FREE" | "CUSTOM" | "DEFAULT";
  itemShippingFee: number;
}

/**
 * Senior Software Engineer Grade Shipping Fee Calculator
 * Handles multi-item carts with mixed shipping rules: FREE, CUSTOM (zone specific), and DEFAULT.
 */
export const calculateCartShippingDetails = (
  cartItems: CartItem[],
  shippingArea: string, // "inside" | "outside" | "sub_city"
  shippingSettings?: ShippingSettingsData | null
): { totalShippingFee: number; itemShippingFees: ItemShippingBreakdown[] } => {
  if (!cartItems || cartItems.length === 0) {
    return { totalShippingFee: 0, itemShippingFees: [] };
  }

  // 1. Determine Zone Base Default Rate from /shipping-settings
  const courierConfig = shippingSettings?.courier_config;
  const defaultInside = courierConfig?.inside ?? 120;
  const defaultOutside = courierConfig?.outside ?? 150;
  const defaultSubCity = courierConfig?.sub_city ?? 100;

  const zoneDefaultFee =
    shippingArea === "inside"
      ? defaultInside
      : shippingArea === "sub_city"
      ? defaultSubCity
      : defaultOutside;

  // Target zone name for matching custom shipping_config JSON
  const targetZoneName =
    shippingArea === "inside" ? "Dhaka" : "Outside Dhaka";

  // 2. Calculate Item-level Shipping Fee for each product in cart
  const itemShippingFees: ItemShippingBreakdown[] = cartItems.map((item: any) => {
    const prod = item.product || {};
    const sType = String(
      prod.shipping_type ||
      item.shipping_type ||
      item.shippingType ||
      "DEFAULT"
    ).toUpperCase();

    const rawConfig =
      prod.shipping_config ||
      item.shipping_config ||
      item.shippingConfig;

    let parsedConfig: any[] = [];
    if (Array.isArray(rawConfig)) {
      parsedConfig = rawConfig;
    } else if (typeof rawConfig === "string") {
      try {
        parsedConfig = JSON.parse(rawConfig);
      } catch (e) {
        parsedConfig = [];
      }
    }

    let fee = zoneDefaultFee;

    if (sType === "FREE") {
      fee = 0;
    } else if (sType === "CUSTOM" && Array.isArray(parsedConfig) && parsedConfig.length > 0) {
      // Find matching zone in custom config: [{ "zone": "Dhaka", "charge": 35 }, ...]
      const match = parsedConfig.find((sc: any) => {
        const z = String(sc.zone || "").toLowerCase();
        const target = targetZoneName.toLowerCase();
        const area = shippingArea.toLowerCase();
        
        if (z === target || z === area) return true;
        if (target === "dhaka" && z.includes("dhaka") && !z.includes("outside")) return true;
        if (target === "outside dhaka" && z.includes("outside")) return true;
        return false;
      });

      if (match && match.charge !== undefined && match.charge !== null) {
        fee = Number(match.charge);
      } else {
        fee = Number(parsedConfig[0]?.charge ?? zoneDefaultFee);
      }
    } else {
      // DEFAULT shipping_type
      fee = zoneDefaultFee;
    }

    return {
      cartItemId: String(item.id),
      shippingType: sType as "FREE" | "CUSTOM" | "DEFAULT",
      itemShippingFee: fee,
    };
  });

  // 3. E-commerce Industry Standard Rule for Order Shipping Fee:
  // - If ALL items are FREE -> Total Fee = 0
  // - If Cart has mixed items (Free + Custom/Default) -> Highest shipping fee governs the parcel delivery
  const allFree = itemShippingFees.every((it) => it.shippingType === "FREE");

  if (allFree) {
    return { totalShippingFee: 0, itemShippingFees };
  }

  // Highest single delivery fee among non-free items in the cart
  const totalShippingFee = Math.max(
    ...itemShippingFees.map((it) => it.itemShippingFee)
  );

  return {
    totalShippingFee,
    itemShippingFees,
  };
};

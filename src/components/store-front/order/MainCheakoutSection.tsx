"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import InputField from "./InputField";
import OrderItemComponent from "./OrderItem";
import PricingList from "./PricingList";
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "@/services-api/cartService";
import { createOrderService } from "@/services-api/orderService";
import {
  applyCouponService,
  CouponResponse,
} from "@/services-api/couponService";
import {
  fetchShippingSettings,
  calculateCartShippingDetails,
} from "@/services-api/shippingService";
import { fetchSingleProduct } from "@/services-api/productService";
import { CartItem, OrderPayload } from "@/@types/order.type";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/@types/product.type";

const MainCheckoutSection: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isStoreReady = useAuthStore((state) => state._hasHydrated);

  // SourceTracker (in layout) already captured & saved the source on first page load.
  // Here we just read it from sessionStorage.
  const [orderSource, setOrderSource] = useState<string>("direct");
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("order_source");
      if (stored) setOrderSource(stored);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [guestId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    shippingArea: "outside",
    paymentMethod: "COD",
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Fetch Cart Data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", user?.id, guestId],
    queryFn: () => fetchCart(user ? null : guestId),
    enabled: isStoreReady && (!!user || !!guestId),
  });

  // Fetch Shipping Settings from GET /shipping-settings
  const { data: shippingSettings } = useQuery({
    queryKey: ["shipping-settings"],
    queryFn: fetchShippingSettings,
  });

  const rawCartItems: CartItem[] = cartData?.items || [];

  // Fetch missing product details (shipping_type, shipping_config) per cart item if not provided by backend cart endpoint
  const productQueries = useQueries({
    queries: rawCartItems.map((item) => ({
      queryKey: ["product-detail-shipping", item.productId],
      queryFn: () => fetchSingleProduct(item.productId),
      enabled: !!item.productId,
    })),
  });

  // Combine raw cart items with product details for 100% accurate shipping rules calculation
  const cartItems: CartItem[] = useMemo(() => {
    return rawCartItems.map((item, index) => {
      const pData = productQueries[index]?.data;
      const existingProduct = (item.product || {}) as Product;

      const sType =
        existingProduct.shipping_type ||
        (item as unknown as { shipping_type?: string }).shipping_type ||
        pData?.shipping_type ||
        "DEFAULT";

      const sConfig =
        existingProduct.shipping_config ||
        (item as unknown as { shipping_config?: unknown }).shipping_config ||
        pData?.shipping_config ||
        null;

      return {
        ...item,
        product: {
          id: item.productId,
          name: item.name || existingProduct.name || pData?.name || "Product",
          featuredImage: item.image || existingProduct.featuredImage || "",
          price: Number(
            item.price || existingProduct.price || pData?.sell_price || 0,
          ),
          shipping_type: sType,
          shipping_config: sConfig,
        },
      };
    });
  }, [rawCartItems, productQueries]);

  const courierConfig = shippingSettings?.courier_config;

  // Dynamically check if Sub City option is valid for current cart items
  const isSubCityAvailable = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return courierConfig?.sub_city !== undefined;
    }

    const hasCustomItems = cartItems.some(
      (item) => item.product?.shipping_type === "CUSTOM",
    );

    if (hasCustomItems) {
      const hasSubCityInCustom = cartItems.some((item) => {
        const prod = (item.product || {}) as unknown as {
          shipping_type?: string;
          shipping_config?: unknown;
        };
        if (prod.shipping_type !== "CUSTOM") return false;

        const rawConfig = prod.shipping_config;
        let parsedConfig: unknown[] = [];
        if (Array.isArray(rawConfig)) parsedConfig = rawConfig;
        else if (typeof rawConfig === "string") {
          try {
            parsedConfig = JSON.parse(rawConfig);
          } catch (e) {}
        }

        return parsedConfig.some((sc: unknown) => {
          const z = String((sc as {zone: string}).zone || "").toLowerCase();
          return (
            z.includes("sub") || z.includes("subcity") || z.includes("sub_city")
          );
        });
      });

      if (!hasSubCityInCustom) {
        return false;
      }
    }

    return courierConfig?.sub_city !== undefined;
  }, [cartItems, courierConfig]);

  // Fallback shippingArea if sub_city is no longer available
  useEffect(() => {
    if (!isSubCityAvailable && formData.shippingArea === "sub_city") {
      const timer = setTimeout(() => {
        setFormData((prev) => ({ ...prev, shippingArea: "outside" }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isSubCityAvailable, formData.shippingArea]);

  // Dynamically calculate actual shipping fees for each area based on cart products (CUSTOM, FREE, DEFAULT)
  const insideFeeCalculated = useMemo(() => {
    return calculateCartShippingDetails(cartItems, "inside", shippingSettings)
      .totalShippingFee;
  }, [cartItems, shippingSettings]);

  const outsideFeeCalculated = useMemo(() => {
    return calculateCartShippingDetails(cartItems, "outside", shippingSettings)
      .totalShippingFee;
  }, [cartItems, shippingSettings]);

  const subCityFeeCalculated = useMemo(() => {
    return calculateCartShippingDetails(cartItems, "sub_city", shippingSettings)
      .totalShippingFee;
  }, [cartItems, shippingSettings]);

  // Selected area shipping fee
  const calculatedShippingFee = useMemo(() => {
    if (formData.shippingArea === "inside") return insideFeeCalculated;
    if (formData.shippingArea === "sub_city") return subCityFeeCalculated;
    return outsideFeeCalculated;
  }, [
    formData.shippingArea,
    insideFeeCalculated,
    outsideFeeCalculated,
    subCityFeeCalculated,
  ]);

  // Update Quantity Mutation
  const updateQtyMutation = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      updateCartItem(id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => toast.error("Failed to update quantity"),
  });

  // Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: (id: string) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: () => toast.error("Failed to remove item"),
  });

  // Apply Coupon Mutation
  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => applyCouponService({ code }),
    onSuccess: (data: CouponResponse) => {
      const discount = data?.discountAmount ?? data?.data?.discountAmount ?? 0;
      setCouponDiscount(Number(discount));
      setAppliedCoupon(couponInput.trim());
      toast.success(data.message || "Coupon applied successfully!");
    },
    onError: (error: Error) => {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      toast.error(error.message || "Invalid or expired coupon");
    },
  });

  // Place Order Mutation
  const placeOrderMutation = useMutation({
    mutationFn: (payload: OrderPayload) => createOrderService(payload),
    onSuccess: async (data) => {
      toast.success("Order placed successfully!");
      // Clear cart from backend
      try {
        await clearCart(user ? null : guestId);
      } catch (_) {
        // silent — cart clear failure shouldn't block navigation
      }
      // Invalidate cart query so header/navbar count resets to 0
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Clear guestId so next visit starts fresh
      if (!user) {
        localStorage.removeItem("guestId");
      }
      // Clear persisted source so next order detects fresh
      sessionStorage.removeItem("order_source");
      const orderObj = data?.data || data;
      const orderId = orderObj?.id || orderObj?.orderId || "";
      router.push(orderId ? `/thank_you?orderId=${orderId}` : "/thank_you");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const payload: OrderPayload = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      customerNote: formData.note,
      paymentMethod: formData.paymentMethod,
      shippingArea: formData.shippingArea,
      shippingFee: calculatedShippingFee,
      couponCode: appliedCoupon || undefined,
      source: orderSource,
      items: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    placeOrderMutation.mutate(payload);
  };

  // Clear stored source after order is placed successfully (handled in onSuccess)

  if (isLoading)
    return (
      <div className="p-20 text-center font-poppins">Loading Checkout...</div>
    );

  return (
    <div className="max-w-[1720px] mx-auto p-4 md:p-10 font-poppins bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Section */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Shopping Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Type your Name Here"
              required
            />
            <InputField
              label="Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />
          </div>

          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="House No, Road No, Area, City, District"
            required
          />
          <InputField
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Write your instruction here..."
            isTextArea
          />

          <div className="flex items-center gap-6 flex-col md:flex-row w-full">
            <div className="flex flex-col gap-2 md:w-1/2 w-full">
              <label className="text-[#727272] font-semibold">
                Select Delivery Charge *
              </label>
              <div className="relative">
                <select
                  name="shippingArea"
                  value={formData.shippingArea}
                  onChange={handleInputChange}
                  className="w-full bg-[#F9F9F9] pl-6 pr-12 py-4 rounded-[12px] outline-none border border-transparent appearance-none cursor-pointer"
                >
                  <option value="outside">
                    Out Side Dhaka BDT {outsideFeeCalculated}
                  </option>
                  <option value="inside">
                    In Side Dhaka BDT {insideFeeCalculated}
                  </option>
                  {isSubCityAvailable && (
                    <option value="sub_city">
                      Sub City BDT {subCityFeeCalculated}
                    </option>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FaCaretDown />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:w-1/2 w-full">
              <label className="text-[#727272] font-semibold">
                Payment Method *
              </label>
              <div className="relative">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full bg-[#F9F9F9] pl-6 pr-12 py-4 rounded-[12px] outline-none border border-transparent appearance-none cursor-pointer"
                >
                  <option value="COD">Cash On Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FaCaretDown />
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-[#727272] font-semibold text-base md:text-lg">
                Coupon
              </label>
              <div className="flex gap-2 md:flex-row flex-col">
                <input
                  placeholder="abc-xyz-123"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && couponInput.trim()) {
                      applyCouponMutation.mutate(couponInput.trim());
                    }
                  }}
                  className="bg-[#F9F9F9] py-4 md:py-5 px-4 md:px-6 rounded-[10px] outline-none text-base md:text-lg border border-transparent w-full font-poppins"
                />
                <button
                  onClick={() => {
                    if (!couponInput.trim()) return;
                    applyCouponMutation.mutate(couponInput.trim());
                  }}
                  disabled={
                    applyCouponMutation.isPending || !couponInput.trim()
                  }
                  className="bg-[#9E9E9E] text-base md:text-lg cursor-pointer hover:bg-gray-500 transition-colors text-white px-10 py-3.5 md:py-4 rounded-[12px] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {applyCouponMutation.isPending
                    ? "Applying..."
                    : appliedCoupon
                      ? "Applied"
                      : "Apply"}
                </button>
              </div>
            </div>

            {/* Success Score Warning Banner */}
            <div className="mt-6 bg-[#FFFF00] p-3 md:p-4 rounded-[12px] flex items-start sm:items-center gap-2 text-sm md:text-[16px] font-normal text-left sm:text-center text-black justify-center">
              <span className="text-base leading-none shrink-0">⚠️</span>
              <span>
                Delivery Charge or 10% advance is required if the delivery ratio
                is below 70% or spans multiple products.
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placeOrderMutation.isPending}
            className="cursor-pointer bg-[#FF7050] text-white py-4 rounded-[12px] text-xl font-bold hover:bg-[#ff6b48] transition-all w-full disabled:opacity-70"
          >
            {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-semibold mb-6">My Orders</h2>
          <div className="flex flex-col max-h-[400px] overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <OrderItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={(id, qty) =>
                  updateQtyMutation.mutate({ id, qty })
                }
                onRemove={(id) => removeItemMutation.mutate(id)}
              />
            ))}
            {cartItems.length === 0 && (
              <p className="text-gray-400 py-10">Cart is empty</p>
            )}
          </div>
          <PricingList
            items={cartItems}
            shippingFee={calculatedShippingFee}
            couponDiscount={couponDiscount}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCheckoutSection;

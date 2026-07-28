"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  AiFillStar,
  AiOutlineHeart,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { Product, ProductVariant } from "@/@types/product.type";
import Image from "next/image";
import { FaCheck, FaHeart, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  createWishlist,
  deleteWishlist,
  getWishlist,
} from "@/services-api/wishlistService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCart } from "@/services-api/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: Product;
}

interface Attribute {
  label: string;
  value: string;
  type?: string;
  hex?: string;
}

const parseAttributes = (rawAttributes: unknown): Attribute[] => {
  if (!rawAttributes) return [];

  let data = rawAttributes;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }

  const result: Attribute[] = [];

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item && typeof item === "object") {
        const label =
          item.label ||
          item.name ||
          item.type ||
          item.key ||
          item.attributeName;
        const value = item.value || item.val || item.attributeValue;
        if (label && value) {
          result.push({
            label: String(label).trim(),
            value: String(value).trim(),
            type: item.type ? String(item.type) : undefined,
            hex: item.hex ? String(item.hex) : undefined,
          });
        }
      }
    });
  } else if (data && typeof data === "object") {
    Object.entries(data).forEach(([key, val]) => {
      if (key && val) {
        if (typeof val === "object" && val !== null) {
          const vObj = val as unknown as {
            value: string;
            val: string;
            name: string;
            type: string;
            hex: string;
          };
          result.push({
            label: String(key).trim(),
            value: String(vObj.value || vObj.val || vObj.name || "").trim(),
            type: vObj.type ? String(vObj.type) : undefined,
            hex: vObj.hex ? String(vObj.hex) : undefined,
          });
        } else {
          result.push({
            label: String(key).trim(),
            value: String(val).trim(),
          });
        }
      }
    });
  }

  return result;
};

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null,
  );

  const router = useRouter();

  // Extract unique attribute categories (e.g. ["Color", "Size"])
  const attributeCategories = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return [];
    const labelsSet = new Set<string>();
    product.variants.forEach((v) => {
      const attrs = parseAttributes(v.attributes);
      attrs.forEach((attr) => {
        if (attr.label) labelsSet.add(attr.label);
      });
    });
    return Array.from(labelsSet);
  }, [product.variants]);

  // Selected attribute value for each category { Color: "Black", Size: "M" }
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Sync selected attributes with selectedVariant
  useEffect(() => {
    if (selectedVariant) {
      const attrs = parseAttributes(selectedVariant.attributes);
      const initial: Record<string, string> = {};
      attrs.forEach((attr) => {
        if (attr.label) initial[attr.label] = attr.value;
      });
      const timer = setTimeout(() => {
        setSelectedAttributes(initial);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedVariant]);

  // Handle selecting an attribute (e.g. category = "Color", val = "White")
  const handleSelectAttribute = (category: string, val: string) => {
    const updatedAttrs = { ...selectedAttributes, [category]: val };
    setSelectedAttributes(updatedAttrs);

    if (product.variants && product.variants.length > 0) {
      // 1. Try finding exact matching variant with all selected attributes
      let match = product.variants.find((v) => {
        const attrs = parseAttributes(v.attributes);
        return Object.entries(updatedAttrs).every(([catKey, catVal]) =>
          attrs.some(
            (a) =>
              a.label.toLowerCase() === catKey.toLowerCase() &&
              a.value.toLowerCase() === catVal.toLowerCase(),
          ),
        );
      });

      // 2. Fallback: find any variant containing the newly clicked attribute value
      if (!match) {
        match = product.variants.find((v) => {
          const attrs = parseAttributes(v.attributes);
          return attrs.some(
            (a) =>
              a.label.toLowerCase() === category.toLowerCase() &&
              a.value.toLowerCase() === val.toLowerCase(),
          );
        });
      }

      if (match) {
        setSelectedVariant(match);
      }
    }
  };

  // get wishlist
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  // check wishlist
  const isWishlisted =
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item.productId === product.id);

  // wishlist mutation
  const { mutate: addToWishlist, isPending: isAdding } = useMutation({
    mutationFn: () => createWishlist(product.id.toString()),
    onSuccess: () => {
      toast.success("Added to wishlist!");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => toast.error(error.message),
  });

  // remove from wishlist
  const { mutate: removeFromWishlist, isPending: isRemoving } = useMutation({
    mutationFn: () => deleteWishlist(product.id.toString()),
    onSuccess: () => {
      toast.success("Removed from wishlist!");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => toast.error(error.message),
  });

  // handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding || isRemoving) return;

    if (!user) {
      toast.error("Please login to add items to wishlist!");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist();
    } else {
      addToWishlist();
    }
  };

  // Add to cart mutation
  const {
    mutateAsync: handleAddToCartAsync,
    mutate: handleAddToCart,
    isPending: isAddingToCart,
  } = useMutation({
    mutationFn: async () => {
      const guestId = localStorage.getItem("guestId") || "";
      return createCart(
        product.id.toString(),
        qty,
        selectedVariant?.id || null,
        user ? null : guestId,
      );
    },
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });

  const handleOrderNow = async () => {
    try {
      await handleAddToCartAsync();
      router.push("/order");
    } catch {
      // handled by onError
    }
  };

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(product.sell_price);

  const regularPrice = parseFloat(product.regular_price);
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.quantity;

  // discount calculation
  const discount =
    regularPrice > currentPrice
      ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
      : 0;

  // helper function to create variant name
  const getVariantDisplayLabel = (rawAttributes: unknown) => {
    const attrs = parseAttributes(rawAttributes);
    if (attrs.length === 0) return "Variant";
    return attrs.map((attr) => attr.value).join(" / ");
  };

  // brand image
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const rowImage = product.brand?.logo_url || "";
  const iconUrl = rowImage.startsWith("http")
    ? rowImage
    : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;

  return (
    <div className="flex flex-col gap-4 font-poppins px-1 sm:px-0 md:mt-0 mt-4">
      {/* SKU and Unit */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {/* brand */}
        {product.brand?.logo_url && (
          <div className="relative w-12 h-12">
            <Image
              src={iconUrl}
              alt={product.brand?.name || ""}
              unoptimized
              fill
              className="object-contain"
            />
          </div>
        )}
        <span className="text-[#727272] text-sm sm:text-[16px] font-medium">
          SKU: {currentSku}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-black text-2xl sm:text-[28px] font-semibold leading-snug">
        {product.name}
      </h1>

      {/* Ratings & Stock Status */}
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap text-sm sm:text-[16px]">
        <div className="flex items-center">
          <span className="text-[#FDCC0D] font-medium mr-1">
            ({product.avg_rating ? product.avg_rating.toFixed(1) : "0.0"})
          </span>
          {[...Array(5)].map((_, i) => (
            <AiFillStar
              key={i}
              size={16}
              className={
                i < Math.floor(product.avg_rating || 0)
                  ? "text-[#FDCC0D]"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-[#727272] font-medium ml-1">
            ({product.total_reviews || 0} Review)
          </span>
        </div>
        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaCheck className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">{product.total_sold || 0}</span> sold
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span className="text-[#727272] font-medium flex items-center">
          <FaRegEye className="mr-1 flex-shrink-0" />
          <span className="font-bold mr-1">{product.view_count || 0}</span>{" "}
          Viewed
        </span>

        <div className="hidden sm:block h-5 w-[1px] bg-[#D2D2D2]"></div>

        <span
          className={`${currentStock > 0 ? "bg-[#32CD32]" : "bg-red-500"} text-white text-xs sm:text-[14px] font-semibold px-3 py-1 rounded-[8px]`}
        >
          {currentStock > 0 ? `${currentStock} In Stock` : "Out of Stock"}
        </span>
      </div>

      {/* Price Section */}
      <div className="flex justify-between md:flex-row flex-col md:items-center items-start gap-3 border-b-2 border-[#D2D2D2] py-4">
        <div className="flex items-center gap-3">
          <span className="text-[#FF7050] text-2xl sm:text-[32px] font-bold">
            BDT {currentPrice.toLocaleString()}
          </span>
          {discount > 0 && regularPrice > currentPrice && (
            <>
              <span className="text-[#727272] text-lg sm:text-[24px] font-medium line-through">
                BDT {regularPrice.toLocaleString()}
              </span>
              <span className="bg-[#32CD32] text-white text-[11px] px-2 py-0.5 rounded-md">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          {product.suppliers.map((supplier) => {
            const rowImage = supplier.image_url || "";
            const iconUrl = rowImage.startsWith("http")
              ? rowImage
              : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;
            return (
              <div key={supplier.id} className="relative w-14 h-14 rounded-md">
                <Image
                  src={iconUrl}
                  alt={supplier.name}
                  unoptimized
                  fill
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-[#727272] text-sm sm:text-[16px] font-normal leading-relaxed text-justify">
        {product.short_description}
      </p>

      {/* Dynamic separated variant selection (Color, Size, etc.) */}
      {attributeCategories.length > 0 ? (
        <div className="flex flex-col gap-4 my-1">
          {attributeCategories.map((category) => {
            const valuesMap = new Map<
              string,
              { value: string; hex?: string; type?: string }
            >();
            product.variants.forEach((v) => {
              const attrs = parseAttributes(v.attributes);
              const attr = attrs.find(
                (a) => a.label.toLowerCase() === category.toLowerCase(),
              );
              if (attr && !valuesMap.has(attr.value)) {
                valuesMap.set(attr.value, {
                  value: attr.value,
                  hex: attr.hex,
                  type: attr.type,
                });
              }
            });

            const uniqueValues = Array.from(valuesMap.values());
            const currentSelectedVal = selectedAttributes[category];

            return (
              <div key={category} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-black text-base font-semibold">
                    {category}:
                  </span>
                  {currentSelectedVal && (
                    <span className="text-[#FF7050] text-sm font-medium">
                      {currentSelectedVal}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {uniqueValues.map((item) => {
                    const isSelected = currentSelectedVal === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          handleSelectAttribute(category, item.value)
                        }
                        className={`flex items-center gap-2 px-4 py-2 border rounded-[8px] text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#FF7050] bg-[#FF7050] text-white shadow-sm font-semibold"
                            : "border-[#E2E2E2] text-[#4D4D4D] hover:border-[#FF7050] bg-white"
                        }`}
                      >
                        {item.hex && (
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                        )}
                        {item.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : product.variants && product.variants.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-black text-lg font-semibold">Variants:</span>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;

              const attrs = parseAttributes(variant.attributes);
              const colorAttr = attrs.find((a) => a.type === "color" || a.hex);

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? "border-[#FF7050] bg-[#FF7050] text-white shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-[#FF7050]"
                  }`}
                >
                  {colorAttr && colorAttr.hex && (
                    <span
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: colorAttr.hex }}
                    />
                  )}
                  {getVariantDisplayLabel(variant.attributes as Attribute[])}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 w-full">
        {/* Quantity Counter */}
        <div className="flex items-center justify-between border border-[#E2E2E2] rounded-lg h-[52px] w-full sm:w-auto">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="cursor-pointer px-5 h-full hover:text-[#FF7050] transition-colors"
          >
            <AiOutlineMinus />
          </button>
          <span className="px-6 text-lg font-medium min-w-[50px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="cursor-pointer px-5 h-full hover:text-[#FF7050] transition-colors"
          >
            <AiOutlinePlus />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <button
            className="cursor-pointer w-[52px] h-[52px] border border-[#FF7050] rounded-lg text-[#FF7050] text-2xl flex items-center justify-center hover:bg-[#FF7050]/5 transition-all"
            onClick={handleWishlistToggle}
            disabled={isAdding || isRemoving}
          >
            {isWishlisted ? (
              <FaHeart className="w-5 h-5 md:w-6 md:h-6 text-[#FF7050]" />
            ) : (
              <AiOutlineHeart />
            )}
          </button>
          <button
            disabled={currentStock <= 0}
            className="cursor-pointer flex-1 h-[52px] border-[1.5px] border-[#FF7050] text-[#FF7050] font-semibold rounded-[8px] hover:bg-[#FF7050]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            {isAddingToCart ? "Adding..." : "Add To Cart"}
          </button>
          <button
            disabled={currentStock <= 0 || isAddingToCart}
            onClick={(e) => {
              e.preventDefault();
              handleOrderNow();
            }}
            className="cursor-pointer flex-1 h-[52px] bg-[#32CD32] text-white font-semibold rounded-[8px] hover:bg-[#28a728] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ORDER NOW
          </button>
        </div>
      </div>

      {/* Warranty Info */}
      {product.warranty && (
        <p className="mt-2 text-sm text-gray-500 font-medium">
          * {product.warranty}
        </p>
      )}
    </div>
  );
};

import { apiFetch } from "@/utils/api";

// create cart
export const createCart = async (
  productId: string,
  quantity: number,
  variantId?: string | null,
  guestId?: string | null,
) => {
  const response = await apiFetch(`cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      variantId: variantId || undefined, 
      quantity,
      guestId: guestId || undefined,
    }),
  });

  if (!response.ok) throw new Error("Failed to add item to cart");
  return await response.json();
};
//cart marge
export const mergeCart = async (guestId: string) => {
  const response = await apiFetch(`cart/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestId }),
  });
  if (!response.ok) throw new Error("Failed to merge cart");
  return await response.json();
};

//cart marge
export const updateCartItem = async (cartItemId: string, quantity: number) => {
  const response = await apiFetch(`cart/update/${cartItemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error("Failed to update cart");
  return await response.json();
};

//cart get
export const fetchCart = async (guestId?: string | null) => {
  const url = guestId ? `cart?guestId=${guestId}` : `cart`;
  const response = await apiFetch(url, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch cart items");
  const result = await response.json();
  return result.data || result;
};

//delete cart
export const deleteCartItem = async (cartItemId: string) => {
  const response = await apiFetch(`cart/remove/${cartItemId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove item from cart");
  return await response.json();
};

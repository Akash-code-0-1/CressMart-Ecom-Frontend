import { apiFetch } from "@/utils/api";


// get wishlist
export const getWishlist = async () => {
  try {
    const response = await apiFetch(`wishlist`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `Error: ${response.status}`);
    }
    return result.data || []; 
  } catch (error) {
    console.error("Fetch Error (getWishlist):", error);
    throw error;
  }
};


// wishlist create 
export const createWishlist = async (productId:string) => {
  try {
    const response = await apiFetch(`wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        productId:productId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Fetch Error (getHomeTags):", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};

// delete wishlist 

export const deleteWishlist = async (productId: string) => {
  try {
    const response = await apiFetch(`wishlist/${productId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `Error: ${response.status}`);
    }
    return result.data || result;
  } catch (error) {
    console.error("Fetch Error (deleteWishlist):", error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
};



import { Product } from "@/@types/product.type";
import { FilterProductsResponse } from "./productService";

const MOHASAGOR_API_KEY = "xrGuaYn8ZPZZ8oMZ";
const MOHASAGOR_SECRET_KEY =
  "11ae6a994890d3d27d0e605130f383128fcfae4f991fe2ef0f7dd747d901dc02";

interface RawMohasagorVariantAttribute {
  type?: string;
  label?: string;
  value?: string;
  val?: string;
  name?: string;
  hex?: string;
  key?: string;
  attributeName?: string;
  attributeValue?: string;
}

interface RawMohasagorVariant {
  id?: number | string;
  color?: string;
  size?: string;
  variant?: string;
  name?: string;
  value?: string;
  image?: string;
  stock?: number | string;
  qty?: number | string;
  sku?: string | number;
  price?: number | string;
  sale_price?: number | string;
  attributes?:
    | string
    | RawMohasagorVariantAttribute[]
    | Record<string, unknown>;
}

interface RawMohasagorProduct {
  id: number | string;
  name: string;
  product_code?: number | string;
  category?: string;
  thumbnail_img?: string;
  slug?: string;
  price?: number;
  sale_price?: number;
  details?: string;
  product_images?: Array<{
    id: number;
    product_id: number;
    product_image: string;
  }>;
  product_variants?: RawMohasagorVariant[];
  variants?: RawMohasagorVariant[];
}



/**
 * Helper to normalize labels like "product_color" to "Color"
 * Ensures UI attributes look clean (e.g., "product_size" -> "Size")
 */
const normalizeAttributeLabel = (label: string, type?: string): string => {
  const source = (type && type.trim()) || label || "";
  const normalized = source.trim().toLowerCase();

  const knownLabels: Record<string, string> = {
    color: "Color",
    colour: "Color",
    size: "Size",
    variant: "Variant",
    material: "Material",
    style: "Style",
    capacity: "Capacity",
    weight: "Weight",
    model: "Model",
  };

  if (knownLabels[normalized]) return knownLabels[normalized];
  if (!source) return "Attribute";

  return source
    .replace(/[_-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * FULL MAPPING FUNCTION
 * Converts Mohasagor API Item to your system's Product type
 */
const mapRawProduct = (item: any): Product => {
  // 1. Identification
  const externalId = String(item.product_code || item.id);
  const isMainAvailable = item.stock_status === "available" || Number(item.stock) > 0;
  
  // 2. Pricing Logic: Reg/Sell = price | Cost = sale_price
  const mohaPrice = String(item.price || 0);
  const mohaCost = String(item.sale_price || 0);

  // 3. IMAGE LOGIC (FIXED)
  let imagesList: string[] = [];
  if (Array.isArray(item.product_images) && item.product_images.length > 0) {
    // API sends: [{ product_image: "url" }, ...]
    imagesList = item.product_images.map((img: any) => img.product_image).filter(Boolean);
  } else if (item.thumbnail_img) {
    imagesList = [item.thumbnail_img];
  } else {
    imagesList = ["/placeholder.png"];
  }

  // Convert to internal format: [{ url: "..." }]
  const finalImages = imagesList.map((url: string) => ({ url }));

  // 4. VARIANT LOGIC (WITH STOCK FIX)
  const mappedVariants = (item.product_variants || []).map((v: any, index: number) => {
    let variantStock = Number(v.stock || v.qty || 0);
    
    // If the main item is available but variant says 0, set to 999
    if (isMainAvailable && variantStock === 0) {
      variantStock = 999;
    }

    return {
      id: String(v.id || index),
      stock: variantStock,
      price: mohaPrice,
      sku: v.sku ? String(v.sku) : null,
      attributes: v.attribute ? [{ label: v.attribute, value: v.variant }] : [],
      // Ensure variants have images for the selector
      images: v.image ? [v.image] : imagesList,
    };
  });

  // 5. QUANTITY CALCULATION
  let totalQuantity = mappedVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
  if (mappedVariants.length === 0) {
    totalQuantity = isMainAvailable ? (Number(item.stock) || 999) : 0;
  }

  // 6. BUILD FINAL OBJECT
  return {
    id: externalId,
    moha_id: Number(item.id), // For descending sort
    name: item.name,
    slug: item.slug || `prod-${externalId}`,
    images: finalImages, // ✅ Images are back
    regular_price: mohaPrice,
    sell_price: mohaPrice,
    cost_price: mohaCost,
    quantity: totalQuantity,
    stock_status: totalQuantity > 0 ? "available" : "out_of_stock",
    description: item.details || item.name,
    short_description: item.details || "", 
    sku: externalId,
    variants: mappedVariants,
    suppliers: [{ id: "mohasagor", name: "Mohasagor", image_url: "" }],
    // Internal compatibility placeholders
    video_urls: [], specifications: [], faqs: [], shipping_config: [], product_tags: [],
    avg_rating: 0, total_reviews: 0, view_count: 0, total_sold: 0,
  } as any;
};
/**
 * Client-side: uses the Next.js proxy route (/api/mohasagor/products) to avoid CORS.
 * Used on the suppliers page (always runs in browser).
 */
// export const fetchMohasagorProducts = async (
//   page = 1,
// ): Promise<FilterProductsResponse> => {
//   const res = await fetch(`/api/mohasagor/products?page=${page}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to fetch products from Mohasagor API");

//   const json = await res.json();
//   const rawList: RawMohasagorProduct[] = Array.isArray(json?.products)
//     ? json.products
//     : [];

//   return {
//     data: rawList.map(mapRawProduct),
//     pagination: {
//       current_page: json?.current_page || page,
//       total_pages: json?.last_page || 1,
//       total_items: json?.total || rawList.length,
//       limit: json?.per_page || 200,
//     },
//   };
// };

export const fetchMohasagorProducts = async (
  page = 1,
): Promise<FilterProductsResponse> => {
  // We add &limit=200 to the proxy request
  const res = await fetch(`/api/mohasagor/products?page=${page}&limit=200`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch products from Mohasagor API");

  const json = await res.json();
  const rawList: RawMohasagorProduct[] = Array.isArray(json?.products)
    ? json.products
    : [];

  return {
    data: rawList.map(mapRawProduct),
    pagination: {
      current_page: json?.current_page || page,
      total_pages: json?.last_page || 1,
      total_items: json?.total || rawList.length,
      limit: 200, 
    },
  };
};

/**
 * Fetches a page directly from Mohasagor API.
 * Works both server-side (absolute URL) and client-side.
 */
const fetchMohasagorPageDirect = async (page: number) => {
  const res = await fetch(
    `https://mohasagor.com.bd/api/reseller/product?page=${page}`,
    {
      headers: {
        "api-key": MOHASAGOR_API_KEY,
        "secret-key": MOHASAGOR_SECRET_KEY,
      },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Mohasagor API error on page ${page}`);
  return res.json();
};

/**
 * Find a single Mohasagor product by its slug (mohasagor-{numericId}).
 * Works server-side and client-side by calling Mohasagor API directly.
 */
export const getMohasagorProductBySlug = async (
  slug: string,
): Promise<Product | null> => {
  try {
    const rawId = slug.replace(/^mohasagor-/, "");
    const numericId = Number(rawId);

    // Fetch client proxy first if in browser, or direct API
    const fetchPage =
      typeof window !== "undefined"
        ? (page: number) =>
            fetchMohasagorProducts(page).then((res) => ({
              products: res.data,
              last_page: res.pagination.total_pages,
            }))
        : (page: number) => fetchMohasagorPageDirect(page);

    const firstPageJson = await fetchPage(1);
    const rawList1 = firstPageJson?.products || [];

    const getRawField = (p: unknown, key: string): unknown => {
      if (typeof p !== "object" || p === null) return undefined;
      return (p as Record<string, unknown>)[key];
    };

    const isProductWithImages = (p: unknown): p is Product =>
      typeof p === "object" && p !== null && "images" in p;

    const matchesProduct = (p: unknown): boolean => {
      const id = getRawField(p, "id");
      const slugField = getRawField(p, "slug");
      return (
        (numericId && Number(id) === numericId) ||
        id === slug ||
        id === `mohasagor-${rawId}` ||
        slugField === rawId ||
        slugField === slug
      );
    };

    const found1 = rawList1.find(matchesProduct);
    if (found1)
      return isProductWithImages(found1)
        ? found1
        : mapRawProduct(found1 as RawMohasagorProduct);

    const totalPages: number = firstPageJson?.last_page || 1;
    if (totalPages <= 1) return null;

    // Search max 10 pages in parallel
    const maxPagesToSearch = Math.min(totalPages, 10);
    const pageNums = Array.from(
      { length: maxPagesToSearch - 1 },
      (_, i) => i + 2,
    );
    const pageResults = await Promise.all(
      pageNums.map((page) => fetchPage(page).catch(() => null)),
    );

    for (const pageJson of pageResults) {
      if (!pageJson) continue;
      const rawList = pageJson?.products || [];
      const match = rawList.find(matchesProduct);
      if (match)
        return isProductWithImages(match)
          ? match
          : mapRawProduct(match as RawMohasagorProduct);
    }
    return null;
  } catch (error) {
    console.error("Error finding Mohasagor product by slug:", error);
    return null;
  }
};

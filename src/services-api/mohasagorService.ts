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
const mapRawProduct = (item: RawMohasagorProduct): Product => {
  // 1. Pricing Logic
  const regularPrice = item.price
    ? String(item.price)
    : String(item.sale_price || 0);
  const sellPrice = item.sale_price
    ? String(item.sale_price)
    : String(item.price || 0);

  // 2. Image Logic (Maps from item.product_images array)
  let imagesList: string[] = [];
  if (Array.isArray(item.product_images) && item.product_images.length > 0) {
    imagesList = item.product_images
      .map((img: any) => img.product_image)
      .filter(Boolean);
  }
  if (imagesList.length === 0 && item.thumbnail_img) {
    imagesList = [item.thumbnail_img];
  }
  if (imagesList.length === 0) {
    imagesList = ["/images/placeholder.svg"];
  }

  // 3. Variant Logic (Maps from item.product_variants)
  const rawVariants = item.product_variants || item.variants || [];
  const mappedVariants = Array.isArray(rawVariants)
    ? rawVariants.map((v: any, index: number) => {
        const attrs: { type: string; label: string; value: string; hex?: string }[] = [];
        
        // Handle specific keys seen in your API response: "attribute" and "variant"
        if (v.attribute && v.variant) {
          attrs.push({
            label: normalizeAttributeLabel(String(v.attribute)),
            value: String(v.variant),
            type: normalizeAttributeLabel(String(v.attribute)),
          });
        }

        return {
          id: String(v.id || index),
          product_id: `mohasagor-${item.id}`,
          images: v.image ? [v.image] : imagesList,
          attributes: attrs,
          stock: Number(v.stock || v.qty || 0),
          sku: String(v.sku || item.product_code || item.id),
          price: String(v.price || v.sale_price || sellPrice),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      })
    : [];

  // 4. Dynamic Quantity / Stock Status Logic
  const totalStockFromVariants = mappedVariants.reduce((sum, v) => sum + v.stock, 0);
  const rootStock = Number((item as any).stock || (item as any).qty || 0);
  
  // Use 999 as a "buyable" placeholder if status is "available", else use actual count
  const finalQuantity = (item as any).stock_status === "available" 
    ? 999 
    : (totalStockFromVariants > 0 ? totalStockFromVariants : rootStock);

  // 5. Build Final Product Object
  return {
    id: `mohasagor-${item.id}`,
    name: item.name,
    slug: item.slug || `mohasagor-${item.id}`,
    images: imagesList.map((url) => ({ url })),
    
    // Default dynamic arrays (functional nulls/empty)
    video_urls: (item as any).video_urls || [], 
    specifications: (item as any).specifications || [],
    faqs: (item as any).faqs || [],
    shipping_config: (item as any).shipping_config || [],
    product_tags: [],

    regular_price: regularPrice,
    sell_price: sellPrice,
    quantity: finalQuantity,
    stock_status: (item as any).stock_status,

    short_description: item.category || "Gadgets & Electronics",
    description: item.details || item.name, // Using "details" from your API logs
    
    // TypeScript-safe brand mapping
    brand: (item as any).brand ? { 
        id: String((item as any).brand.id), 
        name: String((item as any).brand.name || "Unknown Brand"), 
        logo_url: (item as any).brand.logo ? String((item as any).brand.logo) : undefined 
    } : undefined,
    
    suppliers: [{ id: "mohasagor", name: "Mohasagor", image_url: "" }],
    
    sku: item.product_code ? String(item.product_code) : String(item.id),
    
    unit_name: (item as any).unit || "Pcs", 
    warranty: (item as any).warranty || undefined,
    
    // Functional values start at 0 (dynamic based on API)
    avg_rating: Number((item as any).rating || 0),
    total_reviews: Number((item as any).reviews_count || 0),
    view_count: Number((item as any).view_count || 0),
    total_sold: Number((item as any).total_sold || 0),
    
    variants: mappedVariants,
  };
};

/**
 * Client-side: uses the Next.js proxy route (/api/mohasagor/products) to avoid CORS.
 * Used on the suppliers page (always runs in browser).
 */
export const fetchMohasagorProducts = async (
  page = 1,
): Promise<FilterProductsResponse> => {
  const res = await fetch(`/api/mohasagor/products?page=${page}`, {
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
      limit: json?.per_page || 200,
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

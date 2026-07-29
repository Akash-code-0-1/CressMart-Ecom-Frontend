import { Product } from "@/@types/product.type";
import { FilterProductsResponse } from "./productService";

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
}

export const fetchMohasagorProducts = async (
  page = 1,
): Promise<FilterProductsResponse> => {
  const res = await fetch(`/api/mohasagor/products?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products from Mohasagor API");
  }

  const json = await res.json();
  const rawList: RawMohasagorProduct[] = Array.isArray(json?.products)
    ? json.products
    : [];

  const mappedProducts: Product[] = rawList.map((item) => {
    const regularPrice = item.price
      ? String(item.price)
      : String(item.sale_price || 0);
    const sellPrice = item.sale_price
      ? String(item.sale_price)
      : String(item.price || 0);
    const priceNum = Number(sellPrice) || Number(regularPrice) || 0;
    const thumbnail = item.thumbnail_img || "/images/placeholder.svg";

    return {
      id: `mohasagor-${item.id}`,
      name: item.name,
      slug: item.slug ? `mohasagor-${item.slug}` : `mohasagor-${item.id}`,
      images: [thumbnail],
      regular_price: regularPrice,
      sell_price: sellPrice,
      price: priceNum,
      quantity: 50,
      short_description: item.category || "Gadgets & Electronics",
      description: item.details || item.name,
      brand: {
        id: "mohasagor",
        name: "Mohasagor",
        logo_url: "",
      },
      suppliers: [
        {
          id: "mohasagor",
          name: "Mohasagor",
          image_url: "",
        },
      ],
      sku: item.product_code ? String(item.product_code) : String(item.id),
      unit_name: "Pcs",
      warranty: "Authentic Product",
      avg_rating: 5,
      total_reviews: 1,
      specifications: null,
      faqs: null,
      shipping_config: [],
      variants: [],
      product_tags: [],
      view_count: 150,
      total_sold: 45,
    };
  });

  return {
    data: mappedProducts,
    pagination: {
      current_page: json?.current_page || page,
      total_pages: json?.last_page || 1,
      total_items: json?.total || mappedProducts.length,
      limit: json?.per_page || 200,
    },
  };
};

export interface ShippingConfig {
  zone: string;
  charge: number;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  is_flash_sale: boolean;
}

export interface TagRelation {
  product_id: string;
  tag_id: string;
  tag: ProductTag;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  images: string[]; // ভ্যারিয়েন্টের ইমেজ সাধারণত স্ট্রিং অ্যারে হয়, তবে এপিআই চেক করে নেবেন
  attributes: {
    type: string;
    label: string;
    value: string;
  }[];
  stock: number;
  sku: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface SpecificationItem {
  type: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

// এটি আপনার JSON-এর ইমেজের সাথে মিলবে
export interface ProductImage {
  url: string;
  title?: string;
  caption?: string;
  alt_text?: string;
}

/**
 * Product card / product listing type
 */
export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  sell_price: string;
  regular_price: string;
  images: ProductImage[]; // অবজেক্ট অ্যারে
  avg_rating: number;
  total_reviews: number;
  quantity: number;
  discount_tag: string | null;
  variants?: ProductVariant[];
}

/**
 * Full product details type
 */
export interface Product {
  id: string;
  uid?: string | null; // JSON-এ আছে
  name: string;
  slug: string;

  // ফিক্সড: এটি string[] এর বদলে ProductImage[] হবে
  images: ProductImage[];

  category_id?: string;
  brand_id?: string | null;

  brand?: {
    id: string;
    name: string;
    logo_url?: string;
  };

  short_description?: string | null;
  description?: string;

  video_urls?: string[] | null;

  regular_price: string;
  sell_price: string;
  cost_price?: string;

  quantity: number;
  sku?: string;

  unit_name?: string;
  warranty?: string | null;

  avg_rating: number;
  total_reviews: number;

  specifications?: SpecificationItem[] | null;
  faqs?: FAQItem[] | null;

  shipping_config?: ShippingConfig[] | null; // JSON-এ null হতে পারে
  shipping_type?: string;

  variants?: ProductVariant[];
  product_tags?: TagRelation[];

  view_count?: number;
  total_sold?: number;
  status?: string;

  priority?: number;
  created_at?: string;
  updated_at?: string;

  discount_tag?: string | null;
}

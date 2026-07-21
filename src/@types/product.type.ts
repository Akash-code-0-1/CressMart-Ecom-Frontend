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

export type ProductVariant = {
  id: string;
  product_id: string;
  images: string[];
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
};
export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  brand: {
    id: string;
    name: string;
    logo_url: string;
  };
  suppliers: {
    id: string;
    name: string;
    image_url: string;
  }[];
  short_description: string;
  description: string;
  video_urls: string[] | null;
  regular_price: string;
  sell_price: string;
  quantity: number;
  sku: string;
  unit_name: string;
  warranty: string;
  avg_rating: number;
  total_reviews: number;
  specifications: SpecificationItem[] | null;
  faqs: FAQItem[] | null;
  shipping_config: ShippingConfig[];
  variants: ProductVariant[];
  product_tags: TagRelation[];
  view_count: number;
  total_sold: number;
  discount_tag?: string | null;
}

export interface SpecificationItem {
  type: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

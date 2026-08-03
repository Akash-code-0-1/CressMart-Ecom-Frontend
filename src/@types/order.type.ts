type FraudStatus = "Safe" | "Risky" | "Mediam";

export interface Order {
  // Existing fields
  id: number | string; // Updated to support UUID string format from JSON
  orderId: string;
  product: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  price: string;
  payment: string;
  fraudStatus: FraudStatus;
  fraudScore: number;
  status: string;
  order_items: Array<{
    product: {
      name: string;
      images?: string[];
    };
  }>;
  order_number: string;
  total_amount_due: string;
  payment_status: string;
  created_at: string;

  // Added fields based on JSON data
  invoiceNo: string;
  deliveryFee: number;
  discountAmount: number;
  totalAmountDue: number; // Numeric version (JSON has 681, while total_amount_due is string)
  customer: Customer;
  items: OrderItem[];
  customerNote?: string;
}

export interface TableColumn<T = unknown> {
  header: string;
  key: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface CartItemProduct {
  id: string;
  name: string;
  featuredImage: string;
  images?: string[];
  price: number;
  discountPrice?: number;
  shipping_type?: "DEFAULT" | "CUSTOM" | "FREE" | string;
  shipping_config?: Array<{ zone: string; charge: number }> | null;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  name?: string;
  price?: number | string;
  image?: string | null;
  variantInfo?:
    | Array<{ label?: string; value?: string; type?: string }>
    | Record<string, unknown>;
  product?: CartItemProduct;
  variant?: {
    id: string;
    name?: string;
    color?: string;
    size?: string;
    images?: string[];
  };
}

export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  customer_note?: string;
  paymentMethod: string;
  shippingArea: string[] | [];
  shippingFee?: number;
  couponCode?: string;
  source?: string;
  items: (
    | {
        productId: string;
        variantId?: string;
        quantity: number;
        isExternal?: never;
      }
    | {
        isExternal: true;
        externalProductId: string;
        externalName: string;
        externalPrice: number;
        quantity: number;
        productId?: never;
        variantId?: never;
      }
  )[];
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  variantInfo: string;
  unit_price: number;
}

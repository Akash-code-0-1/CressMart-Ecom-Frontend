import { apiFetch } from "@/utils/api";

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
  paymentMethod: "COD" | "ONLINE" | string;
  shippingArea: "inside" | "outside" | string;
  couponCode?: string;
  source?: string;
  items: OrderItemInput[];
}

export interface UpdateInvoicePayload {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerNote?: string;
}
// create order
export const createOrderService = async (orderData: CreateOrderRequest) => {
  try {
    const response = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Order Failed !");
    }
    return result;
  } catch (error) {
    console.error("Order Creation Error:", error);
    throw error;
  }
};

// get order for invoice
export const getOrderByIdService = async (id: string) => {
  try {
    const response = await apiFetch(`/orders/${id}`, {
      method: "GET",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch order details");
    }
    return result.data || result;
  } catch (error) {
    console.error("Fetch Order Error:", error);
    throw error;
  }
};

// edit order invoice service
export const editOrderInvoiceService = async (
  id: string,
  invoiceData: UpdateInvoicePayload,
) => {
  try {
    const response = await apiFetch(`/orders/${id}/invoice-edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update invoice");
    }
    return result.data || result;
  } catch (error) {
    console.error("Edit Invoice Error:", error);
    throw error;
  }
};

// my orders

export interface OrderQuery {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
  payment_status?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
}
export const getMyOrdersService = async (query: OrderQuery) => {
  try {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const response = await apiFetch(`/orders/my-orders?${params.toString()}`, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch my orders");
    }
    return result;
  } catch (error: unknown) {
    console.error("Fetch My Orders Error:", error);
    if (error instanceof Error) {
      throw error.message;
    }
    throw "An unexpected error occurred";
  }
};

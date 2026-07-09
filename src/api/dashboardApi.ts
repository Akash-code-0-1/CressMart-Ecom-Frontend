// import dayjs from "dayjs";
// import { apiFetch } from "@/utils/api";
// import Cookies from "js-cookie";

// export interface DashboardStatsResponse {
//   totalProducts: number;
//   totalOrders: number;
//   totalRevenue: number;
//   onlineNow: number;
//   todayVisitors: number;
//   totalVisitors: number;
// }

// export const fetchAdminDashboardStats = async (
//   filter: string,
//   date?: Date,
// ): Promise<DashboardStatsResponse> => {
//   const token = Cookies.get("accessToken");
//   let backendFilter = filter.toLowerCase().replace(/\s/g, "");
//   if (backendFilter === "alltime") backendFilter = "all";
//   if (backendFilter === "custom") backendFilter = "day";

//   const params = new URLSearchParams({
//     filter: backendFilter,
//   });

//   if (date) params.append("customDate", dayjs(date).format("YYYY-MM-DD"));
//   const response = await apiFetch(
//     `/admin/dashboard/statistics?${params.toString()}`,
//     {
//       method: "GET",
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//     },
//   );

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || "Dashboard data not found");
//   }

//   const result = await response.json();
//   return result.data || result;
// };
import {
  DashboardOverview,
  OrderLifecycle,
  PerformanceChartItem,
} from "@/types/dashboard";

export interface DashboardStatsResponse {
  overview: DashboardOverview;
  orderLifecycle: OrderLifecycle;
  charts: {
    performance: PerformanceChartItem[];
    salesByCategory: {
      name: string;
      value: number;
      color?: string;
    }[];
  };
  products: [];
}

export const fetchAdminDashboardStats = async (
  _filter: string,
  _date?: Date,
): Promise<DashboardStatsResponse> => ({
  overview: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    onlineNow: 0,
    todayVisitors: 0,
    totalVisitors: 0,
  },
  orderLifecycle: {
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELED: 0,
    RETURNED: 0,
  },
  charts: {
    performance: [],
    salesByCategory: [],
  },
  products: [],
});
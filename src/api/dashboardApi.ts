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

export interface DashboardStatsResponse {
  overview: Record<string, unknown>;
  orderLifecycle: Record<string, unknown>;
  charts: {
    performance: Record<string, unknown>;
    salesByCategory: Record<string, unknown>;
  };
  products: Record<string, unknown>;
}

export const fetchAdminDashboardStats = async (
  _filter: string,
  _date?: Date,
): Promise<DashboardStatsResponse> => {
  return {
    overview: {},
    orderLifecycle: {},
    charts: {
      performance: {},
      salesByCategory: {},
    },
    products: {},
  };
};

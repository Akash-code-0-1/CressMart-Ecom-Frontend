import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface SellReportQuery {
  page?: number;
  limit?: number;
  customDate?: string;
}

export const dashboardApi = {
  /**
   * Main Statistics: Overview, Order Lifecycle, Charts, and Top Best Sellers
   */
  async getStatistics(filter: string, customDate?: string) {
    const token = await getAdminTokenAction();
    const params = new URLSearchParams();

    // ⚡ Map UI Labels to Backend expected strings
    let mappedFilter = "month";
    const raw = filter.toLowerCase().replace(" ", "");

    if (raw === "day") mappedFilter = "day";
    if (raw === "year") mappedFilter = "year";
    if (raw === "alltime") mappedFilter = "all"; // Backend logic uses 'all' for All Time

    params.append("filter", mappedFilter);
    if (customDate) params.append("customDate", customDate);

    const res = await apiFetch(
      `/admin/dashboard/statistics?${params.toString()}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token || ""}` },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch dashboard statistics");
    return res.json();
  }, // 🚀 Fixed: Added missing comma

  /**
   * Detailed Paginated Product Sell Report for the Modal
   */
  async getSellReport(query: any) {
    const token = await getAdminTokenAction();
    const params = new URLSearchParams(query);

    const res = await apiFetch(`/admin/dashboard/sell-report?${params.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token || ""}` },
    });

    if (!res.ok) throw new Error("Failed to fetch sell report");
    return res.json(); // This will return the object you built in the Controller
  },
};

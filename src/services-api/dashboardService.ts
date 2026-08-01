import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

// src/services-api/dashboardService.ts

export const dashboardApi = {
  async getStatistics(filter: string, customDate?: string) {
    const token = await getAdminTokenAction();
    const params = new URLSearchParams();

    // ⚡ Map UI Labels to Backend expected strings
    let mappedFilter = "month";
    const raw = filter.toLowerCase().replace(" ", "");
    
    if (raw === "day") mappedFilter = "day";
    if (raw === "year") mappedFilter = "year";
    if (raw === "alltime") mappedFilter = "all"; // 🚀 Switch to 'all'

    params.append("filter", mappedFilter);
    if (customDate) params.append("customDate", customDate);

    const res = await apiFetch(`/admin/dashboard/statistics?${params.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token || ""}` },
    });

    return res.json();
  }
};
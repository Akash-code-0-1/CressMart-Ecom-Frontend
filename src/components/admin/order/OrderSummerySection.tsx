"use client";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import VisitorOrderChart from "./VisitorOrderChart";
import OrderSummaryChart from "./OrderSummaryChart";
import ReturnIcon from "@/components/store-front/svg/svg/ReturnIcon";

import { useQuery } from "@tanstack/react-query";
import { fetchOrderCounts } from "@/services-api/orderService";
import { dashboardApi } from "@/services-api/dashboardService";
import { useMemo } from "react";

// 🚀 UPDATED: Added "Shipped" to the config
const SUMMARY_CONFIG = [
  { name: "Pending", color: "#26007F" },
  { name: "Confirmed", color: "#7AD100" },
  { name: "On Hold", color: "#FF7050" },
  { name: "Shipped", color: "#6366F1" }, // Added Shipped status
  { name: "Incomplete", color: "#6A717F" },
  { name: "Delivered", color: "#1884FF" },
  { name: "Canceled", color: "#FAB300" },
  { name: "Paid Returned", color: "#C71CB6" },
  { name: "Returned", color: "#DA0000" },
];

export default function OrderSummerySection() {
  // 1. Fetch real counts INCLUDING "All order" and the new "Shipped" tab
  const { data: tabCounts, isLoading: isCountsLoading } = useQuery({
    queryKey: ["order-summary-counts-dashboard"],
    queryFn: () =>
      fetchOrderCounts(["All order", ...SUMMARY_CONFIG.map((t) => t.name)]),
    refetchOnWindowFocus: true,
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["order-summary-dashboard-stats"],
    queryFn: () => dashboardApi.getStatistics("month"),
  });

  const stats = statsData?.data || statsData || {};
  const overview = stats?.overview || {};

  // 2. Process Chart Data
  const { orderSummaryData, totalOrders } = useMemo(() => {
    if (!tabCounts) return { orderSummaryData: [], totalOrders: 0 };

    const countMap = tabCounts.reduce((acc: any, curr: any) => {
      acc[curr.tab] = curr.count;
      return acc;
    }, {});

    const total = countMap["All order"] || 0;

    const mapped = SUMMARY_CONFIG.map((tab) => {
      const count = countMap[tab.name] || 0;
      return {
        name: tab.name,
        value: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: tab.color,
      };
    });

    return { orderSummaryData: mapped, totalOrders: total };
  }, [tabCounts]);

  const areaChartData = useMemo(() => {
    const perf = stats?.charts?.performance || [];
    if (perf.length > 0) {
      return perf.map((p: any) => ({
        day: p.label,
        orders: p.placed || 0,
        visitors: p.visitors || p.placed * 3 + 10,
      }));
    }
    return [];
  }, [stats]);

  if (isCountsLoading || isStatsLoading)
    return (
      <div className="h-[300px] flex items-center justify-center bg-white rounded-[8px] mt-2">
        <Loader2 className="animate-spin text-[#1DA1F2]" />
      </div>
    );

  return (
    <div className="w-full font-lato mt-2">
      <div className="bg-[#F9F9F9] rounded-[8px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-2 md:mx-4">
          {/* 1. Order Summary (Left) */}
          <div className="bg-white rounded-[8px] px-4 py-5 w-full">
            <h3 className="text-[#23272E] text-[18px] font-bold mb-5">
              Order Summary
            </h3>
            <div className="flex items-center justify-between">
              <OrderSummaryChart
                orderSummaryData={orderSummaryData}
                totalOrders={totalOrders}
              />

              {/* Legend - Automatically includes Shipped because of the map */}
              <div className="flex flex-col gap-2 flex-1 ml-4">
                {orderSummaryData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1 text-[14px] font-lato"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#000000] font-medium font-lato text-sm">
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="font-medium font-lato text-sm"
                      style={{ color: item.color }}
                    >
                      ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Visitors/Orders Chart (Middle) */}
          <div className="bg-white rounded-[8px] p-5 w-full">
            <div className="flex gap-4 mb-8">
              <button className="font-semibold font-poppins border-[#1DA1F2] pb-1 text-sm bg-[linear-gradient(6deg,#38BDF8_4.44%,#1E90FF_94.59%)] bg-clip-text text-transparent">
                Visitors
              </button>
              <button className="font-semibold font-poppins pb-1 text-sm bg-[linear-gradient(180deg,#FF6A00_0%,#FF9F1C_100%)] bg-clip-text text-transparent">
                Orders
              </button>
            </div>
            <VisitorOrderChart areaChartData={areaChartData} />
          </div>

          {/* 3. Stats Cards (Right) */}
          <div className="flex flex-col gap-4 w-full">
            {/* Card 1: Total Orders */}
            <div className="bg-white rounded-[8px] p-3 h-full">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[#23272E] font-bold text-lg">
                  Total Orders
                </span>
                <span className="text-[#6A717F] font-normal font-lato text-sm">
                  All Statuses
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#023337] text-2xl font-bold">
                  {totalOrders}
                </span>
                <span className="text-[#21C45D] font-lato text-sm font-bold mb-1 flex items-center gap-1">
                  <ArrowUp size={16} color="#1EB564" /> Live
                </span>
              </div>
            </div>

            {/* Card 2: Abandoned Leads */}
            <div className="bg-white rounded-[8px] p-3 h-full">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[#1A1A1A] font-bold text-md">
                  Incomplete Leads
                </span>
                <span className="text-[#6A717F] font-normal text-sm">
                  Abandoned Carts
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#FF6A00] text-2xl font-bold">
                  {orderSummaryData.find((d) => d.name === "Incomplete")
                    ?.value || 0}
                </span>
                <span className="text-[#6A717F] text-sm font-medium mb-1 flex items-center gap-1">
                  {orderSummaryData.find((d) => d.name === "Incomplete")
                    ?.percentage || 0}
                  % Total
                </span>
              </div>
            </div>

            {/* Card 3: Return Statistics */}
            <div className="bg-white rounded-[8px] p-3 h-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-black font-bold text-[18px]">
                  Return Performance
                </span>
                <ReturnIcon color="#DA0000" />
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[#DA0000] text-base font-bold">
                    {orderSummaryData.find((d) => d.name === "Returned")
                      ?.value || 0}
                  </span>
                  <span className="text-[#A1A1A1] text-[12px]">
                    Returned Units
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#023337] text-base font-bold">
                    {orderSummaryData.find((d) => d.name === "Confirmed")
                      ?.value || 0}
                  </span>
                  <span className="text-[#A1A1A1] text-[12px]">
                    Successfully Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
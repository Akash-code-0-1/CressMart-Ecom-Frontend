"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
// import { fetchAdminDashboardStats } from "@/api/dashboardApi";
import OverviewSection from "@/components/admin/home/OverviewSection";
import DashboardStats from "@/components/admin/home/DashboardStats";
import ProductAnalytics from "@/components/admin/home/ProductAnalytics";
import SalesAnalytics from "@/components/admin/home/SalesAnalytics";

export type TimeFilter = "Day" | "Month" | "Year" | "All Time" | "Custom";

export default function HomePageWrapper() {
  // 1. Lift State Up
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("Month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 2. Centralized API Call
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "adminDashboardStats",
      activeFilter,
      dayjs(selectedDate).format("YYYY-MM-DD"),
    ],
    queryFn: () => fetchAdminDashboardStats(activeFilter, selectedDate),
    staleTime: 1000 * 60 * 5,
  });

  // Extract data safely
  const dashboardData = data;
  console.log("dashboardData", dashboardData);
  return (
    <>
      <div className="mt-2">
        <OverviewSection
          stats={dashboardData?.overview}
          isLoading={isLoading}
          isError={isError}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <div className="mt-2 mr-0 md:mr-1">
        {/* You can now pass the same data or specific slices to other components */}
        <DashboardStats
          overview={data?.overview}
          lifecycle={data?.orderLifecycle}
          chartData={data?.charts.performance}
          isLoading={isLoading}
        />
      </div>

      <SalesAnalytics
        performanceData={data?.charts?.performance}
        categoryData={data?.charts?.salesByCategory}
        isLoading={isLoading}
      />

      <div className="mt-2 mr-0 md:mr-1 mb-4">
        <ProductAnalytics
          data={dashboardData?.products}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Clock, XCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import VisitorStatCard from "./VisitorStatCard";
import OnlineIcon from "@/components/store-front/svg/svg/OnlineIcon";
import UsersIcon from "@/components/store-front/svg/svg/UsersIcon";
import WorldIcon from "@/components/store-front/svg/svg/WorldIcon";
import OrderStatusItem from "./OrderStatusItem";
import ConfirmIcon from "@/components/store-front/svg/svg/ConfirmIcon";
import TruckIcon from "@/components/store-front/svg/svg/TruckIcon";
import DeliverdIcon from "@/components/store-front/svg/svg/DeliverdIcon";
import ReturnIcon from "@/components/store-front/svg/svg/ReturnIcon";
import {
  DashboardOverview,
  OrderLifecycle,
  PerformanceChartItem,
} from "@/types/dashboard";

interface DashboardStatsProps {
  overview?: DashboardOverview;
  lifecycle?: OrderLifecycle;
  chartData?: PerformanceChartItem[];
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  overview,
  lifecycle,
  chartData,
  isLoading,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatValue = (val?: number) =>
    isLoading ? "..." : (val?.toLocaleString() ?? "0");

  return (
    <div className="font-poppins">
      {/* Top Row: Visitors & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Visitor Stats */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <VisitorStatCard
            icon={<OnlineIcon />}
            label="Online Now"
            subtext="Active visitors on site"
            value={formatValue(overview?.onlineNow)}
            colorClass="text-[#008DFF]"
            bgClass="bg-[#C9E7FF]"
          />
          <VisitorStatCard
            icon={<UsersIcon />}
            label="Today visitors"
            subtext="Real-time traffic"
            value={formatValue(overview?.todayVisitors)}
            colorClass="text-[#FF5500]"
            bgClass="bg-[#FFDDBD]"
          />
          <VisitorStatCard
            icon={<WorldIcon />}
            label="Total visitors"
            subtext="Accumulated visits"
            value={formatValue(overview?.totalVisitors)}
            colorClass="text-[#3F34BE]"
            bgClass="bg-[#D3C9F4]"
          />
        </div>

        {/* Right Side: Recharts Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-[8px] p-5 min-h-[300px]">
          {mounted && !isLoading && (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                barGap={4}
              >
                <defs>
                  <linearGradient
                    id="placedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#1E90FF" />
                  </linearGradient>
                  <linearGradient
                    id="deliveredGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#A08BFF" />
                    <stop offset="100%" stopColor="#5943FF" />
                  </linearGradient>
                  <linearGradient
                    id="canceledGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#FF9F1C" />
                    <stop offset="100%" stopColor="#FF6A00" />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A7A7A7", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#A7A7A7", fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: "#F8FAFC" }} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "30px", fontSize: "12px" }}
                />

                <Bar
                  dataKey="placed"
                  name="Orders Placed"
                  fill="url(#placedGradient)"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="delivered"
                  name="Delivered"
                  fill="url(#deliveredGradient)"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="canceled"
                  name="Canceled"
                  fill="url(#canceledGradient)"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {isLoading && (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              Loading Charts...
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Order Status */}
      <div className="bg-white px-6 py-2 rounded-[8px] mt-2">
        <h2 className="text-base font-semibold text-black mb-2">
          Order Lifecycle
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <OrderStatusItem
            icon={<Clock color="#D4AA00" size={20} />}
            label="Pending"
            value={formatValue(lifecycle?.PENDING)}
            iconBg="bg-[#FEF3C6]"
          />
          <OrderStatusItem
            icon={<ConfirmIcon />}
            label="Confirmed"
            value={formatValue(lifecycle?.CONFIRMED)}
            iconBg="bg-[#DCFCE7]"
          />
          <OrderStatusItem
            icon={<TruckIcon />}
            label="Shipped"
            value={formatValue(lifecycle?.SHIPPED)}
            iconBg="bg-[#FFEDD5]"
          />
          <OrderStatusItem
            icon={<DeliverdIcon />}
            label="Delivered"
            value={formatValue(lifecycle?.DELIVERED)}
            iconBg="bg-[#FFD9F4]"
          />
          <OrderStatusItem
            icon={<XCircle color="#DF0800" size={20} />}
            label="Canceled"
            value={formatValue(lifecycle?.CANCELED)}
            iconBg="bg-[#FEE2E1]"
          />
          <OrderStatusItem
            icon={<ReturnIcon />}
            label="Returns"
            value={formatValue(lifecycle?.RETURNED)}
            iconBg="bg-[#DBEAFF]"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

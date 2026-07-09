// "use client";
// import React from "react";
// import SalesByCategoryChart from "./SalesByCategoryChart";
// import SalesPerformenceChart from "./SalesPerformenceChart";

// const lineData = [
//     { day: "1", placed: 0, delivered: 0, cancel: 0 },
//     { day: "5", placed: 20, delivered: 10, cancel: 2 },
//     { day: "10", placed: 30, delivered: 25, cancel: 5 },
//     { day: "15", placed: 50, delivered: 35, cancel: 12 },
//     { day: "20", placed: 40, delivered: 30, cancel: 3 },
//     { day: "25", placed: 65, delivered: 55, cancel: 3 },
//     { day: "30", placed: 85, delivered: 75, cancel: 3 },
//     { day: "31", placed: 85, delivered: 75, cancel: 3 },
// ];

// const pieData = [
//     { name: "Hair care", value: 15, color: "#5D36FF" },
//     { name: "Serum", value: 15, color: "#FAA43F" },
//     { name: "Cream", value: 15, color: "#FFBB99" },
//     { name: "Home & kitchen", value: 15, color: "#F35050" },
//     { name: "Lip care", value: 15, color: "#AEDF33" },
//     { name: "Air Conditioner", value: 15, color: "#36C5F0" },
//     { name: "Skin care", value: 15, color: "#A155B9" },
// ];

// const SalesAnalytics: React.FC = () => {
//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2 font-poppins mr-1">

//             {/* 1. Sale Performance (Line Chart) */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-[8px]">
//                 <div className="flex flex-col gap-4 mb-6">
//                     <h2 className="text-[18px] font-lato font-bold text-black">Sale Performance</h2>
//                     <div className="flex gap-6 text-[12px] font-semibold">
//                         <span className="text-[#38BDF8]">Placed Order</span>
//                         <span className="text-[#FB923C]">Order Delivered</span>
//                         <span className="text-[#EF4444]">Order Cancel</span>
//                     </div>
//                 </div>

//                 <SalesPerformenceChart lineData={lineData} />

//             </div>

//             {/* 2. Sale By Category (Doughnut Chart) */}
//             <div className="bg-white p-6 rounded-[8px] overflow-hidden">
//                 <h2 className="text-[18px] font-lato font-bold text-black mb-6">Sale By Category</h2>

//                 <SalesByCategoryChart pieData={pieData} />

//                 {/* Legend: Updated to match color of percentage to slice color */}
//                 <div className="grid grid-cols-2 gap-y-3 mt-4">
//                     {pieData.map((item, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                             <div
//                                 className="w-2.5 h-2.5 rounded-full shrink-0"
//                                 style={{ backgroundColor: item.color }}
//                             />
//                             <span className="text-[11px] font-medium text-gray-800 whitespace-nowrap">
//                                 {item.name}
//                                 <span
//                                     className="font-bold ml-0.5"
//                                     style={{ color: item.color }}
//                                 >
//                                     ({item.value}%)
//                                 </span>
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default SalesAnalytics;

"use client";
import React from "react";
import SalesByCategoryChart from "./SalesByCategoryChart";
import SalesPerformenceChart from "./SalesPerformenceChart";
// import { PerformanceChartItem } from "@/types/dashboard";

// Define a type for the Category data based on your UI needs
interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

interface SalesAnalyticsProps {
  performanceData?: PerformanceChartItem[];
  categoryData?: CategoryData[];
  isLoading?: boolean;
}

// Default colors for the pie chart categories
const CATEGORY_COLORS = [
  "#5D36FF",
  "#FAA43F",
  "#FFBB99",
  "#F35050",
  "#AEDF33",
  "#36C5F0",
  "#A155B9",
];

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  performanceData = [],
  categoryData = [],
  isLoading,
}) => {
  // Transform performance data if keys don't match exactly (API uses 'label', 'canceled')
  const formattedLineData = performanceData.map((item) => ({
    day: item.label,
    placed: item.placed,
    delivered: item.delivered,
    cancel: item.canceled, // mapping 'canceled' from API to 'cancel' for your chart
  }));

  // Attach colors to category data if not present
  const formattedPieData = categoryData.map((item, index) => ({
    ...item,
    color: item.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2 font-poppins mr-1">
      {/* 1. Sale Performance (Line Chart) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-[8px]">
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-[18px] font-lato font-bold text-black">
            Sale Performance
          </h2>
          <div className="flex gap-6 text-[12px] font-semibold">
            <span className="text-[#38BDF8]">Placed Order</span>
            <span className="text-[#FB923C]">Order Delivered</span>
            <span className="text-[#EF4444]">Order Cancel</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center text-gray-400">
            Loading Chart...
          </div>
        ) : (
          <SalesPerformenceChart lineData={formattedLineData} />
        )}
      </div>

      {/* 2. Sale By Category (Doughnut Chart) */}
      <div className="bg-white p-6 rounded-[8px] overflow-hidden">
        <h2 className="text-[18px] font-lato font-bold text-black mb-6">
          Sale By Category
        </h2>

        {formattedPieData.length > 0 ? (
          <>
            <SalesByCategoryChart pieData={formattedPieData} />
            <div className="grid grid-cols-2 gap-y-3 mt-4">
              {formattedPieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-medium text-gray-800 whitespace-nowrap">
                    {item.name}
                    <span
                      className="font-bold ml-0.5"
                      style={{ color: item.color }}
                    >
                      ({item.value}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-gray-400">
            <p>No Category Data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;

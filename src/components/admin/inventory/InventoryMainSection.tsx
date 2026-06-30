"use client";
import { AlertTriangle } from "lucide-react";
import { StatCard } from "../common/StatCard";
import SearchBar from "../common/SearchBar";
import SelectTrigger from "../common/SelectTrigger";
import DataTable from "../common/DataTable";
import GrowIcon from "@/components/store-front/svg/svg/GrowIcon";
import HandBoxicon from "@/components/store-front/svg/svg/HandBoxicon";
import ProductIcon from "@/components/store-front/svg/svg/sidebar-icon/ProductIcon";
import InventroyGrowIcon from "@/components/store-front/svg/svg/InventroyGrowIcon";
interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  price?: number;
  expireIn?: string;
  stock: number;
  status: "Publish" | "Unpublish";
}

const stockData: InventoryItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: `stock-${i}`,
  productName:
    "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
  category: "Toy",
  price: 100,
  stock: 5 + i,
  status: "Publish",
}));

const expireData: InventoryItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `expire-${i}`,
  productName:
    "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
  category: "Toy",
  expireIn: `${35 + i * 10} Days`,
  stock: 5,
  status: "Publish",
}));

const InventoryMainSection = () => {
  const stockColumns = [
    {
      header: "Product",
      key: "productName",
      render: (item: InventoryItem) => (
        <span className="text-[13px] font-medium text-gray-800 leading-tight block max-w-[300px]">
          {item.productName}
        </span>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.category}</span>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.price}</span>
      ),
    },
    {
      header: "Stock",
      key: "stock",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.stock}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item: InventoryItem) => (
        <div className="bg-[#C1FFBC] text-[#085E00] text-[11px] font-bold px-3 py-1 rounded-full w-fit">
          {item.status}
        </div>
      ),
    },
  ];

  const expireColumns = [
    {
      header: "Product",
      key: "productName",
      render: (item: InventoryItem) => (
        <span className="text-[13px] font-medium text-gray-800 leading-tight block max-w-[300px]">
          {item.productName}
        </span>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.category}</span>
      ),
    },
    {
      header: "Expire in",
      key: "expireIn",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.expireIn}</span>
      ),
    },
    {
      header: "Stock",
      key: "stock",
      render: (item: InventoryItem) => (
        <span className="text-sm">{item.stock}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item: InventoryItem) => (
        <div className="bg-[#C1FFBC] text-[#085E00] text-[11px] font-bold px-3 py-1 rounded-full w-fit">
          {item.status}
        </div>
      ),
    },
  ];

  const statsConfig = [
    {
      title: "Products",
      val: "45",
      sub: "Category wise",
      icon: ProductIcon,
      textColor: "text-gray-400",
      bgColor: "bg-[#F9F9F9]",
    },
    {
      title: "Total unit on hand",
      val: "730",
      sub: "Products entire shop",
      icon: HandBoxicon,
      textColor: "text-blue-400",
      bgColor: "bg-[#F9F9F9]",
    },
    {
      title: "Low stock",
      val: "15",
      sub: "0 out / 0 low (<5)",
      icon: AlertTriangle,
      textColor: "text-red-500",
      bgColor: "bg-[#F9F9F9]",
    },
    {
      title: "Capital value",
      val: "৳ 1,20,000",
      sub: "Cost Price",
      icon: GrowIcon,
      textColor: "text-green-500",
      bgColor: "bg-[#F9F9F9]",
    },
    {
      title: "Inventory value",
      val: "৳ 1,50,000",
      sub: "Selling Price",
      icon: InventroyGrowIcon,
      textColor: "text-orange-500",
      bgColor: "bg-[#F9F9F9]",
    },
  ];

  return (
    <div className="w-full bg-[#F9F9F9] font-lato min-h-screen">
      <div className="bg-white p-5 rounded-[8px_8px_0_0] mt-2">
        <h1 className="text-[22px] font-bold text-[#023337] mb-6">Inventory</h1>

        {/* Summary Stats Cards using the reusable component */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {statsConfig.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              val={stat.val}
              sub={stat.sub}
              icon={stat.icon}
              textColor={stat.textColor}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 font-poppins">
          <SearchBar placeholder="Product Name" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B7B7B] font-normal">Sort by</span>
            <SelectTrigger label="Stock low to high" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-black font-normal">
              Set the low stock threshold at
            </span>
            <div className="bg-[#F9FAFB] rounded-[8px] px-4 py-2.5 w-16 text-center text-sm font-normal text-[#B7B7B7]">
              5
            </div>
            <span className="text-xs text-black font-normal">Unit</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-black font-normal">
              Set the Low Expire threshold at
            </span>
            <div className="bg-[#F9FAFB] rounded-[8px] px-4 py-2.5 w-16 text-center text-sm font-normal text-[#B7B7B7]">
              10
            </div>
            <span className="text-xs text-black font-normal">Days</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-white">
        {/* Left Column: Tables */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="bg-white rounded-[8px] overflow-hidden">
            <DataTable
              data={stockData}
              columns={stockColumns}
              rowKey="id"
              gradiant={true}
            />
          </div>

          <div className="bg-white rounded-[8px] overflow-hidden">
            <DataTable
              data={expireData}
              columns={expireColumns}
              rowKey="id"
              gradiant={true}
            />
          </div>
        </div>

        {/* Right Column: Alerts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Inventory Alerts Card */}
          <div className="bg-white rounded-[8px] p-6 h-fit shadow-[0_4px_5px_0_rgba(0,0,0,0.11)] min-h-[308px]">
            <h3 className="text-lg font-medium font-poppins text-[#000000] mb-1">
              Inventory alerts
            </h3>
            <p className="text-xs font-medium font-poppins text-[#979797] mb-6">
              Review the most critical SKUs and plan replenishment
            </p>
            <div className="bg-[#ECFDF5] text-[#00A557] p-5 rounded-[8px] text-center font-medium font-poppins text-[12px]">
              Inventory looks healthy: No low-stock items.
            </div>
          </div>

          {/* Expired Date Alerts Card */}
          <div className="bg-white rounded-[8px] p-6 h-fit shadow-[0_4px_5px_0_rgba(0,0,0,0.11)] min-h-[308px]">
            <h3 className="text-lg font-medium font-poppins text-[#000000] mb-1">
              Expired Date alerts
            </h3>
            <p className="text-xs font-medium font-poppins text-[#979797] mb-6">
              Review the most critical SKUs and plan replenishment
            </p>
            <div className="bg-[#ECFDF5] text-[#00A557] p-5 rounded-[8px] text-center font-medium font-poppins text-[12px]">
              Inventory looks healthy: No Close to Expiry
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMainSection;

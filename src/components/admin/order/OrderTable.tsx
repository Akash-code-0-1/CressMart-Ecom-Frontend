"use client";
import { useState } from "react";
import { Search, ArrowUpDown, MoreVertical } from "lucide-react";

import TableTabs from "./TableTabs";
import Image from "next/image";
import { TableColumn, Order } from "@/@types/order.type";
import TrackIcon from "@/components/store-front/svg/svg/TrackIcon";
import DataTable from "../common/DataTable";
import Pagination2 from "../common/Pagination2";
import ThreeBarIcon from "@/components/store-front/svg/svg/ThreeBarIcon";

//  Define columns and their specific designs here
const columns: TableColumn<Order>[] = [
  {
    header: "No.",
    key: "id",
    className: "w-[50px] xl:w-[70px]",
    render: (order) => (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
        />
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {order.id}
        </span>
      </div>
    ),
  },
  {
    header: "Order Id",
    key: "orderId",
    render: (order) => (
      <span className="text-[13px] xl:text-[15px] text-black">
        #{order.orderId}
      </span>
    ),
  },
  {
    header: "Product",
    key: "product",
    render: (order) => (
      <div className="flex items-center gap-2 xl:gap-3 max-w-[150px] 2xl:max-w-none">
        <Image
          src="/images/products/product.png"
          alt={order.product}
          width={40}
          height={40}
          className="border border-[#E5E7EB] p-[5px] rounded-[8px]"
        />
        <span
          className="text-[15px] text-black font-normal truncate"
          title={order.product}
        >
          {order.product}
        </span>
      </div>
    ),
  },
  {
    header: "Customer",
    key: "customerName",
    render: (order) => (
      <>
        <span className="text-[13px] xl:text-[15px] font-medium text-black block truncate max-w-[100px] xl:max-w-none">
          {order.customerName}
        </span>
        <span className="text-[11px] xl:text-[15px] text-black block">
          {order.customerPhone}
        </span>
      </>
    ),
  },
  {
    header: "Date",
    key: "date",
    className: "whitespace-nowrap",
    render: (order) => (
      <>
        <span className="text-[15px] text-black block">{order.date}</span>
        <span className="text-[15px] text-black block">{order.time}</span>
      </>
    ),
  },
  {
    header: "Price",
    key: "price",
    render: (order) => (
      <span className="text-[15px] font-normal text-black">{order.price}</span>
    ),
  },
  {
    header: "Payment",
    key: "payment",
    render: (order) => (
      <div className="flex items-center gap-1.5 text-[15px] font-normal">
        <div className="w-[8px] h-[8px] rounded-full bg-[#FF6A00] shrink-0" />
        <span className="truncate">{order.payment}</span>
      </div>
    ),
  },
  {
    header: "Fraud Checker",
    key: "fraudStatus",
    className: "whitespace-nowrap",
    render: (order) => (
      <>
        <span
          className="text-[15px] font-bold"
          style={{ color: fraudColor[order.fraudStatus] }}
        >
          {order.fraudStatus}
        </span>
        <span className="text-[15px] font-normal text-black">
          ({order.fraudScore}%)
        </span>
      </>
    ),
  },
  {
    header: "Status",
    key: "status",
    render: (order) => (
      <div className="flex items-center gap-1.5 text-[#26007F] w-fit">
        <TrackIcon />
        <span className="text-[15px] text-[#26007F] font-normal">
          {order.status}
        </span>
      </div>
    ),
  },
  {
    header: "Action",
    key: "action",
    render: () => (
      <button className="text-black p-1 transition-colors">
        <MoreVertical size={20} />
      </button>
    ),
  },
];

const orders = [
  {
    id: 1,
    orderId: "OR1250",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Safe" as FraudStatus,
    fraudScore: 80,
    status: "Pending",
  },
  {
    id: 2,
    orderId: "OR1249",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
  {
    id: 3,
    orderId: "OR1248",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Mediam" as FraudStatus,
    fraudScore: 50,
    status: "Pending",
  },
  {
    id: 4,
    orderId: "OR1247",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
  {
    id: 5,
    orderId: "OR1246",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
  {
    id: 6,
    orderId: "OR1245",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
  {
    id: 7,
    orderId: "OR1244",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
  {
    id: 8,
    orderId: "OR1243",
    product: "Wireless Bluetooth Headphones",
    customerName: "Imam Hoshen Ornob",
    customerPhone: "+88 01788-888888",
    date: "01-01-2025",
    time: "06:32 PM",
    price: "49.99",
    payment: "COD",
    fraudStatus: "Risky" as FraudStatus,
    fraudScore: 20,
    status: "Pending",
  },
];

const tabs = [
  "All order (240)",
  "Pending (240)",
  "Delivered (240)",
  "Canceled (240)",
  "Returned (240)",
];

const fraudColor = {
  Safe: "#085E00",
  Risky: "#DA0000",
  Mediam: "#FF9F1C",
} as const;

type FraudStatus = keyof typeof fraudColor;

const OrderTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="w-full min-h-screen font-lato">
      <div className="bg-white rounded-[8px] mt-4">
        {/* Top Control Panel */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs row - allow horizontal scroll on very small screens if tabs are many */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <TableTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Search + filter row */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Search Input Container */}
            <div className="relative flex-grow lg:flex-grow-0 w-full lg:w-[240px] xl:w-[316px] font-lato">
              <input
                type="text"
                placeholder="Search order report"
                className="w-full bg-[#F9FAFB] rounded-[8px] py-2.5 pl-4 pr-10 text-[14px] text-black placeholder:text-[#6A717F] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/30 focus:border-[#1DA1F2] transition-all"
              />
              <Search
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]"
                size={20}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="cursor-pointer p-2.5 bg-white border border-[#D1D5DB] rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm">
                <ThreeBarIcon color="#4B5563" />
              </button>
              <button className="cursor-pointer p-2.5 bg-white border border-[#D1D5DB] rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm">
                <ArrowUpDown color="#4B5563" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* table container */}
        <DataTable data={orders} columns={columns} rowKey="id" />
        {/* ── Pagination ── */}
        <div className="py-5">
          <Pagination2
            currentPage={activePage}
            totalPages={20}
            onPageChange={(page) => setActivePage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderTable;

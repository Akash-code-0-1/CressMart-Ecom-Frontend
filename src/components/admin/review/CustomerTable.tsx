"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import DataTable from "../common/DataTable";
import Pagination from "../common/Pagination";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface CustomerItem {
  id: number;
  sl: number;
  image: string;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive" | "Blocked";
}

const customerMockData: CustomerItem[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: index + 1,
    sl: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : 4,
    image: "/images/products/product2.png",
    name: "Imam Hoshen Omor",
    phone: "01612-854654",
    email: "ornob423@gmail.com",
    status: index === 1 ? "Inactive" : index === 2 ? "Blocked" : "Active",
  }),
);

export default function CustomerTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === customerMockData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customerMockData.map((item) => item.id));
    }
  };

  const columns: TableColumn<CustomerItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[45px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={
            selectedIds.length === customerMockData.length &&
            customerMockData.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      render: (item) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {item.sl}
        </span>
      ),
    },
    {
      header: "Image",
      key: "image",
      render: (item) => (
        <div className="flex items-center">
          <Image
            src={item.image}
            alt={item.name}
            width={45}
            height={45}
            className="rounded-[8px] object-cover"
          />
        </div>
      ),
    },
    {
      header: "Name",
      key: "name",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal block max-w-[180px] truncate">
          {item.name}
        </span>
      ),
    },
    {
      header: "Contact",
      key: "contact",
      render: (item) => (
        <div className="flex flex-col text-[14px] text-black font-normal">
          <span>{item.phone}</span>
          <span className="text-gray-500 text-[13px]">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item) => {
        let badgeClass = "bg-[#C1FFBC] text-[#085E00]"; // Active
        if (item.status === "Inactive")
          badgeClass = "bg-[#D4D2FF] text-[#583FC7]";
        if (item.status === "Blocked")
          badgeClass = "bg-[#FFE1E1] text-[#DA0000]";

        return (
          <div
            className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${badgeClass}`}
          >
            {item.status}
          </div>
        );
      },
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

  return (
    <div className="bg-white font-poppins">
      <DataTable
        data={customerMockData}
        columns={columns}
        rowKey="id"
        gradiant={true}
      />
      <div className="py-5">
        <Pagination
          currentPage={1}
          totalPages={24}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </div>
  );
}

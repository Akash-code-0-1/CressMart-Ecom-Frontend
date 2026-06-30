"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import DataTable from "../../common/DataTable";
import Pagination from "../../common/Pagination";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface BrandItem {
  id: number;
  sl: number;
  image: string;
  brandName: string;
  products: number;
  priority: number;
  status: "Publish" | "Draft";
}

const brands: BrandItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  sl: index + 1,
  image: "/images/products/product2.png",
  brandName: "Toy",
  products: 5,
  priority: 100,
  status: index === 7 ? "Draft" : "Publish", // Row 8 is set to Draft to match image_519f01.png
}));

export default function BrandTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === brands.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(brands.map((item) => item.id));
    }
  };

  const columns: TableColumn<BrandItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[45px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.length === brands.length && brands.length > 0}
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
      header: "Image/icon",
      key: "image",
      render: (item) => (
        <div className="flex items-center">
          <Image
            src={item.image}
            alt={item.brandName}
            width={45}
            height={45}
            className="rounded-[8px] object-cover"
          />
        </div>
      ),
    },
    {
      header: "Brand Name",
      key: "brandName",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {item.brandName}
        </span>
      ),
    },
    {
      header: "Products",
      key: "products",
      render: (item) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {item.products}
        </span>
      ),
    },
    {
      header: "Priority",
      key: "priority",
      render: (item) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {item.priority}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item) => (
        <div
          className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
            item.status === "Publish"
              ? "bg-[#C1FFBC] text-[#085E00]"
              : "bg-[#FFE2C1] text-[#A65E00]" // Matches style configuration for Draft item
          }`}
        >
          {item.status}
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

  return (
    <div className="bg-white font-poppins">
      <DataTable data={brands} columns={columns} rowKey="id" gradiant={true} />

      <div className="py-5 md:mx-10 mx-2">
        <Pagination
          currentPage={1}
          totalPages={24}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </div>
  );
}

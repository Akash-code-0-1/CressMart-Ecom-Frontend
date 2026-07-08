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

interface CategoryItem {
  id: number;
  sl: number;
  image: string;
  name: string;
  products: number;
  status: "Publish" | "Unpublish";
}

const categories: CategoryItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  sl: index + 1,
  image: "/images/products/product2.png",
  name: "Toy",
  products: 5,
  status: "Publish",
}));

export default function CategoryTable() {
  // Selection state tracking via unique IDs
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((item) => item.id));
    }
  };

  const categoryColumns: TableColumn<CategoryItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[40px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={
            selectedIds.length === categories.length && categories.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      render: (category) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(category.id)}
          onChange={() => handleSelectRow(category.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (category) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {category.sl}
        </span>
      ),
    },
    {
      header: "Image/icon",
      key: "image",
      render: (category) => (
        <div className="flex items-center">
          <Image
            src={category.image}
            alt={category.name}
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
      render: (category) => (
        <span
          className="text-[15px] text-[#1D1A1A] font-normal block max-w-[300px]"
          title={category.name}
        >
          {category.name}
        </span>
      ),
    },
    {
      header: "Products",
      key: "products",
      render: (category) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {category.products}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (category) => (
        <div
          className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
            category.status === "Publish"
              ? "bg-[#C1FFBC] text-[#085E00]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {category.status}
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
      <DataTable
        data={categories}
        columns={categoryColumns}
        rowKey="id"
        gradiant={true}
      />

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

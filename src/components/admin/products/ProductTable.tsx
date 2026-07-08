"use client";

import React, { useState } from "react";
import { TableColumn } from "@/@types/order.type";
import { Product } from "@/@types/product.type";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import DataTable from "../common/DataTable";
import Pagination from "../common/Pagination";

interface ExtendedTableColumn<T> extends TableColumn<T> {
  headerRender?: () => React.ReactNode;
  headerClassName?: string;
}

const products: Product[] = [
  {
    id: 1,
    sl: 110,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 57,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 2,
    sl: 109,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 80,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 3,
    sl: 108,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 61,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 4,
    sl: 107,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 75,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 5,
    sl: 106,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 57,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 6,
    sl: 105,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 69,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 7,
    sl: 104,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 90,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 8,
    sl: 103,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 61,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 9,
    sl: 102,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 57,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
  {
    id: 10,
    sl: 101,
    image: "/images/products/product2.png",
    name: "Motorcycle Toy [Motorbike Model Showpiece for Boys, Gift for Kids]",
    category: "Watch",
    subCategory: "Mans Watch",
    priority: 51,
    sku: "pr123456",
    tags: "New Arrival",
    status: "Publish",
  },
];

export default function ProductTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((product) => product.id));
    }
  };

  const productColumns: ExtendedTableColumn<Product>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[40px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer inline-block vertical-middle"
          checked={
            selectedIds.length === products.length && products.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      render: (product) => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#EAF8E7] accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.includes(product.id)}
          onChange={() => handleSelectRow(product.id)}
        />
      ),
    },
    {
      header: "SL",
      key: "sl",
      render: (product) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {product.sl}
        </span>
      ),
    },
    {
      header: "Image",
      key: "image",
      render: (product) => (
        <div className="flex items-center">
          <Image
            src={product.image}
            alt={product.name}
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
      render: (product) => (
        <span
          className="text-[15px] text-[#1D1A1A] font-normal block max-w-[300px]"
          title={product.name}
        >
          {product.name}
        </span>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.category}
        </span>
      ),
    },
    {
      header: "Sub Category",
      key: "subCategory",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.subCategory}
        </span>
      ),
    },
    {
      header: "Priority",
      key: "priority",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.priority}%
        </span>
      ),
    },
    {
      header: "SKU",
      key: "sku",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.sku}
        </span>
      ),
    },
    {
      header: "Tags",
      key: "tags",
      render: (product) => (
        <span className="text-[13px] xl:text-[15px] text-black font-normal">
          {product.tags}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (product) => (
        <div
          className={`px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
            product.status === "Publish"
              ? "bg-[#C1FFBC] text-[#085E00]"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {product.status}
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
        data={products}
        columns={productColumns}
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

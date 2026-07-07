"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Star } from "lucide-react";
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

interface ReviewItem {
  id: number;
  sl: number;
  image: string;
  name: string;
  star: number;
}

const reviewMockData: ReviewItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  sl: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : 4,
  image: "/images/products/product2.png",
  name: index < 5 ? "Imam Hoshen" : "Imam Hoshen Omor",
  star: index === 0 || index === 1 ? 5 : index === 2 ? 3 : 1,
}));

export default function ReviewTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === reviewMockData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviewMockData.map((item) => item.id));
    }
  };

  const columns: TableColumn<ReviewItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[45px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={
            selectedIds.length === reviewMockData.length &&
            reviewMockData.length > 0
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
      header: "SI",
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
        <span className="text-[15px] text-[#1D1A1A] font-normal block max-w-[150px] truncate">
          {item.name}
        </span>
      ),
    },
    {
      header: "Star",
      key: "star",
      render: (item) => {
        let badgeClass = "bg-[#DCEFFF] text-[#32B2FA]";
        if (item.star === 3) badgeClass = "bg-[#FFDDC1] text-[#FE7405]";
        if (item.star === 1) badgeClass = "bg-[#FFD0D0] text-[#DA0000]";

        return (
          <div
            className={`px-3 py-1 rounded-full text-[14px] font-semibold max-w-[64px] flex items-center justify-center gap-1 ${badgeClass}`}
          >
            <span>{item.star}</span> <Star size={14} fill="currentColor" />
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
        data={reviewMockData}
        columns={columns}
        rowKey="id"
        gradiant={true}
      />
      <div className="py-5">
        <Pagination
          currentPage={1}
          totalPages={8}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
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

interface TagItem {
  id: number;
  sl: number;
  tagName: string;
  products: number;
  priority: number;
  status: "Publish" | "Unpublish";
}

const tags: TagItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  sl: index + 1,
  tagName: "Flash Sale",
  products: 5,
  priority: 100,
  status: "Publish",
}));

export default function TagTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tags.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tags.map((item) => item.id));
    }
  };

  const columns: TableColumn<TagItem>[] = [
    {
      header: "",
      key: "checkbox-selection",
      headerClassName: "w-[45px]",
      headerRender: () => (
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#023337]/30 accent-[#1DA1F2] cursor-pointer"
          checked={selectedIds.length === tags.length && tags.length > 0}
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
      header: "Tag Name",
      key: "tagName",
      render: (item) => (
        <span className="text-[15px] text-[#1D1A1A] font-normal">
          {item.tagName}
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
              : "bg-gray-100 text-gray-500"
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
      <DataTable data={tags} columns={columns} rowKey="id" gradiant={true} />

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

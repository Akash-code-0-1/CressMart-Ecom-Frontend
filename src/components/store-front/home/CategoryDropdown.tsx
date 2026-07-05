"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "../svg/ChevronDownIcon";

interface CategoryDropdownProps {
  categories: string[];
  mobile?: boolean;
}

const CategoryDropdown = ({
  categories,
  mobile = false,
}: CategoryDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative shrink-0"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span
          className={`text-black text-sm font-medium whitespace-nowrap ${
            mobile ? "hidden sm:block" : ""
          }`}
        >
          All Categories
        </span>

        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-[8px] border border-[#E2E2E2] shadow-lg z-[9999] overflow-hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                console.log(category);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-[14px] text-[#5E5E5E] hover:bg-[#F9F9F9] hover:text-[#FF7050] transition-all"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
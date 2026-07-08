"use client";
import { usePathname, useRouter } from "next/navigation";
import { Shapes, Hash } from "lucide-react";
import TabItem from "./TabItem";
import SubCategroyIcon from "@/components/store-front/svg/svg/SubCategroyIcon";
import BrandIcon from "@/components/store-front/svg/svg/BrandIcon";

const CategoryNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      id: "category",
      label: "Category(30)",
      path: "/dashboard/category",
      icon: Shapes,
    },
    {
      id: "sub-category",
      label: "Sub Category",
      path: "/dashboard/sub-category",
      icon: SubCategroyIcon,
    },
    {
      id: "child-category",
      label: "Child Category",
      path: "/dashboard/child-category",
      icon: SubCategroyIcon,
    },
    { id: "brand", label: "Brand", path: "/dashboard/brand", icon: BrandIcon },
    { id: "tags", label: "Tags", path: "/dashboard/tag", icon: Hash },
  ];

  return (
    <div className="w-full bg-white mt-8 mb-2">
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto flex-nowrap scrollbar-none pb-px">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={pathname === tab.path}
            onClick={() => router.push(tab.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;

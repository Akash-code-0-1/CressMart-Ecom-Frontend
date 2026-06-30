"use client";
import { usePathname, useRouter } from "next/navigation";
import { Shapes } from "lucide-react";
import TabItem from "../catalog/TabItem";
import SubCategroyIcon from "@/components/store-front/svg/svg/SubCategroyIcon";

export default function ContentNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      id: "carousel",
      label: "Carousel",
      path: "/dashboard/carousel",
      icon: Shapes,
    },
    {
      id: "banner",
      label: "Banners",
      path: "/dashboard/banner",
      icon: SubCategroyIcon,
    },
    {
      id: "popup",
      label: "Popups",
      path: "/dashboard/popup",
      icon: SubCategroyIcon,
    },
  ];

  return (
    <div className="w-full bg-white mt-3 pb-5 mb-2">
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
}

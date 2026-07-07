"use client";

import { useState } from "react";
import { Ban, Repeat, Star, User } from "lucide-react";
import Header from "@/components/admin/common/Header";
import ReviewHead from "@/components/admin/review/ReviewHead";
import { StatCard } from "@/components/admin/common/StatCard";
import CustomersReviewsMainSection from "@/components/admin/review/CustomersReviewsMainSection";
import Sidebar from "@/components/admin/common/Sidebar";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsData = [
    {
      title: "Customer",
      val: "45",
      sub: "Total user",
      icon: User,
      iconBgColor: "bg-gradient-to-r from-[#38BDF8] to-[#1E90FF]",
      bgColor: "bg-[#F1F9FF]",
      textColor: "text-white",
    },
    {
      title: "Review",
      val: "45",
      sub: "Consumers review",
      icon: Star,
      iconBgColor: "bg-gradient-to-b from-[#FF6A00] to-[#FF9F1C] bg-white",
      bgColor: "bg-[#FFF7F1]",
      textColor: "text-white",
    },
    {
      title: "Recurring customers",
      val: "23",
      sub: "Repeat customers",
      icon: Repeat,
      iconBgColor: "bg-[#085E00]",
      bgColor: "bg-[#F1FFEF]",
      textColor: "text-white",
    },
    {
      title: "Blocked",
      val: "2",
      sub: "Blocked users",
      icon: Ban,
      iconBgColor: "bg-[#DA0000]",
      bgColor: "bg-[#FFF7F1]",
      textColor: "text-white",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1">
        <div className="p-2 md:p-0">
          <div className="bg-white">
            <ReviewHead />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full p-4 bg-white mb-4">
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  val={stat.val}
                  sub={stat.sub}
                  icon={stat.icon}
                  iconBgColor={stat.iconBgColor}
                  bgColor={stat.bgColor}
                  textColor={stat.textColor}
                />
              ))}
            </div>
            <CustomersReviewsMainSection />
          </div>
        </div>
      </main>
    </div>
  );
}

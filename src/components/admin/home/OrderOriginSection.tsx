"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedin, 
  FaGoogle, 
  FaWhatsapp 
} from "react-icons/fa";
import { SiCodefactor } from "react-icons/si"; 
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { fetchSettings } from "@/services-api/settingsService";

const sourceConfig: Record<string, { color: string; icon: any }> = {
  facebook: { color: "#1877F2", icon: FaFacebook },
  instagram: { color: "url(#instaGradient)", icon: FaInstagram },
  youtube: { color: "#FF0000", icon: FaYoutube },
  linkedin: { color: "#0077B5", icon: FaLinkedin },
  google: { color: "#5C7ABD", icon: FaGoogle },
  whatsapp: { color: "#4ADE80", icon: FaWhatsapp },
  direct: { color: "#FF7050", icon: SiCodefactor }, 
  own: { color: "#FF7050", icon: SiCodefactor },    
};

/**
 * Enhanced Icon Renderer
 */
const getIcon = (name: string, faviconUrl: string) => {
  const safeName = (name || "").toLowerCase();
  
  // Logic for Direct / Own (Using the dynamic favicon)
  if (safeName === "direct" || safeName === "own" || safeName === "others") {
    return (
      <div className="flex items-center justify-center w-6 h-6">
        <img 
          src={faviconUrl} 
          alt="Site Icon" 
          className="w-5 h-5 object-contain"
          onError={(e) => {
              // Fallback to a dot or SiCodefactor if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) parent.innerHTML = '<div style="color: #FF7050; font-size: 18px;">●</div>';
          }} 
        />
      </div>
    );
  }

  // Logic for Social Media Icons
  const config = sourceConfig[safeName] || sourceConfig.direct;
  const Icon = config.icon;

  if (!Icon) return <SiCodefactor size={18} color="#FF7050" />;

  const iconColor = safeName === 'instagram' ? "#E4405F" : config.color;
  return (
    <div className="flex items-center justify-center w-6 h-6">
      <Icon size={18} color={iconColor} />
    </div>
  );
};

/**
 * Recharts Custom Tick Component
 * Note: Recharts passes x, y, and payload automatically. 
 * We pass faviconUrl via a closure in the XAxis.
 */
const CustomTick = (props: any) => {
  const { x, y, payload, faviconUrl } = props;
  return (
    <foreignObject x={x - 12} y={y + 8} width={24} height={24}>
        <div className="flex items-center justify-center w-full h-full">
            {getIcon(payload.value, faviconUrl)}
        </div>
    </foreignObject>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg font-poppins">
        <p className="text-sm font-bold text-gray-800 mb-1">{data.name}</p>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-500">
            Sales: <span className="text-[#FF7050] font-bold">${Number(data.value).toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-500">
            Orders: <span className="text-black font-bold">{data.count}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

interface OrderOriginProps {
  activeFilter: string;
  selectedDate: Date;
}

const OrderOriginSection = ({ activeFilter, selectedDate }: OrderOriginProps) => {
  // 1. Fetch Stats Data
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["order-origin-stats", activeFilter, selectedDate.toISOString()],
    queryFn: async () => {
      const res = await apiFetch(
        `/orders/stats/origin?filter=${activeFilter}&date=${selectedDate.toISOString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch origin stats");
      const json = await res.json();
      return Array.isArray(json) ? json : json.data || [];
    },
  });

  // 2. Fetch Settings for Favicon
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  // 3. Robust Favicon URL Logic
  const faviconUrl = useMemo(() => {
    const info = settings?.data || settings;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
    
    if (info?.favicon) {
      if (info.favicon.startsWith('http')) return info.favicon;
      
      // Clean up the path to prevent double slashes or duplicated folders
      const cleanPath = info.favicon
        .replace("/uploads/settings/", "")
        .replace(/^\/+/, "");
        
      return `${baseUrl}/uploads/settings/${cleanPath}`;
    }
    return "/favicon.ico";
  }, [settings]);

  const chartData = Array.isArray(statsData) ? statsData : [];

  return (
    <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm w-full min-h-[320px] font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1F2937]">Order origin</h3>
        {/* <button className="text-[#3B82F6] text-xs font-medium hover:underline cursor-pointer">
          All product
        </button> */}
      </div>

      <div className="h-[240px] w-full relative">
        {isStatsLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-[#FF7050] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="absolute left-[-35px] top-1/2 -rotate-90 text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
          Sell
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="instaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#833AB4" />
                <stop offset="50%" stopColor="#FD1D1D" />
                <stop offset="100%" stopColor="#FCB045" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              // Passing the faviconUrl into the custom tick component
              tick={(tickProps) => <CustomTick {...tickProps} faviconUrl={faviconUrl} />}
              interval={0}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              domain={[0, 'auto']}
            />
            <Tooltip 
               cursor={{ fill: 'transparent' }}
               content={<CustomTooltip />}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
              {chartData.map((entry: any, index: number) => {
                const sourceKey = (entry.name || "direct").toLowerCase();
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={sourceConfig[sourceKey]?.color || "#FF7050"} 
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderOriginSection;
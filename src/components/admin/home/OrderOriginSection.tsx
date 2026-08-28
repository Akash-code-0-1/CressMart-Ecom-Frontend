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
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { fetchSettings } from "@/services-api/settingsService";
import { extractImageUrl } from "@/utils/image";

/**
 * Config for colors and icons. 
 * Icons are omitted for Direct/Own to trigger the Primary Logo logic.
 */
const sourceConfig: Record<string, { color: string; icon?: any }> = {
  facebook: { color: "#1877F2", icon: FaFacebook },
  instagram: { color: "url(#instaGradient)", icon: FaInstagram },
  youtube: { color: "#FF0000", icon: FaYoutube },
  linkedin: { color: "#0077B5", icon: FaLinkedin },
  google: { color: "#5C7ABD", icon: FaGoogle },
  whatsapp: { color: "#4ADE80", icon: FaWhatsapp },
  direct: { color: "#FF7050" }, 
  own: { color: "#FF7050" },    
  others: { color: "#FF7050" }, 
};

/**
 * Logic to render either Social Icon or the Primary Logo
 */
const getIcon = (name: string, primaryLogoUrl: string) => {
  const safeName = (name || "").toLowerCase().trim();
  
  // Sources that should use the Primary Logo
  const logoSources = ["direct", "own", "others", "site", "system", "other", "direct traffic"];
  const isLogoSource = logoSources.includes(safeName);

  if (isLogoSource) {
    return (
      <div className="flex items-center justify-center w-6 h-6">
        <img 
          src={primaryLogoUrl} 
          alt="Logo" 
          className="w-5 h-5 object-contain"
          onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) parent.innerHTML = '<div style="color: #FF7050; font-size: 14px;">●</div>';
          }} 
        />
      </div>
    );
  }

  const config = sourceConfig[safeName];
  const Icon = config?.icon;

  if (!Icon) {
    // Final fallback to primary logo if source is unknown
    return (
        <div className="flex items-center justify-center w-6 h-6">
          <img src={primaryLogoUrl} className="w-5 h-5 object-contain" alt="fallback" />
        </div>
    );
  }

  const iconColor = safeName === 'instagram' ? "#E4405F" : config.color;
  return (
    <div className="flex items-center justify-center w-6 h-6">
      <Icon size={18} color={iconColor} />
    </div>
  );
};

/**
 * Custom Tick Renderer for XAxis
 */
const CustomTick = (props: any) => {
  const { x, y, payload, primaryLogoUrl } = props;
  return (
    <foreignObject x={x - 12} y={y + 8} width={24} height={24}>
        <div className="flex items-center justify-center w-full h-full">
            {getIcon(payload.value, primaryLogoUrl)}
        </div>
    </foreignObject>
  );
};

/**
 * Custom Tooltip UI
 */
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
  // Fetch origin statistics
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["order-origin-stats", activeFilter, selectedDate.toISOString()],
    queryFn: async () => {
      const res = await apiFetch(
        `/orders/stats/origin?filter=${activeFilter}&date=${selectedDate.toISOString()}`
      );
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return Array.isArray(json) ? json : json.data || [];
    },
  });

  // Fetch Global Settings for the Primary Logo
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  // Construct Logo URL (Matching your Navbar logic)
  const primaryLogoUrl = useMemo(() => {
    const info = settings?.data || settings;
    const logoPath = info?.primary_logo;
    return extractImageUrl(logoPath) || "/images/minilogo.png";
  }, [settings]);

  const chartData = Array.isArray(statsData) ? statsData : [];

  return (
    <div className="bg-white rounded-[16px] p-4  w-full min-h-[320px] font-poppins relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#1F2937]">Order origin</h3>
      </div>

      <div className="h-[240px] w-full relative">
        {/* Loading Overlay */}
        {isStatsLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-[#FF7050] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Vertical "Sell" Label */}
        <div className="absolute left-[-35px] top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 text-[10px] font-semibold uppercase tracking-widest pointer-events-none">
          Sell
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, bottom: 20 }}>
            {/* Gradients for specific bars */}
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
              tick={(tickProps) => <CustomTick {...tickProps} primaryLogoUrl={primaryLogoUrl} />}
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
                const sourceKey = (entry.name || "direct").toLowerCase().trim();
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
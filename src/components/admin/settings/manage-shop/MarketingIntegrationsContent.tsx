"use client";

import React from "react";
import { Copy, Info, Globe, FileText, Code } from "lucide-react";
import PrimaryButton from "../../common/PrimaryButton";
import toast from "react-hot-toast";

const MarketingIntegrationsContent = () => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="space-y-6 pb-20 font-lato text-gray-800 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h3 className="text-[20px] font-medium font-lato mb-1">Marketing Integrations</h3>
        <p className="text-xs font-normal text-gray-400">Strategically Multiply Your Business Revenue.</p>
      </div>

      {/* 1. Sitemaps for Search Engine */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <img src="/images/admin/google.png" alt="Google" className="w-6 h-6 object-contain" />
          <div>
            <h4 className="text-[16px] font-normal text-black">Sitemaps for Search Engine</h4>
            <p className="text-xs font-normal text-gray-400">Add sitemaps to 'Google Search Console' to Rank your website.</p>
          </div>
        </div>
        <input 
          readOnly 
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal text-gray-500 outline-none border border-transparent"
          value="xyz.com/api/sitemaps.xml"
        />
      </section>

      {/* 2. Setup Google Tag Manager */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#4285F4] rounded flex items-center justify-center text-white font-bold text-[9px]">GTM</div>
          <h4 className="text-[16px] font-normal text-black">Setup Google Tag Manager</h4>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block tracking-wider px-1">GTM ID</label>
          <input 
            className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
            placeholder="GTM ID"
          />
        </div>
      </section>

      {/* 3. Google Domain Verification */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Globe size={22} className="text-[#4285F4]" />
          <h4 className="text-[16px] font-normal text-black">Google Domain Verification</h4>
        </div>
        <input 
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
          placeholder="Domain Verification Code"
        />
      </section>

      {/* 4. Facebook Data Feed */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <img src="/images/admin/facebook.png" alt="FB" className="w-6 h-6 object-contain" />
          <div>
            <h4 className="text-[16px] font-normal text-black">Facebook Data Feed</h4>
            <p className="text-xs font-normal text-gray-400">Add/Upload data feed to the Facebook catalog.</p>
          </div>
        </div>
        <div className="relative flex items-center">
          <input 
            readOnly 
            className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal text-[#1DA1F2] outline-none border border-transparent pr-12"
            value="https://creassmart.com/feed/product-catalog.csv"
          />
          <button 
            type="button"
            onClick={() => handleCopy("https://creassmart.com/feed/product-catalog.csv")}
            className="absolute right-4 text-gray-400 hover:text-[#1DA1F2] transition-colors"
          >
            <Copy size={18} />
          </button>
        </div>
      </section>

      {/* 5. Setup Facebook Conversion API and Pixel */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <img src="/images/admin/meta.png" alt="Meta" className="h-4 w-auto" />
          <h4 className="text-[16px] font-normal text-black">Setup Facebook Conversion API and Pixel</h4>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block tracking-wider px-1">Pixel ID</label>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="Pixel ID" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block tracking-wider px-1">Pixel Access Token</label>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="Pixel Access Token" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-1 block tracking-wider px-1">
              Pixel Test Event Id
            </label>
            <span className="text-[11px] font-normal text-gray-400 block mb-2 px-1 italic">(Just to test. Clear after testing is done)</span>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="Pixel Test Event Id" />
          </div>
        </div>
      </section>

      {/* 6. Base Script */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center text-emerald-500">
            <Code size={22} />
          </div>
          <h4 className="text-[16px] font-normal text-black">Base Script</h4>
        </div>
        <textarea 
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 min-h-[120px] resize-none text-gray-600 leading-relaxed"
          placeholder="Paste your base script code here..."
        />
      </section>

      {/* 7. Facebook Domain Verification */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Globe size={22} className="text-[#1877F2]" />
          <h4 className="text-[16px] font-normal text-black">Facebook Domain Verification</h4>
        </div>
        <input 
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all"
          placeholder="Domain Verification Code"
        />
      </section>

      {/* 8. TikTok Pixel and Events API */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <img src="/images/admin/tiktok.png" alt="TikTok" className="w-6 h-6 object-contain" />
          <h4 className="text-[16px] font-normal text-black">Setup TikTok Pixel and Events API</h4>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block tracking-wider px-1">TikTok Pixel ID</label>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="TikTok Pixel ID" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block tracking-wider px-1">TikTok Pixel Access Token</label>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="TikTok Pixel Access Token" />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase mb-1 block tracking-wider px-1">
              TikTok Pixel Test Event Code
            </label>
            <span className="text-[11px] font-normal text-gray-400 block mb-2 px-1 italic">(Optional - for testing. Clear after testing is done)</span>
            <input className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3 text-sm font-normal outline-none border border-transparent focus:border-gray-200 transition-all" placeholder="TikTok Pixel Test Event Id" />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <PrimaryButton
          label="Update delivery Charges"
          className="px-10 py-3 rounded-xl shadow-md text-sm font-bold"
        />
      </div>
    </div>
  );
};

export default MarketingIntegrationsContent;
"use client";
import React, { useState } from "react";
import SpecificationSection from "./Specificationsection";
import DescriptionSection from "./Descriptionsection";
import FAQsSection from "./Faqssection";
import ReviewSection from "./Reviewsection";
import RelatedProducts from "./Relatedproducts";

type TabType = "Specification" | "Description" | "FAQs" | "Review";

const tabs: { label: string; id: TabType; count?: number }[] = [
  { label: "Specification", id: "Specification" },
  { label: "Description", id: "Description" },
  { label: "FAQs", id: "FAQs" },
  { label: "Review", id: "Review", count: 7 },
];

const ProductDetailsTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Specification");

  return (
    <section className="w-full font-poppins md:pt-20 pt-10">
      <div className="max-w-[1720px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* ── LEFT: Tab Panel ── */}
          <div className="flex-1 min-w-0">
            {/* Tab Navigation Bar */}
            <div className="bg-[#F9F9F9] rounded-[16px] px-[48px] pt-[22px] flex items-center gap-[148px] mb-10 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative font-poppins pb-[16px] md:text-[20px] cursor-pointer text-base font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-[#FF7050] font-semibold"
                      : "text-[#848484] hover:text-[#FF7050]"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && ` (${tab.count})`}

                  {/* Active underline */}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[6px] bg-[#FF7050] rounded-[8px_8px_0_0]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Card */}
            <div className="bg-[#F8F8F8] rounded-[16px] md:py-8 md:px-[67px]">
              {activeTab === "Specification" && <SpecificationSection />}
              {activeTab === "Description" && <DescriptionSection />}
              {activeTab === "FAQs" && <FAQsSection />}
              {activeTab === "Review" && <ReviewSection />}
            </div>
          </div>

          {/* ── RIGHT: Related Products Sidebar ── */}
          <aside className="w-full xl:w-[320px] 2xl:w-[360px] shrink-0">
            <RelatedProducts />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsTabs;

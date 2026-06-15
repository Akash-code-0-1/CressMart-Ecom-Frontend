import React from "react";

const specs = [
  { feature: "Movement", details: "High-Quality Quartz Movement" },
  { feature: "Dial Design", details: "Batman Themed Skeleton Aesthetics" },
  {
    feature: "Luminous Feature",
    details: "High-Glow Radium (Glow in the Dark)",
  },
  {
    feature: "Case Material",
    details: "Durable Zinc Alloy / Stainless Steel Back",
  },
  {
    feature: "Strap Material",
    details: "Premium Quality Leather / Silicone Strap",
  },
  { feature: "Glass", details: "Hardened Scratch-Resistant Mineral Glass" },
  { feature: "Water Resistance", details: "Splash Resistant (Daily Use)" },
];

const SpecificationSection = () => {
  return (
    <div className="text-base md:text-lg">
      <div className="grid grid-cols-2 gap-y-6 gap-x-10">
        <h3 className="md:text-[24px] text-[18px] font-medium text-black">
          Feature
        </h3>
        <h3 className="md:text-[24px] text-[18px] font-medium text-black mb-4">
          Details
        </h3>
        {specs.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="text-[#727272] md:text-[20px] text-base">
              {item.feature}
            </span>
            <span className="text-[#727272] md:text-[20px] text-base">
              {item.details}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SpecificationSection;

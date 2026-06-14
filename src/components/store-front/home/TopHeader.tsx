import ChevronDownIcon from "../svg/ChevronDownIcon";
import LocationIcon from "../svg/LocationIcon";
import TrackIcon from "../svg/TrackIcon";

const TopHeader = () => {
  const marqueeText =
    "Creass Mart এখন হাজারো মানুষের আস্থার অনলাইন দোকান! – সেরা পণ্য, সেরা দাম এবং দ্রুত ডেলিভারি! হাতে পেয়েই টাকা দিন! 💵 থাকছে শতভাগ Orginal পন্যের নিশ্চয়তা | Creass Mart – Budget Friendly, Premium Shopping এর সেরা অভিজ্ঞতার জন্য!";

  return (
    <div className="w-full bg-white border-b border-[#E2E2E2] font-inter py-3 px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4 lg:gap-10">
        {/* Left Side*/}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer">
            <LocationIcon />
            <span className="text-black text-[12px] font-medium whitespace-nowrap">
              Store Locations
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <TrackIcon />
            <span className="text-black text-[12px] font-medium whitespace-nowrap">
              Track Your Order
            </span>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap flex animate-marquee-normal">
            <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
              {marqueeText}
            </span>
            {/* Duplicate for seamless loop */}
            <span className="text-[#2E2E2E] text-[13px] md:text-[14px] px-10">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex items-center shrink-0">
          <div className="flex items-center gap-1 cursor-pointer pr-3 md:pr-5">
            <span className="text-black text-[12px] md:text-[13px] font-medium">
              BDT
            </span>
            <ChevronDownIcon />
          </div>

          <div className="flex items-center gap-1 cursor-pointer border-l border-[#E2E2E2] pl-3 md:pl-5">
            <span className="text-black text-[12px] md:text-[13px] font-medium">
              Eng
            </span>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

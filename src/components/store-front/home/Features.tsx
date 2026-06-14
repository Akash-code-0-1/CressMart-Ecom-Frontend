import Image from "next/image";

const Features = () => {
  const features = [
    {
      title: "Cash On Delivery",
      desc: "Pay safely at your doorstep upon receiving.",
      image: "/images/store-front/feature/feture1.svg",
    },
    {
      title: "100% Original Products",
      desc: "100% authentic and premium products guaranteed.",
      image: "/images/store-front/feature/feature2.svg",
    },
    {
      title: "Best Price Assurance",
      desc: "Unbeatable prices and exciting deals everyday.",
      image: "/images/store-front/feature/feature3.svg",
    },
    {
      title: "Fast Nationwide Delivery",
      desc: "Within 24 hours inside Dhaka and fast nationwide.",
      image: "/images/store-front/feature/feature4.svg",
    },
  ];

  return (
    <section className="w-full bg-white font-inter md:py-[80px] py-10 px-4 md:px-10">
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex items-center relative lg:justify-center"
          >
            {/* Feature Content */}
            <div className="flex items-center gap-5">
              <div className="shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#000000] md:text-[24px] text-[18px] font-normal leading-normal mb-1">
                  {item.title}
                </h3>
                <p className="text-[#8C8C8C] text-[12px] font-normal leading-normal w-[174px]">
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Separator: Hidden on mobile/last item */}
            {index !== features.length - 1 && (
              <div className="hidden lg:block absolute right-0 w-px h-[24px] bg-[#E2E2E2]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

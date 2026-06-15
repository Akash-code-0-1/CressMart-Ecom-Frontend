export default function CategoryBanner() {
  return (
    <div
      className="w-full h-[180px] md:h-[220px] rounded-2xl relative overflow-hidden 
    flex items-center px-8 md:px-16 bg-[url('/images/store-front/brand/catban.png')] bg-cover bg-center"
    >
      <div className="z-10 text-white">
        <h1 className="text-3xl md:text-5xl font-semibold mb-2 font-poppins">
          Gadget & Tools
        </h1>
        <p className="text-[#B1B1B1] font-medium text-xl font-poppins mt-1">
          Start from 300 BDT
        </p>
      </div>
    </div>
  );
}

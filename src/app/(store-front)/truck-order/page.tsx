import Features from "@/components/store-front/home/Features";
import BrandSection from "@/components/store-front/order/BrandSection";
import TrackOrder from "@/components/store-front/truck-order/TrackOrder";

export default function page() {
  return (
    <div>
      <TrackOrder />
      <Features />
      <BrandSection />
    </div>
  );
}

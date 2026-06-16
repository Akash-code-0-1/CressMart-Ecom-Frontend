import RecentlyViewed from "@/components/store-front/common/RecentViewSection";
import MainCheakoutSection from "@/components/store-front/order/MainCheakoutSection";

export default function page() {
  return (
    <div>
      <MainCheakoutSection />
      <div className="md:mt-10 mt-5 mb-10 md:mb-20">
        <RecentlyViewed />
      </div>
    </div>
  );
}

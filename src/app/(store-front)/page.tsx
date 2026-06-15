import BannerSlider from "@/components/store-front/home/BannerSlider";
import BestSalesProducts from "@/components/store-front/home/BestSalesProducts";
import Blog from "@/components/store-front/home/Blog";
import Brands from "@/components/store-front/home/Brands";
import FeaturedCategory from "@/components/store-front/home/FeaturedCategory";
import Features from "@/components/store-front/home/Features";
import FlashSale from "@/components/store-front/home/FlashSale";
import PromotionDiscountProduct from "@/components/store-front/home/PromotionDiscountProduct";
import RecentProducts from "@/components/store-front/home/RecentProducts";
import Suppliers from "@/components/store-front/home/Suppliers";
import Testimonials from "@/components/store-front/home/Testimonials";
import WeeklyBestSellerProduct from "@/components/store-front/home/WeeklyBestSellerProduct";

export default function page() {
  return (
    <>
      <BannerSlider />
      <Features />
      <PromotionDiscountProduct />
      <FeaturedCategory />
      <RecentProducts />
      <BestSalesProducts />
      <FlashSale />
      <Testimonials />
      <WeeklyBestSellerProduct />
      <Brands />
      <Suppliers />
      <Blog />
    </>
  );
}

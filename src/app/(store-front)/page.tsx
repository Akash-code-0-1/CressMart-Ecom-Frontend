import BannerSlider from "@/components/store-front/home/BannerSlider";
import BestSalesProducts from "@/components/store-front/home/BestSalesProducts";
import Blog from "@/components/store-front/home/Blog";
import Brands from "@/components/store-front/home/Brands";
import FAQ from "@/components/store-front/home/FAQ";
import FeaturedCategory from "@/components/store-front/home/FeaturedCategory";
import Features from "@/components/store-front/home/Features";
import FlashSale from "@/components/store-front/home/FlashSale";
import Footer from "@/components/store-front/home/Footer";
import Navbar from "@/components/store-front/home/Navbar";
import PromotionDiscountProduct from "@/components/store-front/home/PromotionDiscountProduct";
import RecentProducts from "@/components/store-front/home/RecentProducts";
import Suppliers from "@/components/store-front/home/Suppliers";
import Testimonials from "@/components/store-front/home/Testimonials";
import TopHeader from "@/components/store-front/home/TopHeader";
import WeeklyBestSellerProduct from "@/components/store-front/home/WeeklyBestSellerProduct";

export default function page() {
  return (
    <>
      <TopHeader />
      <Navbar />
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
      <FAQ />
      <Footer />
    </>
  );
}

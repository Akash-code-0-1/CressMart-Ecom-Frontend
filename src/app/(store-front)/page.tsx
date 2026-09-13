
import BannerSlider from "@/components/store-front/home/BannerSlider";
import Blog from "@/components/store-front/home/Blog";
import Brands from "@/components/store-front/home/Brands";
import FeaturedCategory from "@/components/store-front/home/FeaturedCategory";
import Features from "@/components/store-front/home/Features";
import FlashSale from "@/components/store-front/home/FlashSale";
import PromotionDiscountProduct from "@/components/store-front/home/CampaignSection";
import AutomatedProductSlider from "@/components/store-front/home/AutomatedProductSlider";
import Suppliers from "@/components/store-front/home/Suppliers";
import Testimonials from "@/components/store-front/home/Testimonials";
import { getHomeTags, HomeTagSection } from "@/services-api/tagService";
import NewArrivals from "@/components/store-front/home/NewArrivals";
import WeeklyBestSellerProduct from "@/components/store-front/home/WeeklyBestSellerProduct";

export const dynamic = "force-dynamic";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchCollections = async () => {
    try {
      const [newRes, bestRes, weeklyRes] = await Promise.all([
        fetch(`${baseUrl}/products/new-arrivals?limit=10`, { cache: "no-store" }),
        fetch(`${baseUrl}/products/best-sellers?limit=10`, { cache: "no-store" }),
        fetch(`${baseUrl}/products/weekly-best-sellers?limit=10`, { cache: "no-store" }),
      ]);

      const newJson = await newRes.json();
      const bestJson = await bestRes.json();
      const weeklyJson = await weeklyRes.json();

      // DEBUG LOGS
      // console.log("DEBUG: New Arrivals:", newJson);
      // console.log("DEBUG: Best Sales:", bestJson);
      // console.log("DEBUG: Weekly Best:", weeklyJson);

      return {
        newArrivals: Array.isArray(newJson) ? newJson : (newJson.data || []),
        bestSales: Array.isArray(bestJson) ? bestJson : (bestJson.data || []),
        weeklyBestSellers: Array.isArray(weeklyJson) ? weeklyJson : (weeklyJson.data || []),
      };
    } catch (e) {
      console.error("❌ Fetch error:", e);
      return { newArrivals: [], bestSales: [], weeklyBestSellers: [] };
    }
  };
  const [collections, tags] = await Promise.all([
    fetchCollections(),
    getHomeTags()
  ]);

  const flashSaleArray = Array.isArray(tags)
    ? tags.filter((tag: HomeTagSection) => tag.is_flash_sale === true && tag.end_date)
    : [];

  const activeFlashSale = flashSaleArray[0];

  return (
    <>
      <BannerSlider />
      <Features />
      <FeaturedCategory />
      
      <AutomatedProductSlider
        title="New Arrivals"
        products={collections.newArrivals}
        id="new-arrival"
      />
      <AutomatedProductSlider
        title="Best Deals"
        products={collections.bestSales}
        id="best-deals"
      />
      <AutomatedProductSlider
        title="Weekly Best Sellers"
        products={collections.weeklyBestSellers}
        id="weekly-best"
      />

      {activeFlashSale && <FlashSale flashSale={activeFlashSale} />}

      <Testimonials />
      <Brands />
      {/* <Suppliers /> */}
      <Blog />
    </>
  );
}

// import BannerSlider from "@/components/store-front/home/BannerSlider";
// import Blog from "@/components/store-front/home/Blog";
// import Brands from "@/components/store-front/home/Brands";
// import FeaturedCategory from "@/components/store-front/home/FeaturedCategory";
// import Features from "@/components/store-front/home/Features";
// import FlashSale from "@/components/store-front/home/FlashSale";
// import PromotionDiscountProduct from "@/components/store-front/home/CampaignSection";
// import AutomatedProductSlider from "@/components/store-front/home/AutomatedProductSlider";
// import Suppliers from "@/components/store-front/home/Suppliers";
// import Testimonials from "@/components/store-front/home/Testimonials";
// import { getHomeTags, HomeTagSection } from "@/services-api/tagService";
// import NewArrivals from "@/components/store-front/home/NewArrivals";
// import WeeklyBestSellerProduct from "@/components/store-front/home/WeeklyBestSellerProduct";

// export const dynamic = "force-dynamic";

// interface CollectionData {
//   newArrivals: any[];
//   bestSales: any[];
//   weeklyBestSellers: any[];
// }

// export default async function Page() {
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//   let collections: CollectionData = { newArrivals: [], bestSales: [], weeklyBestSellers: [] };

//   try {
//     const res = await fetch(`${baseUrl}/products/home-collections`, { cache: "no-store" });
//     const json = await res.json();
//     const data = json.data ? json.data : json;

//     collections = {
//       newArrivals: data.newArrivals || [],
//       // Sort: Highest sold count first
//       bestSales: [...(data.bestSales || [])].sort((a, b) => (b.initial_sold_count || 0) - (a.initial_sold_count || 0)),
//       // Sort: Highest weekly sold first
//       weeklyBestSellers: [...(data.weeklyBestSellers || [])].sort((a, b) => (b.weekly_sold_count || 0) - (a.weekly_sold_count || 0)),
//     };
//   } catch (e) {
//     console.error("❌ Fetch error on Page:", e);
//   }

//   const tags = await getHomeTags();
//   const flashSaleArray = Array.isArray(tags) ? tags.filter((tag: HomeTagSection) => tag.is_flash_sale === true && tag.end_date) : [];
//   const activeFlashSale = flashSaleArray[0];

//   return (
//     <>
//       <BannerSlider />
//       <Features />
//       <FeaturedCategory />
//       <NewArrivals tags={tags} />
//       <WeeklyBestSellerProduct tags={tags} />
      
//       <AutomatedProductSlider title="New Arrivals" products={collections.newArrivals} id="new-arrival" />
//       <AutomatedProductSlider title="Best Deals" products={collections.bestSales} id="best-deals" />
//       <AutomatedProductSlider title="Weekly Best Sellers" products={collections.weeklyBestSellers} id="weekly-best" />

//       {activeFlashSale && <FlashSale flashSale={activeFlashSale} />}

//       <Testimonials />
//       <Brands />
//       <Suppliers />
//       <Blog />
//     </>
//   );
// }
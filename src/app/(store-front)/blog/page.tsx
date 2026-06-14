import BlogBanner from "@/components/store-front/blog/BlogBanner";
import BlogPageGrid from "@/components/store-front/blog/BlogPageGrid";
import BlogPosts from "@/components/store-front/blog/BlogPosts";
import FAQ from "@/components/store-front/home/FAQ";
import Footer from "@/components/store-front/home/Footer";
import Navbar from "@/components/store-front/home/Navbar";
import TopHeader from "@/components/store-front/home/TopHeader";

export default function page() {
  return (
    <div>
      <TopHeader />
      <Navbar />
      <BlogBanner />
      <BlogPosts />
      <BlogPageGrid />
      <FAQ />
      <Footer />
    </div>
  );
}

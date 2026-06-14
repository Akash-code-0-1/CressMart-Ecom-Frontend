import BlogBody from "@/components/store-front/blog/BlogBody";
import BlogComments from "@/components/store-front/blog/BlogComments";
import BlogHeader from "@/components/store-front/blog/BlogHeader";
import BlogHero from "@/components/store-front/blog/BlogHero";
import BlogShare from "@/components/store-front/blog/BlogShare";
import FAQ from "@/components/store-front/home/FAQ";
import Footer from "@/components/store-front/home/Footer";
import Navbar from "@/components/store-front/home/Navbar";
import TopHeader from "@/components/store-front/home/TopHeader";

export default function page() {
  return (
    <div>
      <TopHeader />
      <Navbar />
      <BlogHero />
      <BlogHeader />
      <BlogBody />
      <BlogShare />
      <BlogComments />
      <FAQ />
      <Footer />
    </div>
  );
}

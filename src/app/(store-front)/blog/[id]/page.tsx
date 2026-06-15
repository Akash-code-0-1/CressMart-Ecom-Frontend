import BlogBody from "@/components/store-front/blog/BlogBody";
import BlogComments from "@/components/store-front/blog/BlogComments";
import BlogHeader from "@/components/store-front/blog/BlogHeader";
import BlogHero from "@/components/store-front/blog/BlogHero";
import BlogShare from "@/components/store-front/blog/BlogShare";

export default function page() {
  return (
    <div>
      <BlogHero />
      <BlogHeader />
      <BlogBody />
      <BlogShare />
      <BlogComments />
    </div>
  );
}

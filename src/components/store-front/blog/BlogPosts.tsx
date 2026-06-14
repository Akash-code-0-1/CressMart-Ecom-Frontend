"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: number;
  image: string;
  author: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
}

const BlogPosts = () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      author: "Tom Brick",
      readTime: "10 min read",
      date: "21h ago",
      title: "How to make your Twitter account more secure in an age of hacks",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ...",
      image: "/images/store-front/brand/blog.png",
    },
    {
      id: 2,
      author: "Tom Brick",
      readTime: "10 min read",
      date: "21h ago",
      title:
        "Microsofts Summer Game fest will make dozens of free demos available to...",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ...",
      image: "/images/store-front/brand/blog.png",
    },
    {
      id: 3,
      author: "Tom Brick",
      readTime: "10 min read",
      date: "21h ago",
      title: "Smart water bottles for healthy hydration habits",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ...",
      image: "/images/store-front/brand/blog.png",
    },
  ];

  const router = useRouter();

  return (
    <section className="w-full py-10 px-4 md:px-10 bg-white">
      <div className="max-w-[1720px] mx-auto">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col bg-white rounded-[24px] overflow-hidden border border-transparent hover:border-[#F2F2F2] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              onClick={() => router.push(`/blog/${post.id}`)}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[24px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content Container */}
              <div className="flex flex-col p-6 md:p-8">
                {/* Meta Data */}
                <div className="flex items-center flex-wrap justify-between">
                  <p className="text-[#8C8C8C] font-inter text-[14px] font-medium mb-3">
                    {post.author} - {post.date}
                  </p>
                  <p className="text-[#8C8C8C] font-inter text-[14px] font-medium mb-3">
                    {post.readTime}
                  </p>
                </div>
                {/* Title */}
                <h3 className="text-black font-poppins text-[18px] md:text-[22px] font-semibold leading-[1.4] mb-4 hover:text-[#FF7050] transition-colors cursor-pointer line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[#585858] font-inter text-[14px] md:text-[15px] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPosts;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ViewButton from "../common/ViewButton";
import { BlogPost } from "@/@types/blogpost.type";
import { useRouter } from "next/navigation";

const blogs: BlogPost[] = [
  {
    id: 1,
    title: "Perfect Homemade Italian Pasta",
    date: "10th January 2026",
    image: "/images/store-front/brand/blog.png",
    slug: "homemade-italian-pasta",
  },
  {
    id: 2,
    title: "Ultimate Street Food Guide",
    date: "1st March 2026",
    image: "/images/store-front/brand/blog.png",
    slug: "street-food-guide",
  },
  {
    id: 3,
    title: "Perfect Homemade Italian Pasta",
    date: "10th January 2026",
    image: "/images/store-front/brand/blog.png",
    slug: "homemade-pasta-2",
  },
  {
    id: 4,
    title: "Ultimate Street Food Guide",
    date: "1st March 2026",
    image: "/images/store-front/brand/blog.png",
    slug: "street-food-guide-2",
  },
];

const Blog: React.FC = () => {
  const router = useRouter();
  return (
    <section className="font-poppins md:pb-20 pb-10 px-4">
      <div className="max-w-[1720px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-black">
            Our Blogs
          </h2>
          <ViewButton onClick={() => router.push("/blog")} />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group cursor-pointer"
              onClick={() => router.push(`/blog/${blog.id}`)}
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 mb-4 overflow-hidden rounded-[20px]">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={blog.id === 1}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-black mb-3 leading-tight line-clamp-2">
                {blog.title}
              </h3>

              {/* Footer: Date & Read More */}
              <div className="flex justify-between items-center">
                <span className="text-lg text-[#5E5E5E] font-normal">
                  {blog.date}
                </span>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="flex items-center gap-1 text-[12px] font-normal text-[#5E5E5E] hover:text-black transition-colors border-b border-gray-400 hover:border-black"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="12"
                    viewBox="0 0 21 12"
                    fill="none"
                  >
                    <path
                      d="M0.800781 5.09751C0.358441 5.09751 -0.000147462 5.4561 -0.000147462 5.89844C-0.000147462 6.34078 0.358441 6.69937 0.800781 6.69937V5.89844V5.09751ZM20.5894 6.46478C20.9022 6.152 20.9022 5.64488 20.5894 5.3321L15.4923 0.235016C15.1796 -0.0777659 14.6724 -0.0777659 14.3596 0.235016C14.0469 0.547798 14.0469 1.05492 14.3596 1.3677L18.8904 5.89844L14.3596 10.4292C14.0469 10.742 14.0469 11.2491 14.3596 11.5619C14.6724 11.8746 15.1796 11.8746 15.4923 11.5619L20.5894 6.46478ZM0.800781 5.89844V6.69937H20.0231V5.89844V5.09751H0.800781V5.89844Z"
                      fill="#606060"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

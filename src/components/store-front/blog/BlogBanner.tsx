"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BlogBanner = () => {
  const blogs = [
    {
      id: 1,
      title: "blog",
      image: "/images/blog/blogbanner.png",
      mobileImage: "/images/blog/blogbanner.png",
    },
  ];

  return (
    <section className="w-full py-16 px-4 md:px-10 bg-white">
      <div className="max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-black font-poppins text-[36px] md:text-[48px] font-bold mb-4">
            Blog
          </h2>
          <p className="text-[#585858] font-inter text-[14px] md:text-[16px] max-w-[600px] mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore e
          </p>
        </div>

        {/* Blog Slider Container */}
        <div className="relative group">
          {/* Custom Navigation Arrows */}
          <button className="blog-prev absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black text-2xl border border-gray-100 hover:bg-[#FF7050] hover:text-white transition-all">
            <FiChevronLeft />
          </button>
          <button className="blog-next absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black text-2xl border border-gray-100 hover:bg-[#FF7050] hover:text-white transition-all">
            <FiChevronRight />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000 }}
            navigation={{
              prevEl: ".blog-prev",
              nextEl: ".blog-next",
            }}
            className="rounded-[20px] md:rounded-[35px] overflow-hidden"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <div className="relative h-[450px] md:h-[600px] w-full">
                  {blog.mobileImage ? (
                    <>
                      <div className="hidden md:block w-full h-full relative">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-fill"
                          priority
                        />
                      </div>
                      <div className="block md:hidden w-full h-full relative">
                        <Image
                          src={blog.mobileImage}
                          alt={blog.title}
                          fill
                          className="object-fill"
                          priority
                        />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full relative">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="md:object-fill object-cover"
                        priority
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BlogBanner;

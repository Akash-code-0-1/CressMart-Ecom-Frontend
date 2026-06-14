import Image from "next/image";

export default function BlogHero() {
  return (
    <section className="w-full">
      {/* Banner Image */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[724px]">
        <Image
          src="/images/store-front/blog/blogMainBannner.png"
          alt="Blog Banner"
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}

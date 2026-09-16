"use client";
import { translations } from "@/locales";
import { useLanguage } from "@/providers/LanguageProvider";
import Image from "next/image";
import Link from "next/link";

export interface RelatedProduct {
  id: string;
  name: string;
  images: Array<{ url: string; alt_text?: string } | string>;
  sell_price: string;
}

interface BlogBodyProps {
  content: string;
  relatedProducts?: RelatedProduct[];
}

function extractImageUrl(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const inner = (val as Record<string, unknown>).url;
    if (typeof inner === "string") return inner;
    if (inner && typeof inner === "object") {
      const deepUrl = (inner as Record<string, unknown>).url;
      if (typeof deepUrl === "string") return deepUrl;
    }
  }
  return "";
}
export default function BlogBody({ content, relatedProducts }: BlogBodyProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  return (
    <section className="container mx-auto px-4 font-inter pb-20">
      {/* 1. Main Body Text (Dynamic HTML) */}

      <div className="mb-10">
<div
  className="blog-rich-text prose prose-lg max-w-none 
    // Responsive text sizing
    prose-p:text-[#585858] 
    prose-headings:text-black 
    prose-headings:font-bold 
    
    // THE FIX: This ensures images/tables don't break the screen
    prose-img:max-w-full 
    prose-img:h-auto 
    overflow-x-hidden
    
    // Override the hardcoded white backgrounds/black text from your DB
    [&_span]:!bg-transparent 
    [&_strong]:!text-black 
    [&_span]:!text-[#585858]
    [&_h1]:!text-2xl md:[&_h1]:!text-4xl
    [&_h2]:!text-xl md:[&_h2]:!text-3xl
  "
  dangerouslySetInnerHTML={{ 
    __html: content.replace(/style="[^"]*"/g, '') // Strips most inline styles
  }}
/>
      </div>

      {/* 2. Side by Side Related Products (Dynamic) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-black font-bold text-xl mb-6 uppercase tracking-wide">
            {t.relatedProducts.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {relatedProducts.map((product: RelatedProduct) => {
              const rowimage = extractImageUrl(product?.images[0]).trim();
              const usableImage = rowimage.startsWith("http")
                ? rowimage
                : rowimage
                  ? `${backendBaseUrl}/${rowimage.replace(/^\/+/, "")}`
                  : "/images/placeholder.svg";

              return (
                <div key={product.id} className="space-y-3">
    <Link 
      key={product.id} 
      href={`/product/${product.id}`} 
      className="block space-y-3 group"
    >
      <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden border border-gray-100">
        <Image
          src={usableImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>
      <p className="text-start font-medium text-gray-700 group-hover:text-[#FF7050] transition-colors">
        {product.name}
      </p>
    </Link>
                  <p className="text-start font-medium text-gray-700">
                    {product.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

import { fetchSettings } from "@/services-api/settingsService";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await fetchSettings();
  const data = settings.data || settings;

  const contentMap: Record<string, { title: string; content: string }> = {
    "about-us": { title: "About Us", content: data.about_content },
    "privacy-policy": { title: "Privacy Policy", content: data.privacy_content },
    "terms-condition": { title: "Terms & Conditions", content: data.terms_content },
    "return-exchange": { title: "Return & Exchange", content: data.return_content },
  };

  const page = contentMap[slug];
  if (!page) return <div className="min-h-screen flex items-center justify-center">Page not found</div>;

  const paragraphs = page.content ? page.content.split('\n\n') : [];

  return (
    <main className="bg-[#FAFAFA] min-h-screen py-10 md:py-16">
      <div className="max-w-[1720px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#727272] mb-6 font-medium">
          <Link href="/" className="hover:text-[#FF7050]">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-[#FF7050]">{page.title}</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-[#EEEEEE] relative overflow-hidden">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-[#FF7050]"></div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#003032] mb-10 font-poppins tracking-tight">
            {page.title}
          </h1>
          
          <div className="space-y-6 text-[#4A4A4A] leading-loose text-[17px] font-inter">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, index) => (
                <p key={index} className={index === 0 ? "text-xl text-[#003032] font-semibold leading-relaxed" : ""}>
                  {para}
                </p>
              ))
            ) : (
              <p>No content available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
// import { fetchSettings } from "@/services-api/settingsService";
// import Link from "next/link";
// import { ChevronRight } from "lucide-react";
// import { cookies } from "next/headers";
// import { translations } from "@/locales";

// export default async function LegalPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   // Read language from cookie
//   const cookieStore = await cookies();
//   const language =
//     (cookieStore.get("language")?.value as "ENG" | "BAN") || "ENG";

//   const t = translations[language];

//   // Fetch database content
//   const settings = await fetchSettings();
//   const data = settings.data || settings;

//   // Only titles are translated
//   const contentMap: Record<
//     string,
//     {
//       title: string;
//       content: string;
//     }
//   > = {
//     "about-us": {
//       title: t.legal.aboutUs,
//       content: data.about_content,
//     },
//     "privacy-policy": {
//       title: t.legal.privacyPolicy,
//       content: data.privacy_content,
//     },
//     "terms-condition": {
//       title: t.legal.termsAndConditions,
//       content: data.terms_content,
//     },
//     "return-exchange": {
//       title: t.legal.returnExchange,
//       content: data.return_content,
//     },
//   };

//   const page = contentMap[slug];

//   if (!page) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         {language === "BAN"
//           ? "পৃষ্ঠা পাওয়া যায়নি"
//           : "Page not found"}
//       </div>
//     );
//   }

//   const paragraphs = page.content
//     ? page.content.split("\n\n")
//     : [];

//   return (
//     <main className="bg-[#FAFAFA] min-h-screen py-10 md:py-16">
//       <div className="max-w-[1720px] mx-auto px-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center text-sm text-[#727272] mb-6 font-medium">
//           <Link href="/" className="hover:text-[#FF7050]">
//             {t.legal.home}
//           </Link>

//           <ChevronRight size={16} className="mx-2" />

//           <span className="text-[#FF7050]">
//             {page.title}
//           </span>
//         </nav>

//         {/* Content Card */}
//         <div className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-[#EEEEEE] relative overflow-hidden">
//           {/* Accent Bar */}
//           <div className="absolute top-0 left-0 w-2 h-full bg-[#FF7050]" />

//           <h1 className="text-3xl md:text-5xl font-extrabold text-[#003032] mb-10 font-poppins tracking-tight">
//             {page.title}
//           </h1>

//           <div className="space-y-6 text-[#4A4A4A] leading-loose text-[17px] font-inter">
//             {paragraphs.length > 0 ? (
//               paragraphs.map((para, index) => (
//                 <p
//                   key={index}
//                   className={
//                     index === 0
//                       ? "text-xl text-[#003032] font-semibold leading-relaxed"
//                       : ""
//                   }
//                 >
//                   {para}
//                 </p>
//               ))
//             ) : (
//               <p>
//                 {language === "BAN"
//                   ? "বর্তমানে কোনো তথ্য পাওয়া যায়নি।"
//                   : "No content available at the moment."}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// app/legal/[slug]/page.tsx
import { fetchSettings } from "@/services-api/settingsService";
import { cookies } from "next/headers";
import { translations } from "@/locales";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const language = (cookieStore.get("language")?.value as "ENG" | "BAN") || "ENG";
  const t = translations[language];
  const settings = await fetchSettings();
  const data = settings.data || settings;

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");
  const getFullImageUrl = (path: string) => {
    if (!path) return "/images/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${backendBaseUrl}${path}`;
  };

  const rawDataMap: any = {
    "about-us": data.about_content,
    "privacy-policy": data.privacy_content,
    "terms-condition": data.terms_content,
    "return-exchange": data.return_content,
    "shipping-delivery": data.shipping_content,
  "display-center": data.display_center_content,
  "career": data.career_content,
  "become-vendor": data.vendor_content,
  "affiliate-program": data.affiliate_content,
  "faqs": data.faqs_content,
  };

  const titleMap: any = {
    "about-us": t.legal.aboutUs,
    "privacy-policy": t.legal.privacyPolicy,
    "terms-condition": t.legal.termsAndConditions,
    "return-exchange": t.legal.returnExchange,
    "shipping-delivery": t.legal.shipping,      
    "display-center": t.legal.displayCenter,    
    "career": t.legal.career,                   
    "become-vendor": t.legal.vendor,            
    "affiliate-program": t.legal.affiliate,
    "faqs": t.legal.faqs,

  };

  const getSections = (content: any) => {
    try {
      if (!content) return [];
      return typeof content === "string" ? JSON.parse(content) : (Array.isArray(content) ? content : []);
    } catch (e) { return []; }
  };

  const sections = getSections(rawDataMap[slug]);
  if (!titleMap[slug]) return <div className="py-20 text-center font-poppins text-gray-400">404 - Page not found</div>;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-poppins pb-10 md:pb-20 overflow-x-hidden">
      {/* 💡 CSS Definition: Enables all styles chosen in the Admin Panel */}
      <style dangerouslySetInnerHTML={{ __html: `
        .full-control-rich-content { 
            word-wrap: break-word; 
            overflow-wrap: break-word; 
            width: 100%;
        }
        .full-control-rich-content .ql-align-center { text-align: center !important; }
        .full-control-rich-content .ql-align-right { text-align: right !important; }
        .full-control-rich-content .ql-align-justify { text-align: justify !important; }
        .full-control-rich-content p { margin-bottom: 1rem; line-height: 1.7; min-height: 1em; }
        .full-control-rich-content h1, .full-control-rich-content h2, .full-control-rich-content h3 { 
            font-weight: 800; 
            margin-top: 1.5rem; 
            margin-bottom: 1rem; 
            color: #003032;
        }
        .full-control-rich-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .full-control-rich-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .full-control-rich-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 10px 0; }
        .full-control-rich-content a { color: #FF7050; text-decoration: underline; font-weight: 600; }
        .full-control-rich-content strong { font-weight: bold; }
      `}} />

      {/* Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 md:py-10 flex items-center text-[10px] md:text-xs font-medium text-gray-400">
        <Link href="/" className="hover:text-[#FF7050] transition-colors shrink-0">{t.legal.home}</Link>
        <ChevronRight size={12} className="mx-1 md:mx-2 shrink-0" />
        <span className="text-[#003032] font-bold uppercase tracking-wide truncate">{titleMap[slug]}</span>
      </div>

      <div className="flex flex-col gap-10 md:gap-24">
        {sections.length > 0 ? (
          sections.map((section: any, i: number) => (
            <section key={i} className="w-full px-4 md:px-6">
              
              {/* TYPE: BANNER */}
              {section.type === "banner" && (
                <div className="max-w-[1300px] mx-auto">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[25/8] rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl bg-white border border-gray-100">
                    <img src={getFullImageUrl(section.imageUrl)} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-20">
                        {section.title && <h1 className="text-white text-2xl sm:text-3xl md:text-6xl font-black max-w-4xl leading-tight mb-4">{section.title}</h1>}
                        {section.content && (
                           <div 
                              className="text-white/90 text-sm md:text-xl max-w-3xl full-control-rich-content"
                              dangerouslySetInnerHTML={{ __html: section.content }} 
                           />
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE: INTRO TEXT BLOCK - NO FORCED CENTERING */}
              {section.type === "text_block" && (
                <div className="max-w-[1100px] mx-auto">
                  {section.title && <h2 className="text-2xl md:text-5xl font-black text-[#003032] mb-6 leading-tight">{section.title}</h2>}
                  <div 
                    className="full-control-rich-content text-gray-600" 
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              )}

              {/* TYPE: SPLIT IMAGE + TEXT */}
              {section.type === "image_text" && (
                <div className="max-w-[1300px] mx-auto">
                  <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center">
                    
                    {/* Content Column */}
                    <div className={`w-full md:w-1/2 order-2 ${section.alignment === "left" ? "md:order-2" : "md:order-1"}`}>
                      {section.title && <h2 className="text-xl md:text-4xl font-black text-[#003032] mb-6 leading-tight">{section.title}</h2>}
                      <div 
                        className="full-control-rich-content text-gray-600"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                      
                      {section.points && (
                        <div className="grid grid-cols-1 gap-2 md:gap-3 mt-6">
                          {section.points.split("\n").filter((p: string) => p.trim()).map((point: string, idx: number) => (
                            <div key={idx} className="flex gap-3 items-center bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
                              <CheckCircle2 className="text-[#FF7050] shrink-0" size={18} />
                              <span className="font-bold text-[#003032] text-xs md:text-base">{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image Column */}
                    <div className={`w-full md:w-1/2 order-1 ${section.alignment === "left" ? "md:order-1" : "md:order-2"}`}>
                      <div className="relative aspect-square w-full max-w-[320px] md:max-w-[500px] mx-auto rounded-[30px] md:rounded-[80px] overflow-hidden shadow-2xl border-[6px] md:border-[15px] border-white bg-white">
                        <img src={getFullImageUrl(section.imageUrl)} alt="section" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </section>
          ))
        ) : (
          <div className="py-20 text-center text-gray-300">No content found.</div>
        )}
      </div>
    </main>
  );
}
import type { Metadata } from "next";
import { Inter, Lato, Poppins, Syne, Montserrat } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { fetchSettings } from "@/services-api/settingsService";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import MarketingScripts from "@/components/common/MarketingScripts";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const info = settings?.data || settings;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");

  const faviconUrl = info?.favicon
    ? `${baseUrl}/uploads/settings/${info.favicon.replace("/uploads/settings/", "")}`
    : "/favicon.ico";

  // Fetch marketing verification codes
  let googleVerification = undefined;
  let fbVerification = undefined;
  try {
    const mRes = await fetch(`${baseUrl}/marketing-settings/public`, { cache: "no-store" });
    if (mRes.ok) {
      const mJson = await mRes.json();
      const mData = mJson?.data || mJson;
      googleVerification = mData?.googleVerificationCode || undefined;
      fbVerification = mData?.fbDomainVerificationCode || undefined;
    }
  } catch {}

  return {
    title: {
      default: "Creass Mart",
      template: "%s | Creass Mart", // Allows page-specific titles
    },
    description: info?.home_meta_description || "Creass Mart - Buy With Confidence",
    verification: {
      google: googleVerification,
      other: fbVerification
        ? {
            "facebook-domain-verification": [fbVerification],
          }
        : undefined,
    },
    icons: {
      icon: [
        {
          url: faviconUrl,
          type: "image/webp",
        },
      ],
      shortcut: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let mData = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");
    const mRes = await fetch(`${baseUrl}/marketing-settings/public`, { cache: "no-store" });
    if (mRes.ok) {
      const mJson = await mRes.json();
      mData = mJson?.data || mJson;
    }
  } catch {}

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${lato.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col relative"
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <QueryProvider>{children}</QueryProvider>
        <MarketingScripts initialSettings={mData} />
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}


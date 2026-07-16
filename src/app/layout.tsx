import type { Metadata } from "next";
import { Inter, Lato, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { fetchSettings } from "@/services-api/settingsService";
import { Toaster } from "react-hot-toast";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const info = settings?.data || settings;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");

  // Ensure we are getting the full, correct absolute URL
  const faviconUrl = info?.favicon
    ? `${baseUrl}/uploads/settings/${info.favicon.replace("/uploads/settings/", "")}`
    : "/favicon.ico";

  return {
    title: "Creass Mart",
    description: "Premium E-Commerce Platform",
    icons: {
      icon: [
        {
          url: faviconUrl,
          type: "image/webp", // Explicitly define the type
        },
      ],
      shortcut: faviconUrl, // Added for broader browser compatibility
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

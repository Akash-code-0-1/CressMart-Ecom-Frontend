import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/store-front/home/Navbar";
import TopHeader from "@/components/store-front/home/TopHeader";
import FAQ from "@/components/store-front/home/FAQ";
import Footer from "@/components/store-front/home/Footer";
import ChatWidget from "@/components/store-front/chat/ChatWidget";
import QueryProvider from "@/providers/QueryProvider";

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

export const metadata: Metadata = {
  title: "Creass Mart",
  description: "Premium E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      {/* 👈 Added suppressHydrationWarning here to catch body tag attributes injected by browser extensions */}
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <QueryProvider>
          <TopHeader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <FAQ />
          <Footer />

          {/* Floating Chat Engine Widget sits globally on the bottom-right viewport across all screens */}
          <ChatWidget />
        </QueryProvider>
      </body>
    </html>
  );
}

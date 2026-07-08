import Navbar from "@/components/store-front/home/Navbar";
import TopHeader from "@/components/store-front/home/TopHeader";
import FAQ from "@/components/store-front/home/FAQ";
import Footer from "@/components/store-front/home/Footer";
import ChatWidget from "@/components/store-front/chat/ChatWidget";

export default function StoreFrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopHeader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <FAQ />
      <Footer />
      <ChatWidget />
    </>
  );
}
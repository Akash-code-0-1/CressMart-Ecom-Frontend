import Navbar from "@/components/store-front/home/Navbar";
import TopHeader from "@/components/store-front/home/TopHeader";
import FAQ from "@/components/store-front/home/FAQ";
import Footer from "@/components/store-front/home/Footer";

export default function StoreFrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
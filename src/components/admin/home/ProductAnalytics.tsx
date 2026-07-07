"use client";
import { Search } from "lucide-react";
import Image from "next/image";
interface Product {
    id: string;
    name: string;
    image: string;
    totalOrder?: number;
    status?: "Stock" | "Stock out";
    price: string;
    itemCode?: string;
}

const bestSellingData: Product[] = [
    { id: "1", name: "Apple iPhone 13", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=50&h=50&fit=crop", totalOrder: 104, status: "Stock", price: "৳999.00" },
    { id: "2", name: "Nike Air Jordan", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop", totalOrder: 56, status: "Stock out", price: "৳999.00" },
    { id: "3", name: "T-shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop", totalOrder: 266, status: "Stock", price: "৳999.00" },
    { id: "4", name: "Cross Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop", totalOrder: 506, status: "Stock", price: "৳999.00" },
];

const topProductsData: Product[] = [
    { id: "p1", name: "Apple iPhone 13", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳999.00" },
    { id: "p2", name: "Nike Air Jordan", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳72.40" },
    { id: "p3", name: "T-shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳35.40" },
    { id: "p4", name: "Assorted Cross Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop", itemCode: "#FXZ-4567", price: "৳80.00" },
];

const ProductAnalytics = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-poppins">
            {/* 1. Best Selling Product Section */}
            <div className="lg:col-span-2 bg-white px-6 py-3 rounded-[8px] flex flex-col">
                <h2 className="text-lg font-bold text-[#23272E] font-lato mb-2">Best Selling Product</h2>

                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="bg-[#F3F6FF] rounded-[8px]">
                            <tr className="text-[13px] font-normal text-[#6A717F] uppercase">
                                <th className="py-3 px-4 rounded-l-[8px] font-medium">Product</th>
                                <th className="py-3 px-4 font-medium">Total Order</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 rounded-r-[8px] font-medium">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bestSellingData.map((item) => (
                                <tr key={item.id} className="text-sm">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-[4px] object-cover bg-gray-100" />
                                            <span className="font-semibold text-[#0F2D37]">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-600">{item.totalOrder}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${item.status === "Stock" ? "bg-green-500" : "bg-red-500"}`}></span>
                                            <span className={item.status === "Stock" ? "text-green-500" : "text-red-500"}>{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-bold text-[#0F2D37]">{item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        className="cursor-pointer font-lato px-8 py-1.5 border border-[#38BDF8] rounded-full text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
                        style={{
                            background: "linear-gradient(90deg, #38BDF8 0%, #1E90FF 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Details
                    </button>
                </div>
            </div>

            {/* 2. Top Products Section */}
            <div className="bg-white px-6 py-3 rounded-[8px]">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-lato font-bold text-[#23272E]">Top Products</h2>
                    <button
                        className="cursor-pointer font-lato text-[12px] font-normal transition-all hover:opacity-80"
                        style={{
                            background: "linear-gradient(90deg, #38BDF8 0%, #1E90FF 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        All product
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#F9FAFB] border-none rounded-[8px] py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-sky-200 outline-none placeholder:text-slate-400"
                    />
                </div>

                {/* Product List */}
                <div className="space-y-4">
                    {topProductsData.map((item, idx) => (
                        <div key={item.id}>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[4px] object-cover bg-gray-100" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#0F2D37]">{item.name}</h3>
                                        <p className="text-[10px] text-slate-400">Item: {item.itemCode}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-[#0F2D37] text-sm">{item.price}</span>
                            </div>
                            {idx !== topProductsData.length - 1 && <div className="mt-4 border-b border-gray-100"></div>}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductAnalytics;
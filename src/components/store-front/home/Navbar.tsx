// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FiMenu, FiX, FiSearch, FiChevronDown } from "react-icons/fi";
// import { LuUserRound as UserIcon } from "react-icons/lu";
// import FireIcon from "../svg/FireIcon";
// import WishIcon from "../svg/WishIcon";
// import CartIcon from "../svg/CartIcon";
// import { useAuthStore } from "@/store/useAuthStore";
// import CategoryDropdown from "./CategoryDropdown";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { fetchSettings } from "@/services-api/settingsService";
// import { Category, getCategoryTree } from "@/services-api/categoryService";
// import { apiFetch } from "@/utils/api";
// import { Product } from "@/@types/product.type";
// import { useDebounce } from "@/hooks/useDebounce";

// interface SearchResponse {
//   data: {
//     data: Product[];
//   };
// }
// const Navbar = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");

//   const { data: settings } = useQuery({
//     queryKey: ["settings"],
//     queryFn: fetchSettings,
//   });

//   const info = settings?.data || settings;
//   const logoUrl = info?.header_logo;

//   // 🚀 Refactored to only evaluate hydration & user metrics (dropping client token dependence)
//   const user = useAuthStore((state) => state.user);
//   const isStoreReady = useAuthStore((state) => state._hasHydrated);

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showPredictions, setShowPredictions] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [prevScrollPos, setPrevScrollPos] = useState(0);
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(
//     null,
//   );

//   const searchRef = useRef<HTMLFormElement>(null);
//   const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const debouncedSearch = useDebounce(searchQuery, 400);

//   const { data: categories = [] as Category[] } = useQuery<Category[]>({
//     queryKey: ["categories-tree"],
//     queryFn: getCategoryTree,
//     staleTime: 1000 * 60 * 30,
//   });

//   const {
//     data: searchResults,
//     isLoading,
//     isFetching,
//   } = useQuery<Product[]>({
//     queryKey: ["product-search", debouncedSearch],
//     queryFn: async () => {
//       if (!debouncedSearch.trim()) return [];
//       const res = await apiFetch(
//         `/products/search?page=1&limit=10&search=${debouncedSearch}`,
//       );
//       if (!res.ok) throw new Error("Failed to fetch");
//       const result: SearchResponse = await res.json();
//       return result.data?.data || [];
//     },
//     enabled: debouncedSearch.length >= 2,
//   });

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollPos = window.scrollY;
//       const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
//       setIsVisible(visible);
//       setPrevScrollPos(currentScrollPos);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [prevScrollPos]);

//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//         setShowPredictions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const handleProfileNav = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (isStoreReady && user) router.push("/profile");
//     else router.push("/signin");
//   };

//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setShowPredictions(false);
//     }
//   };

//   const backendBaseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
//     "http://localhost:8082";
//   const avatarUrl =
//     isStoreReady && user?.avatar
//       ? `${backendBaseUrl}/${user.avatar.replace(/^\/+/, "")}`
//       : null;

//   return (
//     <>
//       <header
//         className={`w-full bg-white font-inter z-50 sticky top-0 transition-transform duration-500 px-4 md:px-6 ${isVisible ? "translate-y-0" : "-translate-y-full"} ${prevScrollPos > 50 ? "shadow-md" : ""}`}
//       >
//         <div className="max-w-[1720px] mx-auto flex items-center justify-between py-4">
//           <button
//             onClick={() => setIsDrawerOpen(true)}
//             className="lg:hidden p-2 text-3xl shrink-0"
//           >
//             <FiMenu />
//           </button>

//           <Link href="/" className="shrink-0 flex items-center">
//             {/* The 'relative' class fixes the 'fill' warning */}
//             <div className="relative w-[120px] h-[35px] sm:w-[150px] sm:h-[45px] md:w-[180px] md:h-[50px] lg:w-[200px] lg:h-[55px] xl:w-[230px] xl:h-[64px]">
//               <Image
//                 src={logoUrl ? `${baseUrl}${logoUrl}` : "/images/logo.png"}
//                 alt="Creass Mart"
//                 fill
//                 priority
//                 unoptimized // Add this to bypass 'next/image' domain restriction without config changes
//                 className="object-contain"
//               />
//             </div>
//           </Link>

//           {/* Desktop Search Bar */}
//           <form
//             onSubmit={handleSearch}
//             ref={searchRef}
//             className="hidden lg:flex relative flex-1 max-w-[846px] bg-[#F2F2F2] rounded-[8px] items-center p-2 px-4 gap-3"
//           >
//             <CategoryDropdown
//               categories={categories}
//               onSelect={(cat: Category) => router.push(`/category/${cat.slug}`)}
//             />

//             <div className="h-6 w-px bg-[#E2E2E2]" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setShowPredictions(true);
//               }}
//               onFocus={() => setShowPredictions(true)}
//               placeholder="Search products..."
//               className="bg-transparent flex-1 outline-none text-[#727272]"
//             />
//             <button
//               type="submit"
//               className="bg-white p-2.5 rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors"
//             >
//               <FiSearch size={22} className="text-[#FF7050]" />
//             </button>

//             {/* Predictions */}
//             {showPredictions && searchQuery.length >= 2 && (
//               <div className="absolute top-[110%] left-0 w-full bg-white shadow-2xl rounded-lg border border-gray-100 z-120 overflow-hidden max-h-[450px] overflow-y-auto">
//                 {isLoading || isFetching ? (
//                   <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
//                     Searching...
//                   </div>
//                 ) : (
//                   (searchResults || []).map((product) => (
//                     <div
//                       key={product.id}
//                       onClick={() => {
//                         router.push(`/product/${product.slug}`);
//                         setShowPredictions(false);
//                         setSearchQuery("");
//                       }}
//                       className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
//                     >
//                       <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
//                         <Image
//                           src={product.images?.[0] || "/images/placeholder.png"}
//                           alt={product.name}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
//                           {product.name}
//                         </h4>
//                         <p className="text-[#FF7050] font-bold text-xs">
//                           BDT {product.sell_price}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </form>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-3">
//               <button className="cursor-pointer">
//                 <WishIcon className="w-8 md:w-10" />
//               </button>

//               <a
//                 href="#"
//                 onClick={handleProfileNav}
//                 className="cursor-pointer flex items-center justify-center"
//               >
//                 {avatarUrl ? (
//                   <Image
//                     src={avatarUrl}
//                     alt="User"
//                     fill
//                     className="rounded-full object-cover border border-gray-200"
//                   />
//                 ) : (
//                   <UserIcon
//                     className="w-full h-full text-black"
//                     strokeWidth={1.5}
//                     size={36}
//                   />
//                 )}
//               </a>
//             </div>
//             {isStoreReady && !user && (
//               <div className="hidden lg:flex items-center gap-4 uppercase font-semibold">
//                 <button
//                   onClick={() => router.push("/signin")}
//                   className="bg-[#F0F0F0] rounded-[8px] px-8 py-4"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => router.push("/signup")}
//                   className="bg-[#FF7050] text-white rounded-[8px] px-8 py-4"
//                 >
//                   Signup
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- DYNAMIC DESKTOP NAVIGATION (Fixed & Nested) --- */}
//         <nav className="hidden lg:block py-4 border-t border-gray-50">
//           <ul className="max-w-[1720px] mx-auto flex items-center justify-between md:px-8">
//             {(categories || []).slice(0, 8).map((item, idx) => (
//               <li
//                 key={item.id}
//                 className="relative flex items-center gap-1 group/main"
//                 onMouseEnter={() => {
//                   if (closeTimer.current) clearTimeout(closeTimer.current);
//                   setActiveDropdown(idx);
//                 }}
//                 onMouseLeave={() => {
//                   closeTimer.current = setTimeout(
//                     () => setActiveDropdown(null),
//                     120,
//                   );
//                 }}
//               >
//                 <span
//                   onClick={() => router.push(`/category/${item.slug}`)}
//                   className={`text-[18px] xl:text-[20px] cursor-pointer transition-colors font-medium ${activeDropdown === idx ? "text-[#FF7050]" : "text-[#5E5E5E]"}`}
//                 >
//                   {item.name}
//                 </span>
//                 {item.children && item.children.length > 0 && (
//                   <FiChevronDown
//                     className={
//                       activeDropdown === idx
//                         ? "text-[#FF7050]"
//                         : "text-[#5E5E5E]"
//                     }
//                   />
//                 )}

//                 {/* Recursive Multi-level Dropdown */}
//                 {item.children &&
//                   item.children.length > 0 &&
//                   activeDropdown === idx && (
//                     <NavDropdown items={item.children} isRoot={true} />
//                   )}
//               </li>
//             ))}
//             <li className="flex items-center gap-2 cursor-pointer font-bold text-[#FF7050]">
//               <FireIcon />
//               <span>HOT DEALS</span>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       {/* --- MOBILE SIDEBAR --- */}
//       <div
//         className={`fixed top-0 left-0 h-full w-[300px] bg-white z-210 transform transition-transform duration-500 lg:hidden shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         <div className="p-6 h-full flex flex-col">
//           <div className="flex justify-between items-center mb-8">
//             <Image src="/images/logo.png" alt="logo" width={140} height={40} />
//             <button
//               onClick={() => setIsDrawerOpen(false)}
//               className="text-2xl cursor-pointer"
//             >
//               <FiX />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {(categories || []).map((link, idx) => (
//               <div key={link.id} className="border-b border-gray-50">
//                 <div
//                   onClick={() =>
//                     setOpenMobileDropdown(
//                       openMobileDropdown === idx ? null : idx,
//                     )
//                   }
//                   className="flex justify-between py-4 text-gray-700 font-semibold cursor-pointer"
//                 >
//                   <span>{link.name}</span>
//                   {link.children && link.children.length > 0 && (
//                     <FiChevronDown
//                       className={openMobileDropdown === idx ? "rotate-180" : ""}
//                     />
//                   )}
//                 </div>
//                 {openMobileDropdown === idx &&
//                   link.children &&
//                   link.children.length > 0 && (
//                     <div className="pl-4 pb-4 space-y-3">
//                       {link.children.map((sub) => (
//                         <Link
//                           key={sub.id}
//                           href={`/category/${sub.slug}`}
//                           onClick={() => setIsDrawerOpen(false)}
//                           className="block text-gray-500 text-sm"
//                         >
//                           {sub.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Floating Cart */}
//       <div
//         onClick={() => setIsCartOpen(true)}
//         className="fixed right-0 top-1/2 -translate-y-1/2 z-90 flex flex-col items-center justify-center cursor-pointer bg-[#ff7050] rounded-l-xl w-[75px] md:w-[97px] h-[75px] md:h-[97px] shadow-2xl"
//       >
//         <CartIcon className="w-8 md:w-10 text-white" />
//         <span className="text-white text-xs md:text-base font-semibold mt-1">
//           2 Items
//         </span>
//       </div>

//       {/* --- CART DRAWER --- */}
//       <div
//         className={`fixed top-0 right-0 h-full w-[320px] md:w-[400px] bg-white z-[210] transform transition-transform duration-500 shadow-2xl ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="p-6 h-full flex flex-col">
//           <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
//             >
//               <FiX size={24} className="text-gray-500" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {/* Placeholder for Cart Items */}
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
//               <CartIcon className="w-20 h-20 opacity-50" />
//               <p className="text-lg">Your cart is empty</p>
//               <button
//                 onClick={() => setIsCartOpen(false)}
//                 className="mt-4 bg-[#FF7050] text-white px-8 py-3 rounded-[8px] font-medium hover:bg-[#e56548] transition-colors"
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {(isDrawerOpen || isCartOpen) && (
//         <div
//           className="fixed inset-0 bg-black/60 z-200"
//           onClick={() => {
//             setIsDrawerOpen(false);
//             setIsCartOpen(false);
//           }}
//         />
//       )}

//       {/* Mobile Bottom Nav */}
//       {isStoreReady && (
//         <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[70px] z-[190] flex justify-around items-center px-2 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] text-[#FF7050]">
//           {/* Home Button - Color is constant; active scales up and bolds up */}
//           <Link
//             href="/"
//             className={`flex flex-col items-center justify-center w-16 text-center active:scale-95 transition-all duration-200 ${
//               pathname === "/" ? "font-bold scale-110" : "font-normal"
//             }`}
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//               />
//             </svg>
//             <span className="text-[12px] mt-1 font-inter">Home</span>
//           </Link>
//           <button
//             onClick={() => setIsDrawerOpen(true)}
//             className="flex flex-col items-center"
//           >
//             <FiMenu size={22} />
//             <span className="text-[10px] mt-1">Category</span>
//           </button>

//           {/* Central Custom Floating Action Logo */}
//           <div className="relative -top-5 z-[200]">
//             <button className="bg-white rounded-full p-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.15)] w-[65px] h-[65px] flex items-center justify-center active:scale-95 transition-transform cursor-pointer">
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <img
//                   src="/images/minilogo.png"
//                   alt="Brand Logo"
//                   className="w-10 h-10 object-contain"
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                   }}
//                 />
//                 <span className="text-red-500 font-black text-2xl italic tracking-tighter"></span>
//               </div>
//             </button>
//           </div>
//           <button
//             onClick={() => useAuthStore.getState().setIsChatOpen(true)}
//             className="flex flex-col items-center"
//           >
//             <CartIcon className="w-6" />
//             <span className="text-[10px] mt-1">Chat</span>
//           </button>

//           {/* Login / Profile Button */}
//           <a
//             href="#"
//             onClick={handleProfileNav}
//             className={`flex flex-col items-center justify-center w-16 text-center active:scale-95 transition-all duration-200 cursor-pointer ${
//               pathname === "/profile" ||
//               pathname === "/signin" ||
//               pathname === "/signup"
//                 ? "font-bold scale-110"
//                 : "font-normal"
//             }`}
//           >
//             <UserIcon size={22} />
//             <span className="text-[10px] mt-1">
//               {user ? "Profile" : "Login"}
//             </span>
//           </a>
//         </div>
//       )}
//     </>
//   );
// };

// const NavDropdown = ({
//   items,
//   isRoot,
// }: {
//   items: Category[];
//   isRoot?: boolean;
// }) => {
//   return (
//     <div
//       className={`absolute ${
//         isRoot ? "top-full left-0 mt-4" : "top-0 left-full ml-1"
//       } w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-[9999] opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-300 transform origin-top`}
//     >
//       <ul className="py-2">
//         {items.map((subItem) => (
//           <li key={subItem.id} className="relative group/sub">
//             <Link
//               href={`/category/${subItem.slug}`}
//               className="px-4 py-2 text-sm text-gray-600 hover:text-[#FF7050] hover:bg-gray-50 flex items-center justify-between transition-colors"
//             >
//               {subItem.name}
//               {subItem.children && subItem.children.length > 0 && (
//                 <FiChevronDown className="-rotate-90 text-gray-400" />
//               )}
//             </Link>
//             {subItem.children && subItem.children.length > 0 && (
//               <NavDropdown items={subItem.children} />
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import { LuUserRound as UserIcon } from "react-icons/lu";
import FireIcon from "../svg/FireIcon";
import WishIcon from "../svg/WishIcon";
import CartIcon from "../svg/CartIcon";
import { useAuthStore } from "@/store/useAuthStore";
import CategoryDropdown from "./CategoryDropdown";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/services-api/settingsService";
import { Category, getCategoryTree } from "@/services-api/categoryService";
import { apiFetch } from "@/utils/api";
import { Product } from "@/@types/product.type";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResponse {
  data: {
    data: Product[];
  };
}

interface NavDropdownProps {
  items: Category[];
  isRoot?: boolean;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";
  const info = settings?.data || settings;
  const rowImage = info?.header_logo || "";
  const usableImageUrl = rowImage.startsWith("http")
    ? rowImage
    : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;

  const user = useAuthStore((state) => state.user);
  const isStoreReady = useAuthStore((state) => state._hasHydrated);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPredictions, setShowPredictions] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(
    null,
  );

  const searchRef = useRef<HTMLFormElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories-tree"],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 30,
  });

  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ["product-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      const res = await apiFetch(
        `/products/search?page=1&limit=10&search=${debouncedSearch}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const result: SearchResponse = await res.json();
      return result.data?.data || [];
    },
    enabled: debouncedSearch.length >= 2,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setIsVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleProfileNav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isStoreReady && user) router.push("/profile");
    else router.push("/signin");
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowPredictions(false);
    }
  };

  const avatarUrl =
    isStoreReady && user?.avatar
      ? user.avatar.startsWith("http")
        ? user.avatar
        : `${backendBaseUrl}/${user.avatar.replace(/^\/+/, "")}`
      : null;

  return (
    <>
      <header
        className={`w-full bg-white font-inter z-50 sticky top-0 transition-transform duration-500 px-4 md:px-6 ${isVisible ? "translate-y-0" : "-translate-y-full"} ${prevScrollPos > 50 ? "shadow-md" : ""}`}
      >
        <div className="max-w-[1720px] mx-auto flex items-center justify-between py-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-2 text-3xl shrink-0"
          >
            <FiMenu />
          </button>

          <Link href="/" className="shrink-0 flex items-center">
            <div className="relative w-[120px] h-[35px] sm:w-[150px] sm:h-[45px] md:w-[180px] md:h-[50px] lg:w-[200px] lg:h-[55px] xl:w-[230px] xl:h-[64px]">
              <Image
                src={usableImageUrl}
                alt="Creass Mart"
                fill
                priority
                unoptimized
                className="object-contain"
              />
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            ref={searchRef}
            className="hidden lg:flex relative flex-1 max-w-[846px] bg-[#F2F2F2] rounded-[8px] items-center p-2 px-4 gap-3"
          >
            <CategoryDropdown
              categories={categories}
              onSelect={(cat: Category) => router.push(`/category/${cat.slug}`)}
            />
            <div className="h-6 w-px bg-[#E2E2E2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowPredictions(true);
              }}
              onFocus={() => setShowPredictions(true)}
              placeholder="Search products..."
              className="bg-transparent flex-1 outline-none text-[#727272]"
            />
            <button
              type="submit"
              className="bg-white p-2.5 rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FiSearch size={22} className="text-[#FF7050]" />
            </button>

            {showPredictions && searchQuery.length >= 2 && (
              <div className="absolute top-[110%] left-0 w-full bg-white shadow-2xl rounded-lg border border-gray-100 z-120 overflow-hidden max-h-[450px] overflow-y-auto">
                {isLoading || isFetching ? (
                  <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
                    Searching...
                  </div>
                ) : (
                  (searchResults || []).map((product) => {
                    const rowImage = product.images?.[0] || "";
                    const iconUrl = rowImage.startsWith("http")
                      ? rowImage
                      : `${backendBaseUrl}/${rowImage.replace(/^\/+/, "")}`;
                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          router.push(`/product/${product.slug}`);
                          setShowPredictions(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                          <Image
                            src={iconUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[#FF7050] font-bold text-xs">
                            BDT {product.sell_price}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="cursor-pointer">
                <WishIcon className="w-8 md:w-10" />
              </button>

              {/* Fixed profile container to prevent layout breaking */}
              <div
                onClick={handleProfileNav}
                className="relative w-8 h-8 md:w-10 md:h-10 cursor-pointer flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-white"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="User"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <UserIcon
                    className="w-full h-full text-black p-1"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>
            {isStoreReady && !user && (
              <div className="hidden lg:flex items-center gap-4 uppercase font-semibold">
                <button
                  onClick={() => router.push("/signin")}
                  className="bg-[#F0F0F0] rounded-[8px] px-8 py-4"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-[#FF7050] text-white rounded-[8px] px-8 py-4"
                >
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="hidden lg:block py-4 border-t border-gray-50">
          <ul className="max-w-[1720px] mx-auto flex items-center justify-between md:px-8">
            {(categories || []).slice(0, 8).map((item, idx) => (
              <li
                key={item.id}
                className="relative flex items-center gap-1 group/main"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setActiveDropdown(idx);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(
                    () => setActiveDropdown(null),
                    120,
                  );
                }}
              >
                <span
                  onClick={() => router.push(`/category/${item.slug}`)}
                  className={`text-[18px] xl:text-[20px] cursor-pointer transition-colors font-medium ${activeDropdown === idx ? "text-[#FF7050]" : "text-[#5E5E5E]"}`}
                >
                  {item.name}
                </span>
                {item.children && item.children.length > 0 && (
                  <FiChevronDown
                    className={
                      activeDropdown === idx
                        ? "text-[#FF7050]"
                        : "text-[#5E5E5E]"
                    }
                  />
                )}
                {item.children &&
                  item.children.length > 0 &&
                  activeDropdown === idx && (
                    <NavDropdown items={item.children} isRoot={true} />
                  )}
              </li>
            ))}
            <li className="flex items-center gap-2 cursor-pointer font-bold text-[#FF7050]">
              <FireIcon />
              <span>HOT DEALS</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[210] transform transition-transform duration-500 lg:hidden shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Image src="/images/logo.png" alt="logo" width={140} height={40} />
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <FiX />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {(categories || []).map((link, idx) => (
              <div key={link.id} className="border-b border-gray-50">
                <div
                  onClick={() =>
                    setOpenMobileDropdown(
                      openMobileDropdown === idx ? null : idx,
                    )
                  }
                  className="flex justify-between py-4 text-gray-700 font-semibold cursor-pointer"
                >
                  <span>{link.name}</span>
                  {link.children && link.children.length > 0 && (
                    <FiChevronDown
                      className={openMobileDropdown === idx ? "rotate-180" : ""}
                    />
                  )}
                </div>
                {openMobileDropdown === idx &&
                  link.children &&
                  link.children.length > 0 && (
                    <div className="pl-4 pb-4 space-y-3">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.slug}`}
                          onClick={() => setIsDrawerOpen(false)}
                          className="block text-gray-500 text-sm"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      <div
        onClick={() => setIsCartOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-90 flex flex-col items-center justify-center cursor-pointer bg-[#ff7050] rounded-l-xl w-[75px] md:w-[97px] h-[75px] md:h-[97px] shadow-2xl"
      >
        <CartIcon className="w-8 md:w-10 text-white" />
        <span className="text-white text-xs md:text-base font-semibold mt-1">
          2 Items
        </span>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] md:w-[400px] bg-white z-[210] transform transition-transform duration-500 shadow-2xl ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <FiX size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <CartIcon className="w-20 h-20 opacity-50" />
            <p className="text-lg">Your cart is empty</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-[#FF7050] text-white px-8 py-3 rounded-[8px] font-medium hover:bg-[#e56548]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {(isDrawerOpen || isCartOpen) && (
        <div
          className="fixed inset-0 bg-black/60 z-200"
          onClick={() => {
            setIsDrawerOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}

      {/* --- RESTORED ORIGINAL MOBILE BOTTOM NAV --- */}
      {isStoreReady && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[70px] z-[190] flex justify-around items-center px-2 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] text-[#FF7050]">
          {/* Home Button */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-16 text-center active:scale-95 transition-all duration-200 ${
              pathname === "/" ? "font-bold scale-110" : "font-normal"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-[12px] mt-1 font-inter">Home</span>
          </Link>

          {/* Category Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center"
          >
            <FiMenu size={22} />
            <span className="text-[10px] mt-1">Category</span>
          </button>

          {/* Central Custom Floating Logo */}
          <div className="relative -top-5 z-[200]">
            <button className="bg-white rounded-full p-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.15)] w-[65px] h-[65px] flex items-center justify-center active:scale-95 transition-transform cursor-pointer">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/images/minilogo.png"
                  alt="Brand"
                  className="w-10 h-10 object-contain"
                />
              </div>
            </button>
          </div>

          {/* Chat Button (uses CartIcon per original design) */}
          <button
            onClick={() => useAuthStore.getState().setIsChatOpen?.(true)}
            className="flex flex-col items-center"
          >
            <CartIcon className="w-6" />
            <span className="text-[10px] mt-1">Chat</span>
          </button>

          {/* Login / Profile Button */}
          <a
            href="#"
            onClick={handleProfileNav}
            className={`flex flex-col items-center justify-center w-16 text-center active:scale-95 transition-all duration-200 cursor-pointer ${
              pathname === "/profile" ||
              pathname === "/signin" ||
              pathname === "/signup"
                ? "font-bold scale-110"
                : "font-normal"
            }`}
          >
            <UserIcon size={22} />
            <span className="text-[10px] mt-1">
              {user ? "Profile" : "Login"}
            </span>
          </a>
        </div>
      )}
    </>
  );
};

const NavDropdown = ({ items, isRoot }: NavDropdownProps) => {
  return (
    <div
      className={`absolute ${isRoot ? "top-full left-0 mt-4" : "top-0 left-full ml-1"} w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-[9999] opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-300 transform origin-top`}
    >
      <ul className="py-2">
        {items.map((subItem) => (
          <li key={subItem.id} className="relative group/sub">
            <Link
              href={`/category/${subItem.slug}`}
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#FF7050] hover:bg-gray-50 flex items-center justify-between transition-colors"
            >
              {subItem.name}
              {subItem.children && subItem.children.length > 0 && (
                <FiChevronDown className="-rotate-90 text-gray-400" />
              )}
            </Link>
            {subItem.children && subItem.children.length > 0 && (
              <NavDropdown items={subItem.children} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;

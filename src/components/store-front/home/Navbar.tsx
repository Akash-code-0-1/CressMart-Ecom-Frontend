"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { LuUserRound as UserIcon } from "react-icons/lu";
import FireIcon from "../svg/FireIcon";
import WishIcon from "../svg/WishIcon";
import CartIcon from "../svg/CartIcon";
import { useAuthStore } from "@/store/useAuthStore";
import CategoryDropdown from "./CategoryDropdown";
import { apiFetch } from "@/utils/api";
import { getCategoryTree, Category } from "@/services-api/categoryService";

// --- Types ---
interface Product {
  id: string;
  name: string;
  slug: string;
  sell_price: string;
  images: string[] | null;
  category_id: string;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

interface SearchResponse {
  success: boolean;
  data: {
    data: Product[];
    pagination: Pagination; // Fixed 'any' type error
  };
}

// --- Recursive Dropdown Component for Desktop ---
const NavDropdown = ({
  items,
  isRoot = false,
}: {
  items: Category[];
  isRoot?: boolean;
}) => {
  return (
    <div
      className={`absolute bg-white shadow-2xl py-2 border border-gray-100 z-110 min-w-[240px] 
      ${isRoot ? "top-full left-0 rounded-b-xl" : "top-0 left-full rounded-xl ml-px"}`}
    >
      {items.map((item) => (
        <div key={item.id} className="relative group/submenu">
          <Link
            href={`/category/${item.slug}`}
            className="flex items-center justify-between px-5 py-3 text-[#5E5E5E] hover:text-[#FF7050] hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <span className="text-[15px] font-medium">{item.name}</span>
            {item.children && item.children.length > 0 && (
              <FiChevronRight className="text-gray-400" />
            )}
          </Link>

          {/* Recursively render grandchildren if they exist */}
          {item.children && item.children.length > 0 && (
            <div className="hidden group-hover/submenu:block">
              <NavDropdown items={item.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- Custom Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Navbar = () => {
  const router = useRouter();

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

  const { data: categories = [] as Category[] } = useQuery<Category[]>({
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

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";
  const avatarUrl =
    isStoreReady && user?.avatar
      ? `${backendBaseUrl}/${user.avatar.replace(/^\/+/, "")}`
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

          <Link
            href="/"
            className="shrink-0 relative w-[120px] h-[35px] sm:w-[150px] sm:h-[45px] lg:w-[200px] lg:h-[55px]"
          >
            <Image
              src="/images/logo.png"
              alt="Creass Mart"
              fill
              priority
              sizes="200px"
              className="object-contain"
            />
          </Link>

          {/* Desktop Search Bar */}
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

            {/* Predictions */}
            {showPredictions && searchQuery.length >= 2 && (
              <div className="absolute top-[110%] left-0 w-full bg-white shadow-2xl rounded-lg border border-gray-100 z-120 overflow-hidden max-h-[450px] overflow-y-auto">
                {isLoading || isFetching ? (
                  <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
                    Searching...
                  </div>
                ) : (
                  (searchResults || []).map((product) => (
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
                          src={product.images?.[0] || "/images/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
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
                  ))
                )}
              </div>
            )}
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="cursor-pointer">
                <WishIcon className="w-8 md:w-10" />
              </button>
              <a
                href="#"
                onClick={handleProfileNav}
                className="cursor-pointer relative w-8 md:w-10 h-8 md:h-10"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="User"
                    fill
                    className="rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <UserIcon
                    className="w-full h-full text-black"
                    strokeWidth={1.2}
                  />
                )}
              </a>
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

        {/* --- DYNAMIC DESKTOP NAVIGATION (Fixed & Nested) --- */}
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

                {/* Recursive Multi-level Dropdown */}
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

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-210 transform transition-transform duration-500 lg:hidden shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
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

      {(isDrawerOpen || isCartOpen) && (
        <div
          className="fixed inset-0 bg-black/60 z-200"
          onClick={() => {
            setIsDrawerOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}

      {/* Mobile Bottom Nav */}
      {isStoreReady && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-[70px] z-190 flex justify-around items-center text-[#FF7050]">
          <Link href="/" className="flex flex-col items-center">
            <FiSearch size={22} />
            <span className="text-[10px] mt-1">Home</span>
          </Link>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center"
          >
            <FiMenu size={22} />
            <span className="text-[10px] mt-1">Category</span>
          </button>
          <div className="relative -top-5">
            <div className="bg-white p-2 rounded-full shadow-lg border w-14 h-14 flex items-center justify-center">
              <Image
                src="/images/minilogo.png"
                alt="logo"
                width={32}
                height={32}
              />
            </div>
          </div>
          <button
            onClick={() => useAuthStore.getState().setIsChatOpen(true)}
            className="flex flex-col items-center"
          >
            <CartIcon className="w-6" />
            <span className="text-[10px] mt-1">Chat</span>
          </button>
          <button
            onClick={handleProfileNav}
            className="flex flex-col items-center"
          >
            <UserIcon size={22} />
            <span className="text-[10px] mt-1">
              {user ? "Profile" : "Login"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;

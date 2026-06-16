"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import ChevronDownIcon from "../svg/ChevronDownIcon";
import FireIcon from "../svg/FireIcon";
import WishIcon from "../svg/WishIcon";
import CartIcon from "../svg/CartIcon";
import { FaFireAlt } from "react-icons/fa";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(
    null,
  );

  // Sticky and Scroll Visibility Logic
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cart Example Data
  const [cartItems] = useState([
    {
      id: 1,
      name: "PlayStation 5 Console",
      price: 65000,
      qty: 1,
      image: "/images/store-front/products/product02.png",
    },
    {
      id: 2,
      name: "Awei Y525 RGB Speaker",
      price: 2050,
      qty: 2,
      image: "/images/store-front/products/product02.png",
    },
  ]);

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

  const navLinks = [
    {
      name: "All Categories",
      dropdown: true,
      subItems: ["Electronics", "Fashion", "Home Decor"],
    },
    {
      name: "Gadget & Tools",
      dropdown: true,
      subItems: ["Smartphones", "Laptops"],
    },
    {
      name: "Essentials",
      dropdown: true,
      subItems: ["Grocery", "Daily Needs"],
    },
    { name: "Kids Zone", dropdown: true, subItems: ["Toys", "Baby Care"] },
    {
      name: "Health, Organic & Supplements",
      dropdown: true,
      subItems: ["Vitamins"],
    },
    { name: "Safety & Security", dropdown: true, subItems: ["CCTV"] },
    { name: "Gift Item", dropdown: true, subItems: ["Birthday"] },
  ];

  const toggleMobileDropdown = (index: number) => {
    setOpenMobileDropdown(openMobileDropdown === index ? null : index);
  };

  return (
    <>
      <header
        className={`
          w-full bg-white font-inter z-50 sticky top-0 left-0 px-4 md:px-6
          transition-transform duration-500 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${prevScrollPos > 50 ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)]" : ""}
        `}
      >
        {/* TOP SECTION - 1720px */}
        <div className="max-w-[1720px] mx-auto flex items-center justify-between py-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-2 text-black text-3xl shrink-0 cursor-pointer"
          >
            <FiMenu />
          </button>

          <Link href="/" className="shrink-0">
            <div className="relative w-[120px] h-[35px] xl:w-[230px] lg:w-[200px] md:w-[180px] sm:w-[150px] xl:h-[64px] lg:h-[55px] md:h-[50px] sm:h-[45px]">
              <Image
                src="/images/logo.png"
                alt="Creass Mart"
                fill
                sizes="(max-width: 768px) 120px, 230px"
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-[846px] bg-[#F2F2F2] rounded-[8px] items-center xl:p-[8px_8px_8px_24px] lg:p-[8px_8px_8px_16px] md:p-[8px_8px_8px_8px] gap-1 lg:gap-3 xl:gap-6">
            <div className="flex items-center gap-2 cursor-pointer px-2">
              <span className="text-black text-sm font-medium whitespace-nowrap">
                All Categories
              </span>
              <ChevronDownIcon />
            </div>
            <div className="h-6 w-[1.5px] bg-[#E2E2E2]" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent flex-1 outline-none text-[#727272] text-[16px]"
            />
            <button className="cursor-pointer bg-white p-2.5 rounded-[8px]">
              <FiSearch size={22} className="text-[#FF7050]" />
            </button>
          </div>

          {/* Icons & Auth Buttons */}
          <div className="flex items-center gap-1 md:gap-3 lg:gap-3 xl:gap-8">
            <WishIcon className="w-8 md:w-10 cursor-pointer" />
            <div className="hidden lg:flex items-center gap-4">
              <button className="bg-[#F0F0F0] rounded-[8px] font-semibold xl:text-[16px] lg:text-[14px] text-[12px] uppercase xl:px-10 lg:px-6 md:px-4 py-4 font-inter cursor-pointer">
                Login
              </button>
              <button className="font-semibold uppercase text-white bg-[#FF7050] xl:text-[16px] lg:text-[14px] text-[12px] rounded-[8px] xl:px-10 lg:px-6 md:px-4 py-4 font-inter cursor-pointer">
                Signup
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden lg:block py-4">
          <div className="max-w-[1720px] mx-auto">
            <ul className="flex items-center flex-wrap justify-between gap-y-2 md:px-8 px-0">
              {navLinks.map((item, idx) => (
                <li
                  key={idx}
                  className="relative flex items-center gap-1"
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
                    className={`xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px] cursor-pointer font-medium transition-all ${activeDropdown === idx ? "text-[#FF7050]" : "text-[#5E5E5E]"}`}
                  >
                    {item.name}
                  </span>
                  {item.dropdown && (
                    <FiChevronDown
                      className={
                        activeDropdown === idx
                          ? "text-[#FF7050]"
                          : "text-[#5E5E5E]"
                      }
                    />
                  )}

                  {item.dropdown && activeDropdown === idx && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-[#F2F2F2] shadow-2xl rounded-b-xl z-[110]">
                      <div className="py-2 flex flex-col">
                        {item.subItems?.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href="#"
                            className="px-6 py-3 hover:bg-[#F9F9F9] text-[#5E5E5E] hover:text-[#FF7050] text-base cursor-pointer"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <div className="flex items-center gap-2 cursor-pointer group shrink-0">
                <FireIcon />
                <span className="text-black font-semibold uppercase text-[16px]">
                  HOT DEALS
                </span>
              </div>
            </ul>
          </div>
        </nav>
      </header>

      {/* BANNER SPACER */}
      <div
        onClick={() => setIsCartOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] flex flex-col items-center justify-center cursor-pointer transition-all hover:brightness-110 active:scale-95 shadow-2xl"
        style={{
          width: "clamp(75px, 10vw, 97px)",
          height: "clamp(75px, 10vw, 97px)",
          backgroundColor: "#ff7050",
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      >
        <CartIcon className="w-10 text-white" />
        <span className="text-white text-[12px] md:text-base font-semibold mt-1 text-center font-poppins">
          2 Items
        </span>
      </div>

      {/* --- MOBILE SIDEBAR DRAWER (LEFT) --- */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-[210] transform transition-transform duration-500 ease-in-out lg:hidden shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between mb-8">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={160}
              height={45}
              sizes="(max-width: 768px) 120px, 160px"
              className="w-[120px] md:w-[160px] object-contain"
              style={{ height: "auto" }}
            />
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-3xl text-black cursor-pointer"
            >
              <FiX />
            </button>
          </div>

          <div className="flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button className="w-full sm:flex-1 py-2 md:py-4 text-base md:text-xl font-bold bg-[#F2F2F2] rounded-lg uppercase tracking-wide cursor-pointer font-inter">
                LOGIN
              </button>
              <button className="w-full sm:flex-1 py-2 md:py-4 text-base md:text-xl font-bold bg-[#FF7050] text-white rounded-lg uppercase tracking-wide cursor-pointer font-inter">
                SIGNUP
              </button>
            </div>

            <div className="h-[1px] bg-[#F2F2F2] w-full" />

            {/* Mobile Navigation List */}
            <ul className="flex flex-col">
              {navLinks.map((link, idx) => (
                <li
                  key={idx}
                  className="flex flex-col border-b border-[#F9F9F9]"
                >
                  <div
                    onClick={() => toggleMobileDropdown(idx)}
                    className={`flex items-center justify-between py-4 cursor-pointer transition-colors ${openMobileDropdown === idx ? "text-[#FF7050]" : "text-[#727272]"}`}
                  >
                    <span className="font-semibold text-base md:text-lg font-inter">{link.name}</span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${openMobileDropdown === idx ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Mobile Dropdown Sub-items */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openMobileDropdown === idx ? "max-h-96 pb-4" : "max-h-0"}`}
                  >
                    <ul className="pl-4 space-y-3">
                      {link.subItems?.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            href="#"
                            className="text-gray-500 text-base block py-1 hover:text-[#FF7050]"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
              <li className="flex items-center gap-2 text-black font-bold uppercase py-6 font-inter">
                <FaFireAlt color="#FF764A" /> HOT DEALS
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- CART DRAWER CONTENT (RIGHT) --- */}
      <div
        className={`font-inter fixed top-0 right-0 h-full w-[320px] md:w-[450px] bg-white z-[210] transform transition-transform duration-500 shadow-2xl ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 bg-[#F9F9F9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CartIcon className="w-8" />
              <span className="font-poppins font-medium text-xl text-black">
                Shopping Cart
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-3xl text-black hover:text-black transition-colors cursor-pointer"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 group">
                <div className="bg-[#F2F2F2] rounded-lg relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover h-full"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-black font-medium text-base line-clamp-1">
                      {item.name}
                    </h4>
                    {/* 🗑️ Remove button */}
                    <button
                      //   onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 mt-0.5"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="">
                    <p className="text-[#FF7050] font-bold text-lg py-2">
                      BDT {item.price}
                    </p>
                    <div className="flex items-center border w-fit border-gray-200 rounded-md">
                      {/* ➖ Decrement */}
                      <button
                        // onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-1 px-2 cursor-pointer hover:bg-gray-100 transition-colors rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 text-sm font-bold border-x border-gray-200">
                        {item.qty}
                      </span>
                      {/* ➕ Increment */}
                      <button
                        // onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-1 px-2 cursor-pointer hover:bg-gray-100 transition-colors rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Subtotal:</span>
              <span className="text-black font-bold text-xl">BDT 69,100</span>
            </div>
            <button className="w-full py-4 bg-[#FF7050] text-white rounded-xl font-bold uppercase shadow-lg shadow-orange-100 hover:brightness-105 transition-all cursor-pointer">
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAY --- */}
      {(isDrawerOpen || isCartOpen) && (
        <div
          className="fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300"
          onClick={() => {
            setIsDrawerOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// React Icons
import { FiMapPin, FiPhoneCall, FiMail, FiClock } from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTelegramPlane,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      "About Us",
      "Shipping & Delivery",
      "Return & Exchange",
      "Privacy",
      "Terms & Conditions",
      "FAQs",
    ],
    account: [
      "Sign In",
      "View Cart",
      "My Wishlist",
      "Track My Order",
      "Help Ticket",
      "Customer Testimonials",
    ],
    corporate: [
      "Become a Vendor",
      "Affiliate Program",
      "Our Blog",
      "Career",
      "Display Center",
      "Our Suppliers",
    ],
  };

  const socialLinks = [
    {
      name: "facebook",
      icon: <FaFacebook />,
      url: "www.facebook.com/creasssmart",
      color: "text-[#1877F2]",
    },
    {
      name: "instagram",
      icon: <FaInstagram />,
      url: "www.instagram.com/creasssmart",
      color: "text-[#E4405F]",
    },
    {
      name: "youtube",
      icon: <FaYoutube />,
      url: "www.youtube.com/creasssmart",
      color: "text-[#FF0000]",
    },
    {
      name: "linkedin",
      icon: <FaLinkedin />,
      url: "www.linkedin.com/creasssmart",
      color: "text-[#0A66C2]",
    },
    {
      name: "telegram",
      icon: <FaTelegramPlane />,
      url: "www.telegram.com/creasssmart",
      color: "text-[#229ED9]",
    },
  ];

  return (
    <footer className="w-full bg-white font-inter pt-20">
      <div className="max-w-[1720px] mx-auto px-4 md:px-10">
        {/* --- Top Section: Links & Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-5 mb-16">
          {/* Column 1: Info & Contact */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-6 md:mb-8 max-w-[180px] sm:max-w-[210px] md:max-w-[230px] w-full"
            >
              <Image
                src="/images/logo.png"
                alt="Creass Mart"
                width={230}
                height={64}
                className="w-full object-contain"
                priority
                style={{ height: "auto" }}
              />
            </Link>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#FF7050] text-xl shrink-0 mt-1" />
                <p className="text-[#727272] text-[15px] font-medium leading-normal">
                  <span className="text-[#727272] font-bold">Address:</span>{" "}
                  Dhaka Bangladesh
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhoneCall className="text-[#FF7050] text-xl shrink-0" />
                <p className="text-[#727272] text-[15px] font-medium leading-normal">
                  <span className="text-[#727272] font-bold">Call Us:</span>{" "}
                  01904300117
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-[#FF7050] text-xl shrink-0" />
                <p className="text-[#727272] text-[15px] font-medium leading-normal">
                  <span className="text-[#727272] font-bold">Email:</span>{" "}
                  info@creasssmart.com
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="text-[#FF7050] text-xl shrink-0" />
                <p className="text-[#727272] text-[15px] font-medium leading-normal">
                  <span className="text-[#727272] font-bold">Hours:</span>{" "}
                  10:00-18:00, Sat-Thu
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-black font-poppins text-[22px] font-semibold mb-8">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-[#727272] hover:text-[#FF7050] transition-colors text-[15px] font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h4 className="text-black font-poppins text-[22px] font-semibold mb-8">
              Account
            </h4>
            <ul className="space-y-4">
              {footerLinks.account.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-[#727272] hover:text-[#FF7050] transition-colors text-[15px] font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Corporate */}
          <div>
            <h4 className="text-black font-poppins text-[22px] font-semibold mb-8">
              Corporate
            </h4>
            <ul className="space-y-4">
              {footerLinks.corporate.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-[#727272] hover:text-[#FF7050] transition-colors text-[15px] font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Socials */}
          <div>
            <h4 className="text-black font-poppins text-[22px] font-semibold mb-8">
              Get In Touch
            </h4>
            <div className="space-y-5">
              {socialLinks.map((social) => (
                <div
                  key={social.name}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    className={`${social.color} text-2xl group-hover:scale-110 transition-transform`}
                  >
                    {social.icon}
                  </div>
                  <span className="text-[#727272] text-[14px] font-medium group-hover:text-black transition-colors truncate">
                    {social.url}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Payment Logos Section --- */}
        <div className="w-full border-b border-[#D9DBE9] py-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Image
              src="/images/paymentIcons.png"
              alt="Payments"
              width={1709}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* --- Bottom Copyright --- */}
        <div className="py-4 text-center">
          <p className="text-[#727272] text-[15px] font-medium">
            Copyright {currentYear} © Creass Mart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

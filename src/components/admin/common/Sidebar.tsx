"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sidebarMenu } from "@/config/sidebar";
import { SidebarHeader } from "./SidebarHeader";
import { NavMenuGroup } from "./NavMenuGroup";
import { NavSingleItem } from "./NavSingleItem";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const activeItemStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg, rgba(56, 189, 248, 0.10) 0%, rgba(30, 144, 255, 0.10) 100%)",
  borderRight: "1px solid #14B7FF",
  borderRadius: "5px",
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialStates: Record<string, boolean> = {};
    sidebarMenu.forEach((section) => {
      section.items.forEach((item) => {
        if (item.submenu) {
          initialStates[item.label] = item.submenu.some(
            (sub) =>
              pathname === sub.href || pathname.startsWith(`${sub.href}/`),
          );
        }
      });
    });
    return initialStates;
  });

  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const sidebarContent = (
    <aside className="w-64 h-full flex flex-col overflow-y-auto custom-scrollbar pt-4 bg-white">
      <SidebarHeader onClose={onClose} />

      <nav className="flex-1 mt-2 font-poppins">
        {sidebarMenu.map((section) => (
          <div key={section.section}>
            <p className="px-6 mt-6 mb-2 text-base font-normal text-[#777]">
              {section.section}
            </p>

            {section.items.map((item) => {
              if (item.submenu) {
                return (
                  <NavMenuGroup
                    key={item.label}
                    item={item}
                    isOpen={!!openMenus[item.label]}
                    pathname={pathname}
                    activeItemStyle={activeItemStyle}
                    onToggle={() => toggleMenu(item.label)}
                  />
                );
              }
              return (
                <NavSingleItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  activeItemStyle={activeItemStyle}
                />
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop persistent navigation view block layout */}
      <div className="hidden md:block h-screen">{sidebarContent}</div>

      {/* Mobile interactive target responsive window slide overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
          />
          <div className="absolute left-0 top-0 h-full w-64 shadow-xl animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

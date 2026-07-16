import AOrderIcon from "@/components/store-front/svg/svg/AOrderIcon";
import ADashboardIcon from "@/components/store-front/svg/svg/ADashboardIcon";
import DashboardIcon from "@/components/store-front/svg/svg/DashboardIcon";
import OrderIcon from "@/components/store-front/svg/svg/OrderIcon";
import { UserCheck, Settings2, Lock } from "lucide-react";
import ProductIcon from "@/components/store-front/svg/svg/sidebar-icon/ProductIcon";
import AProductIcon from "@/components/store-front/svg/svg/sidebar-icon/AProductIcon";
import CatalogIcon from "@/components/store-front/svg/svg/sidebar-icon/CatalogIcon";
import ACalalogIcon from "@/components/store-front/svg/svg/sidebar-icon/ACalalogIcon";
import Inventory from "@/components/store-front/svg/svg/sidebar-icon/Inventory";
import ActiveInventoryIcon from "@/components/store-front/svg/svg/ActiveInventoryIcon";
import CustomerIcon from "@/components/store-front/svg/svg/sidebar-icon/CustomerIcon";
import WebsiteIcon from "@/components/store-front/svg/svg/sidebar-icon/WebsiteIcon";
import AwebsiteIcon from "@/components/store-front/svg/svg/AwebsiteIcon";
import SettingsIcon from "@/components/store-front/svg/svg/sidebar-icon/SettingsIcon";
import AdminShildIcon from "@/components/store-front/svg/svg/sidebar-icon/AdminShildIcon";

export const sidebarMenu = [
  {
    section: "Main Menu",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard/home",
        icon: DashboardIcon,
        activeIcon: ADashboardIcon,
      },
      {
        label: "Orders",
        href: "/admin/dashboard/order",
        icon: OrderIcon,
        activeIcon: AOrderIcon,
      },
      {
        label: "Products",
        href: "/admin/dashboard/products",
        icon: ProductIcon,
        activeIcon: AProductIcon,
      },
      {
        label: "Catalog",
        icon: CatalogIcon,
        activeIcon: ACalalogIcon,
        submenu: [
          {
            label: "Category",
            href: "/admin/dashboard/category",
          },
          {
            label: "Sub Category",
            href: "/admin/dashboard/sub-category",
          },
          {
            label: "Child Category",
            href: "/admin/dashboard/child-category",
          },
          {
            label: "Brands",
            href: "/admin/dashboard/brand",
          },
          {
            label: "Tags",
            href: "/admin/dashboard/tag",
          },
        ],
      },
      {
        label: "Inventory",
        href: "/admin/dashboard/inventory",
        icon: Inventory,
        activeIcon: ActiveInventoryIcon,
      },
      {
        label: "Customers & Review",
        href: "/admin/dashboard/review",
        icon: CustomerIcon,
        activeIcon: UserCheck,
      },
    ],
  },

  {
    section: "Configuration",
    items: [
      {
        label: "Website Content",
        href: "/admin/dashboard/content",
        icon: WebsiteIcon,
        activeIcon: AwebsiteIcon,
        submenu: [
          {
            label: "Carousal",
            href: "/admin/dashboard/carousel",
          },
          {
            label: "Banners",
            href: "/admin/dashboard/banner",
          },
          {
            label: "Popups",
            href: "/admin/dashboard/popup",
          },
          {
            label: "Blogs",
            href: "/admin/dashboard/blog",
          },
          {
            label: "Landing Page",
            href: "/admin/dashboard/landing-page",
          },
        ],
      },
    ],
  },

  {
    section: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/dashboard/settings/information",
        icon: SettingsIcon,
        activeIcon: Settings2,
      },
      {
        label: "Admin Control",
        href: "/admin/dashboard/admin-control",
        icon: AdminShildIcon,
        activeIcon: Lock,
      },
    ],
  },
];

"use client";
import {
  Plus,
  Calendar,
  Barcode,
  ChevronDown,
  CheckCircle2,
  Circle,
} from "lucide-react";
import AddHeader from "./AddHeader";
import GeneralInfo from "./GeneralInfo";
import { Label } from "./Label";
import { Input } from "./Input";
import { SectionWrapper } from "./SectionWrapper";
import ProductVariant from "./ProductVariant";
import InventorySection from "./InventorySection";
import ShippingSection from "./ShippingSection";
import SeoSection from "./SeoSection";
import SeconderyButton from "../../common/SeconderyButton";
import CloseIcon from "@/components/store-front/svg/svg/CloseIcon";

export default function ProductUploadMain() {
  return (
    <div className="w-full min-h-screen font-lato">
      <div className="">
        {/* Header Area */}
        <AddHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:mx-4 mx-2">
          {/* LEFT COLUMN: FORM SECTIONS */}
          <div className="lg:col-span-8">
            {/* General Info */}
            <GeneralInfo />

            {/* Pricing Section */}
            <SectionWrapper title="Pricing">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <Label required>Sell/Current Price</Label>
                  <Input placeholder="0" />
                </div>
                <div>
                  <Label required>Regular/Old Price</Label>
                  <Input placeholder="0" />
                </div>
                <div>
                  <Label>Cost Price (Optional)</Label>
                  <Input placeholder="0" />
                </div>
              </div>
            </SectionWrapper>

            {/* Inventory Section */}
            <InventorySection Barcode={Barcode} Calendar={Calendar} />

            {/* Product Variants Section */}
            <ProductVariant />
            {/* Brand Section */}
            <SectionWrapper
              title="Brand"
              description="You can add multiple product details for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
                <div>
                  <Label>Brand Name</Label>
                  <Input placeholder="Samsung" />
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label>Model Name</Label>
                    <Input placeholder="S23 Ultra" />
                  </div>
                  <button className=" cursor-pointer bg-[#FEF5F5] p-2.5 text-red-400 hover:bg-red-50 rounded-[8px] transition-colors">
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <SeconderyButton
                  label="Create a new Brand"
                  icon={
                    <Plus
                      size={21}
                      strokeWidth={1.5}
                      color="black"
                      className="border border-w-[1.5px] rounded-full"
                    />
                  }
                />
              </div>
            </SectionWrapper>
            <SectionWrapper title="Shipping">
              <ShippingSection />
            </SectionWrapper>

            <SeoSection />

            {/* Affiliate Section */}
            {/* <SectionWrapper title="Affiliate">
                            <Label>Product Source (Optional)</Label>
                            <div className="bg-[#F9FAFB] px-4 py-3 rounded-[8px] text-sm text-gray-500 flex justify-between items-center mb-6">
                                AliExpress (marketplace) <ChevronDown size={16} />
                            </div>

                            <div className="bg-[#FFF8F1] rounded-[8px] p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-600 rounded-[8px] flex items-center justify-center text-white text-xs font-bold">Ali</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 leading-none">AliExpress</p>
                                            <p className="text-[9px] text-blue-500">www.aliexpress.com</p>
                                        </div>
                                    </div>
                                    <span className="bg-[#F7931E] text-white text-[9px] font-bold px-3 py-1 rounded-[8px]">Marketplace</span>
                                </div>

                                <div className="bg-white rounded-[8px] p-4 mb-4">
                                    <Label subLabel="Optional">Source Product URL</Label>
                                    <Input placeholder="www.xyz.com/product/123" />
                                    <p className="text-[10px] text-gray-400 mt-1">Direct link to this product on the source platform</p>
                                </div>

                                <div className="bg-white rounded-[8px] p-4 mb-4">
                                    <Label subLabel="Optional">Source SKU / Product Code</Label>
                                    <Input placeholder="ABC-XYZ-123" />
                                    <p className="text-[10px] text-gray-400 mt-1">Product identifier from the source (SKU, Product ID, etc.)</p>
                                </div>

                                <div className="bg-[#F9FAFB] p-3 rounded-[8px] flex gap-2">
                                    <Info size={14} className="text-orange-400 shrink-0 mt-0.5" />
                                    <p className="text-[9px] text-orange-500 font-medium">Tip: These details help you track and manage products from external sources. You can use the Source URL to quickly access the product page, and the Source SKU for ordering or communication with suppliers.</p>
                                </div>
                            </div>
                        </SectionWrapper> */}
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Ready to Publish Card */}
            <div className="bg-white rounded-[8px] px-4 py-6">
              <h3 className="text-black font-medium text-[20px] mb-2">
                Ready To Publish
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden mr-3">
                  <div className="h-full bg-[#085E00] w-[80%] rounded-full" />
                </div>
                <span className="text-[11px] font-bold text-gray-500">80%</span>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                {[
                  { name: "Item Name", checked: false },
                  { name: "Media", checked: false },
                  { name: "Product Description", checked: false },
                  { name: "Pricing", checked: false },
                  { name: "Inventory", checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.checked ? (
                      <CheckCircle2 size={16} className="text-[#085E00]" />
                    ) : (
                      <Circle size={16} className="text-gray-200" />
                    )}
                    <span
                      className={`text-xs font-medium ${item.checked ? "text-[#085E00]" : "text-black"}`}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalog Card */}
            <div className="bg-white rounded-[8px] p-6">
              <h3 className="text-black font-medium text-[20px] mb-4">
                Catalog
              </h3>
              <Label required>Select Category</Label>
              <div className="bg-[#F9FAFB] px-4 py-3 rounded-[8px] text-xs text-black flex justify-between items-center mb-4">
                Select Category* <ChevronDown size={14} />
              </div>

              <SeconderyButton
                label="Add New Category"
                icon={
                  <Plus
                    size={21}
                    strokeWidth={1.5}
                    color="black"
                    className="border border-w-[1.5px] rounded-full"
                  />
                }
              />
            </div>

            {/* Tag Card */}
            <div className="bg-white rounded-[8px] p-6">
              <h3 className="text-[#003032] font-bold text-md mb-4">
                Tag & Deep Search
              </h3>
              <div className="flex flex-col gap-4">
                <div className="bg-[#F9FAFB] px-4 py-3 rounded-[8px] text-xs text-black flex justify-between items-center">
                  Select Tag <ChevronDown size={14} />
                </div>
                <input
                  className="bg-[#F9FAFB] px-4 py-3 rounded-[8px] text-[10px] outline-none placeholder:text-gray-400"
                  placeholder="Deep Search. ex.New Mobile, Popular product"
                />
              </div>
            </div>

            {/* Condition Card */}
            <div className="bg-white rounded-[8px] p-6">
              <h3 className="text-[#003032] font-bold text-md mb-4">
                Condition
              </h3>
              <div className="bg-[#F9FAFB] px-4 py-3 rounded-[8px] text-xs text-gray-700 flex justify-between items-center">
                Used <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

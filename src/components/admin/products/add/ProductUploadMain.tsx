"use client";

import React, { useState, useRef } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  Barcode,
  ChevronDown,
  CheckCircle2,
  Circle,
  AlignLeft,
  Bold,
  Code,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Smile,
  Type,
  Underline,
  ChevronUp,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

import EditFileIcon from "@/components/store-front/svg/svg/EditFileIcon";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";
import PluseIcon from "@/components/store-front/svg/svg/PluseIcon";
import CloseIcon from "@/components/store-front/svg/svg/CloseIcon";
import PrimaryButton from "../../common/PrimaryButton";
import SeconderyButton from "../../common/SeconderyButton";

// ── SHARED BASE ATOMIC DESIGN MOLECULES ──
export const Label = ({
  children,
  required,
  subLabel,
}: {
  children: React.ReactNode;
  required?: boolean;
  subLabel?: string;
}) => (
  <div className="flex justify-between items-center mb-1.5">
    <label className="text-base font-normal text-black select-none">
      {children} {required && <span className="text-[#E30000]">*</span>}
    </label>
    {subLabel && (
      <span className="text-[10px] text-gray-400 font-medium">{subLabel}</span>
    )}
  </div>
);

export const Input = ({
  placeholder,
  icon: Icon,
  type = "text",
  name,
  options = {},
}: {
  placeholder?: string;
  icon?: React.ElementType;
  type?: string;
  name: string;
  options?: any;
}) => {
  const { register } = useFormContext();
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, options)}
        className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2] text-gray-800 border border-transparent focus:border-gray-200 focus:bg-white transition-all"
      />
      {Icon && (
        <Icon
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      )}
    </div>
  );
};

export const Toggle = ({ name }: { name: string }) => {
  const { watch, setValue } = useFormContext();
  const checked = watch(name);
  return (
    <div
      className="flex items-center gap-2 select-none cursor-pointer"
      onClick={() => setValue(name, !checked)}
    >
      <div
        className={`w-10 h-5 rounded-full relative transition-colors ${checked ? "bg-[#1DA1F2]" : "bg-gray-200"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-xs ${checked ? "left-5" : "left-0.5"}`}
        />
      </div>
    </div>
  );
};

export const SectionWrapper = ({
  title,
  children,
  description,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="bg-white rounded-[8px] px-4 py-5 mb-4 transition-all border border-gray-100">
      <div
        className="flex justify-between items-center mb-4 cursor-pointer select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-[#003032] font-medium text-xl">{title}</h3>
        <ChevronUp
          size={24}
          color="black"
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
        />
      </div>
      {description && !isCollapsed && (
        <p className="text-xs text-[#A2A2A2] -mt-3 mb-5 leading-tight">
          {description}
        </p>
      )}
      <div className={isCollapsed ? "hidden" : "block"}>{children}</div>
    </div>
  );
};

// ── UNIFIED APPLICATION FORM CONTAINER ENGINE ──
export default function ProductUploadMain() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      category_id: "",
      brand_id: "",
      modelName: "",
      short_description: "",
      description: "",
      regular_price: "",
      sell_price: "",
      cost_price: "",
      quantity: "50",
      unit_name: "Pcs",
      warranty: "",
      sku: "",
      barcode: "",
      priority: "100",
      is_variant_mandatory: false,
      autoSlug: true,
      status: "DRAFT",
      condition: "NEW",
      seoKeywords: "",
      seoDescription: "",
      seoTitle: "",
      tag_ids: [] as string[],
      applyDefaultDelivery: true,
      deliveryChargeDefault: "120",
      deliveryChargeSpecificInside: "60",
      deliveryChargeSpecificOutside: "200",
      variants: [] as any[],
    },
  });

  const watchedValues = methods.watch();

  // 🚀 TANSTACK MUTATION: Connected directly to the your target NestJS ProductsController `@Post()` handler
  const productMutation = useMutation({
    mutationFn: async (targetStatus: "DRAFT" | "PUBLISHED") => {
      const token = await getAdminTokenAction();
      const formPayload = methods.getValues();

      const cleanSlug =
        formPayload.slug ||
        formPayload.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      // 🚀 THE FIX: Update the mutation payload mapping block inside ProductUploadMain.tsx
      const finalPayload = {
        category_id: formPayload.category_id,
        brand_id: formPayload.brand_id || null,
        name: formPayload.name,
        slug: cleanSlug,
        short_description: formPayload.short_description || null,
        description: formPayload.description,
        status: targetStatus,
        // 🚀 FIX A: Ensure master images are a flat, clean array of valid string URLs
        images: Array.isArray(images)
          ? images.map((img: any) => String(img))
          : [],
        priority: Number(formPayload.priority) || 100,
        regular_price: Number(formPayload.regular_price) || 0,
        sell_price: Number(formPayload.sell_price) || 0,
        cost_price: Number(formPayload.cost_price) || 0,
        quantity: formPayload.is_variant_mandatory
          ? 0
          : Number(formPayload.quantity) || 0,
        unit_name: formPayload.unit_name || "Pcs",
        warranty: formPayload.warranty || null,
        sku: formPayload.sku || null,
        barcode: formPayload.barcode || null,
        is_variant_mandatory: formPayload.is_variant_mandatory,
        meta_title: formPayload.seoTitle || null,
        meta_description: formPayload.seoDescription || null,
        meta_tags: formPayload.seoKeywords || null,
        shipping_type: formPayload.applyDefaultDelivery
          ? "DEFAULT"
          : "SPECIFIC",
        tag_ids: formPayload.tag_ids,
        shipping_config: [
          { zone: "Dhaka", charge: Number(formPayload.deliveryChargeDefault) },
          {
            zone: "Outside Dhaka",
            charge: formPayload.applyDefaultDelivery
              ? Number(formPayload.deliveryChargeDefault)
              : Number(formPayload.deliveryChargeSpecificOutside),
          },
        ],
        // 🚀 FIX B: Ensure variant image arrays pass only valid flat string data arrays
        variants: formPayload.variants.map((v: any) => ({
          attribute: v.attribute,
          stock: Number(v.stock) || 0,
          sku: v.sku || `SKU-${Date.now()}`,
          price: Number(v.price) || 0,
          images: Array.isArray(v.images)
            ? v.images.map((img: any) => String(img))
            : [],
        })),
      };

      const res = await apiFetch("/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(
          errorJson?.message ||
            "Failed to successfully complete backend row append operations.",
        );
      }
      return res.json();
    },
    onSuccess: (data, status) => {
      queryClient.invalidateQueries({ queryKey: ["products-list-panel"] });
      alert(`Success: Product records stored and marked as ${status}!`);
      methods.reset();
      setImages([]);
      router.push("/admin/dashboard/products");
    },
    onError: (err: any) => {
      alert(`Validation Rejection: ${err.message}`);
    },
  });

  const completeness =
    (watchedValues.name ? 25 : 0) +
    (watchedValues.category_id ? 25 : 0) +
    (watchedValues.sell_price ? 25 : 0) +
    (images.length > 0 ? 25 : 0);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full min-h-screen font-lato pb-12"
      >
        {/* Global Command Action Bar Header */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4 p-4 bg-white border-b border-gray-100 rounded-[8px]">
          <div>
            <h1 className="text-xl font-bold text-black sm:text-2xl">
              Product Upload
            </h1>
            <p className="text-xs text-gray-400">
              Integrated server state transactional environment panel workspace
              console
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              disabled={productMutation.isPending}
              onClick={() => productMutation.mutate("DRAFT")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-[8px] bg-white text-[#070606] font-semibold text-sm justify-center border border-gray-200 cursor-pointer disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              {productMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <EditFileIcon />
              )}{" "}
              Save Draft
            </button>
            <PrimaryButton
              onClick={() => {
                if (!productMutation.isPending) {
                  productMutation.mutate("PUBLISHED");
                }
              }}
              icon={
                productMutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus
                    size={24}
                    className="border-2 border-white rounded-full p-0.5"
                  />
                )
              }
              label={productMutation.isPending ? "Uploading..." : "Add Product"}
              className={`w-full sm:w-auto justify-center bg-[#085E00] hover:bg-[#064400] ${productMutation.isPending ? "opacity-50 pointer-events-none" : ""}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:mx-4 mx-2">
          {/* LEFT SECTION FORM ELEMENT ROWS */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <GeneralInfoSection
              images={images}
              setImages={setImages}
              uploading={uploadingMedia}
              setUploading={setUploadingMedia}
            />

            <SectionWrapper title="Pricing">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <Label required>Sell Price (৳)</Label>
                  <Input
                    type="number"
                    name="sell_price"
                    placeholder="0"
                    options={{ required: true }}
                  />
                </div>
                <div>
                  <Label required>Regular Price (৳)</Label>
                  <Input
                    type="number"
                    name="regular_price"
                    placeholder="0"
                    options={{ required: true }}
                  />
                </div>
                <div>
                  <Label>Cost Price (Optional) (৳)</Label>
                  <Input type="number" name="cost_price" placeholder="0" />
                </div>
              </div>
            </SectionWrapper>

            <InventorySection Calendar={Calendar} Barcode={Barcode} />
            <VariantsSection />
            <BrandSection />
            <ShippingSection />
            <SeoSection />
          </div>

          {/* RIGHT COMPONENT SIDEBAR SELECTIONS */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Completion Evaluation Tracker Metric */}
            <div className="bg-white rounded-[8px] p-5 border border-gray-100">
              <h3 className="text-black font-medium text-[20px] mb-2">
                Ready To Publish
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden mr-3">
                  <div
                    className="h-full bg-[#085E00] transition-all duration-200"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {completeness}%
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs">
                  {watchedValues.name ? (
                    <CheckCircle2 size={16} className="text-[#085E00]" />
                  ) : (
                    <Circle size={16} className="text-gray-200" />
                  )}
                  <span>Item Identification parameters mapped</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  {images.length > 0 ? (
                    <CheckCircle2 size={16} className="text-[#085E00]" />
                  ) : (
                    <Circle size={16} className="text-gray-200" />
                  )}
                  <span>Media assets loaded to storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  {watchedValues.category_id ? (
                    <CheckCircle2 size={16} className="text-[#085E00]" />
                  ) : (
                    <Circle size={16} className="text-gray-200" />
                  )}
                  <span>Target catalog category bound</span>
                </div>
              </div>
            </div>

            <SidebarCatalogSection />
            <SidebarTagSection />
            <ConditionSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// ── SUB COMPONENT SECTION: GENERAL INFORMATION ──
function GeneralInfoSection({
  images,
  setImages,
  uploading,
  setUploading,
}: any) {
  const { register, setValue, watch } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const autoSlug = watch("autoSlug");

  // 🚀 INTERCONNECTED HANDLER: Connects to ProductsController `@Post('upload-image')` endpoint
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = await getAdminTokenAction();
      const bodyData = new FormData();
      bodyData.append("image", file);

      const res = await apiFetch("/products/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` },
        body: bodyData,
      });

      if (!res.ok) throw new Error("File intercept tracking failure");
      const data = await res.json();
      setImages((prev: string[]) => [...prev, data.image_url]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SectionWrapper title="General Information">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-end mb-1">
            <Label required>Item Name</Label>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setValue("autoSlug", !autoSlug)}
            >
              <span className="text-xs text-gray-400">Auto Slug</span>
              <Toggle name="autoSlug" />
            </div>
          </div>
          <input
            {...register("name", {
              required: true,
              onChange: (e) => {
                if (autoSlug) {
                  const computed = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  setValue("slug", computed);
                }
              },
            })}
            className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2]"
            placeholder="Ex: Samsung Galaxy S23 Ultra"
          />
        </div>

        <div>
          <Label>Product Slug (URL Path)</Label>
          <input
            {...register("slug")}
            disabled={autoSlug}
            className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-500 disabled:opacity-60"
            placeholder="samsung-galaxy-s23-ultra"
          />
        </div>

        <div>
          <Label required>Media Gallery</Label>
          <div className="border-2 border-dashed border-gray-200 bg-[#F9F9F9] rounded-[8px] p-6 text-center relative flex flex-col items-center justify-center">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-4">
                {images.map((src: string, i: number) => (
                  <div
                    key={i}
                    className="relative group w-16 h-16 rounded border overflow-hidden bg-white shadow-3xs"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "")}${src}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(
                          images.filter((_: any, idx: number) => idx !== i),
                        )
                      }
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer flex flex-col items-center">
              <IamgeIcon size="48" color="#999" />
              <span className="text-xs text-gray-500 mt-2 font-medium">
                Stage gallery photos
              </span>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Short Description</Label>
          <textarea
            {...register("short_description")}
            className="w-full bg-[#F9FAFB] rounded-[8px] px-4 py-3 text-sm min-h-[80px] outline-none text-gray-800"
            placeholder="Summary highlights..."
          />
        </div>

        <div>
          <Label required>Product Description</Label>
          <textarea
            {...register("description", { required: true })}
            className="w-full bg-[#F9FAFB] rounded-[8px] p-4 min-h-[140px] outline-none text-sm text-gray-800"
            placeholder="Full technical parameters logs..."
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── SUB COMPONENT SECTION: INVENTORY CONTROL ──
function InventorySection({ Barcode }: any) {
  const { register, watch } = useFormContext();
  const isVariantMandatory = watch("is_variant_mandatory");

  return (
    <SectionWrapper title="Inventory">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Quantity (Stock)</Label>
          <input
            type="number"
            {...register("quantity")}
            disabled={isVariantMandatory}
            className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
            placeholder={isVariantMandatory ? "Derived from attributes" : "50"}
          />
        </div>
        <div>
          <Label>Unit Name</Label>
          <Input name="unit_name" placeholder="Piece, kg, liter" />
        </div>
        <div>
          <Label>Warranty</Label>
          <Input name="warranty" placeholder="12 months" />
        </div>
        <div>
          <Label>SKU / Code</Label>
          <Input name="sku" placeholder="SAM-REF-525" />
        </div>
        <div>
          <Label>Barcode</Label>
          <Input name="barcode" placeholder="88091..." icon={Barcode} />
        </div>
        <div>
          <Label>Priority Rank</Label>
          <Input type="number" name="priority" placeholder="100" />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── SUB COMPONENT SECTION: DYNAMIC VARIATIONS MATRIX ──
function VariantsSection() {
  const { control, register, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const isMandatory = watch("is_variant_mandatory");

  const [vAttr, setVAttr] = useState("");
  const [vStock, setVStock] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vSku, setVSku] = useState("");

  const handlePushOption = () => {
    if (!vAttr || !vPrice) return;
    append({
      attribute: vAttr,
      stock: Number(vStock) || 0,
      price: Number(vPrice) || 0,
      sku: vSku || `SKU-${Date.now()}`,
    });
    setVAttr("");
    setVStock("");
    setVPrice("");
    setVSku("");
  };

  return (
    <SectionWrapper
      title="Product Variants"
      description="Track complex child variations securely tied to database relation configurations mappings."
    >
      <div className="border border-sky-400 rounded-[12px] p-5 space-y-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-base font-semibold text-black">
              Make this variant mandatory
            </h4>
            <p className="text-xs text-gray-400">
              Forces selection rules onto storefront client checkout lines
            </p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setValue("is_variant_mandatory", !isMandatory)}
          >
            <Toggle name="is_variant_mandatory" />
          </div>
        </div>

        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded border"
          >
            <span>
              <strong>{watch(`variants.${idx}.attribute`)}</strong> | ৳
              {watch(`variants.${idx}.price`)} | Stock:{" "}
              {watch(`variants.${idx}.stock`)}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Option Name
            </label>
            <input
              value={vAttr}
              onChange={(e) => setVAttr(e.target.value)}
              className="w-full bg-gray-50 border p-2 text-xs rounded outline-none"
              placeholder="e.g., Silver, Matte Black"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Price</label>
            <input
              type="number"
              value={vPrice}
              onChange={(e) => setVPrice(e.target.value)}
              className="w-full bg-gray-50 border p-2 text-xs rounded outline-none"
              placeholder="72000"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Stock Level
            </label>
            <input
              type="number"
              value={vStock}
              onChange={(e) => setVStock(e.target.value)}
              className="w-full bg-gray-50 border p-2 text-xs rounded outline-none"
              placeholder="30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Custom Variant SKU
            </label>
            <input
              value={vSku}
              onChange={(e) => setVSku(e.target.value)}
              className="w-full bg-gray-50 border p-2 text-xs rounded outline-none"
              placeholder="SAM-REF-BLK"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handlePushOption}
          className="flex items-center gap-1 bg-[#003032] text-white rounded text-xs font-bold px-3 py-2 cursor-pointer hover:opacity-90"
        >
          <PluseIcon /> Commit Option
        </button>
      </div>
    </SectionWrapper>
  );
}

// ── SUB COMPONENT SECTION: DYNAMIC BRAND COUPLING ──
function BrandSection() {
  const { setValue, watch } = useFormContext();
  const activeBrandId = watch("brand_id");

  // 🚀 TANSTACK QUERY: Connected directly to your target BrandsController `@Get()` endpoint
  const { data: brandResponse } = useQuery({
    queryKey: ["brands-list-select"],
    queryFn: async () => {
      const res = await apiFetch("/brand");
      return res.json();
    },
  });

  // 🚀 FIXED: Defensively extract your brands safely regardless of wrapper schemas
  const brandList = (() => {
    if (Array.isArray(brandResponse)) return brandResponse;
    if (brandResponse && Array.isArray(brandResponse.data))
      return brandResponse.data;
    if (brandResponse && Array.isArray(brandResponse.brands))
      return brandResponse.brands;
    return []; // Reliable baseline array prevents .map() from throwing runtime failures
  })();

  return (
    <SectionWrapper
      title="Brand Metadata"
      description="Connect product rows to system brand indexes."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Select Brand</Label>
          <div className="relative w-full">
            <select
              value={activeBrandId || ""}
              onChange={(e) => setValue("brand_id", e.target.value)}
              className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 px-4 py-3 text-xs rounded-[8px] outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Brand Mapping</option>
              {brandList.map((brand: any) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        <div>
          <Label>Model Variant Reference String</Label>
          <Input name="modelName" placeholder="Ex: RT53 Refrigerator" />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── SUB COMPONENT SECTION: SHIPPING SCALING ──
function ShippingSection() {
  const { watch, setValue } = useFormContext();
  const applyDefault = watch("applyDefaultDelivery");

  return (
    <SectionWrapper title="Shipping Configuration">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">
              Apply default global shipping rates
            </h4>
            <p className="text-xs text-gray-400">
              If disabled, specific rates apply dynamically
            </p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setValue("applyDefaultDelivery", !applyDefault)}
          >
            <Toggle name="applyDefaultDelivery" />
          </div>
        </div>

        {applyDefault ? (
          <div>
            <Label>Delivery Charge (Default Global Rate)</Label>
            <Input
              type="number"
              name="deliveryChargeDefault"
              placeholder="120"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Inside Dhaka Charge</Label>
              <Input
                type="number"
                name="deliveryChargeSpecificInside"
                placeholder="60"
              />
            </div>
            <div>
              <Label>Outside Dhaka Charge</Label>
              <Input
                type="number"
                name="deliveryChargeSpecificOutside"
                placeholder="200"
              />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// ── SUB COMPONENT SECTION: META SEO INFO ──
function SeoSection() {
  return (
    <SectionWrapper title="SEO Meta Search Info">
      <div className="space-y-4">
        <div>
          <Label>Meta Search Keywords</Label>
          <Input
            name="seoKeywords"
            placeholder="samsung, refrigerator, 525 litre, home appliance"
          />
        </div>
        <div>
          <Label>SEO Meta Title</Label>
          <Input
            name="seoTitle"
            placeholder="Samsung 525 Litre Refrigerator - Best Price"
          />
        </div>
        <div>
          <Label>SEO Meta Description Layout</Label>
          <Input
            name="seoDescription"
            placeholder="Buy original Samsung 525 Litre Refrigerator at the best price..."
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── SIDEBAR SELECTION COMPONENT: CATEGORIES NESTED TREE ──
function SidebarCatalogSection() {
  const { setValue, watch } = useFormContext();
  const activeCatId = watch("category_id");

  // 🚀 TANSTACK QUERY: Connected directly to CategoriesController `@Get('tree')`
  const { data: treeResponse, isLoading } = useQuery({
    queryKey: ["categories-nested-tree-upload"],
    queryFn: async () => {
      const res = await apiFetch("/categories/tree");
      if (!res.ok) throw new Error("Tree serialization error");
      return res.json();
    },
  });

  const unwindTree = (nodes: any[], level = 0) => {
    if (!Array.isArray(nodes)) return null;
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <option value={node.id}>
          {"\u00A0\u00A0".repeat(level) + (level > 0 ? "├─ " : "") + node.name}
        </option>
        {node.children &&
          node.children.length > 0 &&
          unwindTree(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white rounded-[8px] p-5 border border-gray-100 shadow-xs">
      <h3 className="text-black font-medium text-[20px] mb-4">
        Catalog Selection
      </h3>
      <Label required>System Category Tree</Label>
      <div className="relative w-full">
        <select
          value={activeCatId || ""}
          onChange={(e) => setValue("category_id", e.target.value)}
          className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 px-4 py-3 text-xs rounded-[8px] outline-none appearance-none cursor-pointer focus:bg-white"
        >
          <option value="">
            {isLoading
              ? "Synchronizing tree schemas..."
              : "Select Category Node*"}
          </option>
          {treeResponse &&
            unwindTree(
              Array.isArray(treeResponse) ? treeResponse : treeResponse.data,
            )}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

// ── SIDEBAR SELECTION COMPONENT: TAGS SELECTION ──
function SidebarTagSection() {
  const { setValue, watch } = useFormContext();
  const activeTags = watch("tag_ids") || [];

  // 🚀 TANSTACK QUERY: Connected directly to your target TagsController `@Get()` endpoint
  const { data: tagsResponse } = useQuery({
    queryKey: ["tags-list-upload-select"],
    queryFn: async () => {
      const res = await apiFetch("/tags");
      return res.json();
    },
  });

  // 🚀 FIXED: Defensively extract tags data matrix safely into a verified Array payload
  const tagsList = (() => {
    if (Array.isArray(tagsResponse)) return tagsResponse;
    if (tagsResponse && Array.isArray(tagsResponse.data))
      return tagsResponse.data;
    if (tagsResponse && Array.isArray(tagsResponse.tags))
      return tagsResponse.tags;
    return []; // absolute stable array fallback prevents .map() runtime exception crashes
  })();

  const handleToggleTagSelection = (tagId: string) => {
    const updatedTags = activeTags.includes(tagId)
      ? activeTags.filter((id: string) => id !== tagId)
      : [...activeTags, tagId];
    setValue("tag_ids", updatedTags);
  };

  return (
    <div className="bg-white rounded-[8px] p-5 border border-gray-100 shadow-xs">
      <h3 className="text-[#003032] font-bold text-md mb-4">Tags Assignment</h3>
      <Label>Select Associated Tags</Label>
      <div className="max-h-[140px] overflow-y-auto border border-gray-100 p-2.5 rounded-[6px] space-y-1.5 bg-[#F9FAFB]">
        {tagsList.map((tag: any) => {
          const isSelected = activeTags.includes(tag.id);
          return (
            <div
              key={tag.id}
              onClick={() => handleToggleTagSelection(tag.id)}
              className={`flex items-center justify-between text-xs p-2 rounded cursor-pointer transition-colors ${
                isSelected
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <span>{tag.name}</span>
              {isSelected && <span className="font-bold text-sky-600">✓</span>}
            </div>
          );
        })}
        {tagsList.length === 0 && (
          <span className="text-[11px] text-gray-400">
            No tags found in catalog records.
          </span>
        )}
      </div>
    </div>
  );
}

// ── SIDEBAR SELECTION COMPONENT: PRODUCT CONDITION ──
function ConditionSection() {
  const { register } = useFormContext();
  return (
    <div className="bg-white rounded-[8px] p-5 border border-gray-100 shadow-xs">
      <h3 className="text-[#003032] font-bold text-md mb-4">
        Product Condition
      </h3>
      <div className="relative">
        <select
          {...register("condition")}
          className="w-full bg-[#F9FAFB] border border-gray-200 px-4 py-3 rounded-[8px] text-xs text-gray-700 outline-none appearance-none cursor-pointer"
        >
          <option value="NEW">New / Boxed</option>
          <option value="USED">Used / Second Hand</option>
          <option value="REFURBISHED">Refurbished / Factory Restored</option>
        </select>
        <ChevronDown
          size={14}
          className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}

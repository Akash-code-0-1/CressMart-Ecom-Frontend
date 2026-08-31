"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import {
  uploadSupplierImage,
  createSupplier,
  updateSupplier,
  fetchSingleSupplier,
} from "@/services-api/supplierService";
import PrimaryButton from "../../../common/PrimaryButton";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";
import toast from "react-hot-toast";
import Image from "next/image";

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-medium text-gray-700 mb-1.5 select-none">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export default function AddSupplierMain() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supplierId = searchParams.get("id");
  const isEditMode = !!supplierId;

  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      phone: "",
      email: "",
      address: "",
      priority: 100,
      status: "active" as "active" | "draft" | "inactive",
      autoSlug: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const autoSlugActive = watch("autoSlug");

  // Query single supplier when in edit mode
  const { data: existingSupplier, isLoading: loadingExisting } = useQuery({
    queryKey: ["supplier-single-edit", supplierId],
    queryFn: () => fetchSingleSupplier(supplierId!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingSupplier) {
      reset({
        name: existingSupplier.name || "",
        slug: existingSupplier.slug || "",
        phone: existingSupplier.phone || "",
        email: existingSupplier.email || "",
        address: existingSupplier.address || "",
        priority: existingSupplier.priority ?? 100,
        status: (existingSupplier.status || "active") as
          | "active"
          | "draft"
          | "inactive",
        autoSlug: false,
      });
      if (existingSupplier.image_url) setImageUrl(existingSupplier.image_url);
    }
  }, [existingSupplier, isEditMode, reset]);

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadSupplierImage(file);
      if (data.image_url) setImageUrl(data.image_url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Upload Failure: ${err.message}`);
      } else {
        toast.error("Upload Failure: Unknown error");
      }
    } finally {
      setUploading(false);
    }
  };

  const supplierMutation = useMutation({
    mutationFn: (payload: {
      name: string;
      slug: string;
      phone?: string | null;
      email?: string | null;
      address?: string | null;
      image_url?: string | null;
      priority: number;
      status: string;
    }) => {
      return isEditMode
        ? updateSupplier(supplierId!, payload)
        : createSupplier(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["catalog-suppliers-list"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
        exact: false,
      });

      toast.success(
        isEditMode
          ? "Supplier updated successfully!"
          : "Supplier created successfully!",
      );
      router.push("/admin/dashboard/supplier");
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(`Validation Failure: ${err.message}`);
      } else {
        toast.error("Validation Failure: Unknown error");
      }
    },
  });

  const onSubmitFormHandler = (data: {
    name: string;
    slug: string;
    phone: string;
    email: string;
    address: string;
    priority: number;
    status: "active" | "draft" | "inactive";
    autoSlug: boolean;
  }) => {
    if (!data.name.trim()) return;

    supplierMutation.mutate({
      name: data.name,
      slug:
        data.slug ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      image_url: imageUrl || null,
      priority: Number(data.priority) || 100,
      status: data.status,
    });
  };

  if (isEditMode && loadingExisting) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 gap-2 bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-gray-500" />
        <span className="text-xs">Loading supplier details...</span>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full min-h-screen font-lato pb-12 bg-[#F9FAFB]">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 p-4 bg-white border border-gray-100 rounded-[8px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/supplier")}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-black sm:text-2xl">
                {isEditMode ? "Edit Supplier" : "Add Supplier"}
              </h1>
              <p className="text-xs text-gray-400">
                Manage supplier details, contact information, and image asset
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!supplierMutation.isPending)
              handleSubmit(onSubmitFormHandler)();
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* LEFT FORM SECTION */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-[8px] p-5 border border-gray-100 space-y-5">
              <h3 className="text-[#003032] font-semibold text-lg border-b border-gray-200 pb-2">
                Supplier Information
              </h3>

              {/* Name & Auto-Slug */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label required>Supplier Name</Label>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer select-none"
                    onClick={() => setValue("autoSlug", !autoSlugActive)}
                  >
                    <span className="text-xs text-gray-400">
                      Auto Generate Slug
                    </span>
                    <input
                      type="checkbox"
                      checked={autoSlugActive}
                      readOnly
                      className="accent-[#1DA1F2]"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  {...register("name", {
                    required: "Supplier name is required",
                    onChange: (e) => {
                      if (autoSlugActive) {
                        const clean = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                        setValue("slug", clean);
                      }
                    },
                  })}
                  placeholder="Ex: ACME Logistics / Samsung Official Supplier"
                  className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-black border border-transparent focus:border-gray-200 focus:bg-white transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <Label required>Supplier Slug (URL Path)</Label>
                <input
                  type="text"
                  {...register("slug", {
                    required: "Unique slug identifier is required",
                  })}
                  disabled={autoSlugActive}
                  placeholder="acme-logistics"
                  className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-800 disabled:opacity-60 border border-transparent focus:border-gray-200 focus:bg-white transition-all"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Contact Info (Phone & Email) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="Ex: +8801700000000"
                    className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-black border border-transparent focus:border-gray-200 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Ex: supplier@example.com"
                    className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-black border border-transparent focus:border-gray-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <textarea
                  {...register("address")}
                  placeholder="Ex: House #12, Road #4, Block #C, Banani, Dhaka"
                  className="w-full bg-[#F9F9F9] rounded-[8px] p-4 min-h-[90px] outline-none text-sm text-black border border-transparent focus:border-gray-200 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Priority */}
              <div>
                <Label>Priority Rank (Default: 100)</Label>
                <input
                  type="number"
                  {...register("priority", { valueAsNumber: true })}
                  placeholder="100"
                  className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-black border border-transparent focus:border-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANELS */}
          <div className="lg:col-span-4 space-y-4">
            {/* Visibility Settings */}
            <div className="bg-white rounded-[8px] p-5 border border-gray-100 space-y-4">
              <h3 className="text-black font-semibold text-lg border-b border-gray-200 pb-2">
                Visibility & Action
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Supplier Status
                </label>
                <select
                  {...register("status")}
                  className="w-full bg-[#F9FAFB] border text-sm border-gray-200 px-4 py-3 rounded-[8px] outline-none text-black cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <PrimaryButton
                onClick={handleSubmit(onSubmitFormHandler)}
                icon={
                  supplierMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )
                }
                label={
                  supplierMutation.isPending
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Supplier"
                }
                className={`w-full justify-center bg-[#085E00] hover:bg-[#064400] text-white py-3 font-semibold ${supplierMutation.isPending ? "opacity-60 pointer-events-none" : ""}`}
              />
            </div>

            {/* Supplier Image Upload */}
            <div className="bg-white rounded-[8px] p-5 border border-gray-100 space-y-4">
              <h3 className="text-black font-semibold text-lg border-b border-gray-200 pb-2">
                Supplier Logo / Image
              </h3>
              <div className="border-2 border-dashed border-gray-200 bg-[#F9F9F9] rounded-[8px] p-6 text-center relative flex flex-col items-center justify-center min-h-[180px]">
                {imageUrl ? (
                  <div className="relative group w-24 h-24 rounded-[8px] border overflow-hidden bg-white shadow-xs">
                    <Image
                      src={
                        imageUrl.startsWith("http")
                          ? imageUrl
                          : `${baseStorageUrl}${imageUrl}`
                      }
                      className="w-full h-full object-contain"
                      alt="Supplier Logo"
                      width={100}
                      height={100}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center cursor-pointer outline-none"
                  >
                    <IamgeIcon size="54" color="#A2A2A2" />
                    <p className="text-xs text-[#A2A2A2] mt-2 font-medium">
                      Click to upload supplier photo
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[8px]">
                    <Loader2 className="animate-spin text-sky-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

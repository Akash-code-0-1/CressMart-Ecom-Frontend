"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle, Trash2, ChevronDown } from "lucide-react";
import { uploadCategoryImage, fetchSingleCategory } from "@/services-api/categoryService";
import { fetchSubCategoriesOnly, createChildCategory, updateChildCategory } from "@/services-api/childcategoryService";
import PrimaryButton from "../../../common/PrimaryButton";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1.5 select-none">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export default function AddChildCategoryMain() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const childCategoryId = searchParams.get("id");
  const isEditMode = !!childCategoryId;

  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const baseStorageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";

  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      parent_id: "",
      description: "",
      status: "active" as "active" | "draft",
      autoSlug: true,
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = methods;
  const autoSlugActive = watch("autoSlug");

  // QUERY: Pull single category baseline records if editing
  const { data: existingChildCategory, isLoading: loadingExisting } = useQuery({
    queryKey: ["childcategory-single-edit", childCategoryId],
    queryFn: () => fetchSingleCategory(childCategoryId!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingChildCategory) {
      reset({
        name: existingChildCategory.name || "",
        slug: existingChildCategory.slug || "",
        parent_id: existingChildCategory.parent_id || "",
        description: existingChildCategory.description || "",
        status: existingChildCategory.status === "active" || existingChildCategory.status === "PUBLISHED" ? "active" : "draft",
        autoSlug: false,
      });
      if (existingChildCategory.image_url) setImageUrl(existingChildCategory.image_url);
    }
  }, [existingChildCategory, isEditMode, reset]);

  // QUERY: Fetch only genuine level-2 subcategories to display as target selections
  const { data: subCategoriesList } = useQuery({
    queryKey: ["sub-categories-strict-level2-nodes"],
    queryFn: fetchSubCategoriesOnly,
  });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadCategoryImage(file);
      if (data.image_url) setImageUrl(data.image_url);
    } catch (err: any) {
      alert(`Upload Failure: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 🚀 FIXED MUTATION WORKFLOW: Points strictly to updateChildCategory to lock parent relationship constraints
  const childCategoryMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEditMode && childCategoryId) {
        return updateChildCategory(childCategoryId, payload);
      }
      return createChildCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-childcategories-list"] });
      alert(isEditMode ? "Child Category updates saved successfully!" : "Child Category created successfully!");
      router.push("/admin/dashboard/child-category");
    },
    onError: (err: any) => {
      alert(`Validation Failure: ${err.message}`);
    },
  });

  const onSubmitFormHandler = (data: any) => {
    if (!data.name.trim()) return;
    if (!data.parent_id || data.parent_id === "") {
      alert("Please designate a parent sub-category mapping for this child node.");
      return;
    }

    childCategoryMutation.mutate({
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      parent_id: data.parent_id,
      description: data.description || "",
      image_url: imageUrl || "",
      status: data.status,
    });
  };

  if (isEditMode && loadingExisting) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 gap-2 bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-gray-500" />
        <span className="text-xs">Synchronizing active dataset state nodes...</span>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full min-h-screen font-lato pb-12 p-4 bg-[#F9FAFB]">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 p-4 bg-white border border-gray-100 rounded-[8px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/child-category")}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-black sm:text-2xl">
                {isEditMode ? "Edit Child Category" : "Add Child Category"}
              </h1>
              <p className="text-xs text-gray-400">Deploy deep third-tier taxonomy leaf nodes mapped inside catalog rules</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!childCategoryMutation.isPending) handleSubmit(onSubmitFormHandler)();
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-8 bg-white rounded-[8px] p-5 border border-gray-100 space-y-5">
            <h3 className="text-[#003032] font-semibold text-lg border-b pb-2">General Info</h3>

            {/* Parent Sub-Category Dropdown */}
            <div>
              <Label required>Parent Sub Category Relation</Label>
              <div className="relative w-full">
                <select
                  {...register("parent_id", { required: "Parent sub-category mapping target required" })}
                  className="w-full bg-[#F9F9F9] rounded-[8px] p-3 text-sm text-black outline-none border border-transparent focus:border-gray-200 cursor-pointer appearance-none"
                >
                  <option value="">Select Parent Sub Category Mapping Node*</option>
                  {Array.isArray(subCategoriesList) &&
                    subCategoriesList
                      .filter((cat: any) => cat.id !== childCategoryId)
                      .map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.parent_id && <p className="text-xs text-red-500 mt-1">{errors.parent_id.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label required>Child Category Name</Label>
                <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setValue("autoSlug", !autoSlugActive)}>
                  <span className="text-xs text-gray-400">Auto Generate Slug</span>
                  <input type="checkbox" checked={autoSlugActive} readOnly className="accent-[#1DA1F2]" />
                </div>
              </div>
              <input
                type="text"
                {...register("name", {
                  required: "Child category tracking name required",
                  onChange: (e) => {
                    if (autoSlugActive) {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      setValue("slug", clean);
                    }
                  },
                })}
                placeholder="Ex: Water Bottles, Action Figures"
                className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-black"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Link Slug (URL Path)</Label>
              <input
                type="text"
                {...register("slug", { required: "Tracking URL slug parameter is mandatory" })}
                disabled={autoSlugActive}
                className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-800 disabled:opacity-60"
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                {...register("description")}
                placeholder="Write specific child scope metadata profile specifications tracking text..."
                className="w-full bg-[#F9F9F9] rounded-[8px] p-4 min-h-[140px] outline-none text-sm text-black resize-none"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[8px] p-5 border border-gray-100 space-y-4">
              <h3 className="text-black font-semibold text-lg border-b pb-2">Visibility Settings</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status Visibility</label>
                <select
                  {...register("status")}
                  className="w-full bg-[#F9FAFB] border text-xs px-4 py-3 rounded-[8px] outline-none text-black cursor-pointer"
                >
                  <option value="active">Published</option>
                  <option value="draft">Draft / Inactive</option>
                </select>
              </div>
              {/* 🚀 FIXED: HTML attributes button pass handled safely inside standard click handlers */}
              <PrimaryButton
                onClick={handleSubmit(onSubmitFormHandler)}
                icon={childCategoryMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                label={childCategoryMutation.isPending ? "Saving..." : isEditMode ? "Save Changes" : "Add Child Category"}
                className={`w-full justify-center bg-[#085E00] hover:bg-[#064400] text-white py-3 font-semibold ${childCategoryMutation.isPending ? "opacity-60 pointer-events-none" : ""}`}
              />
            </div>

            <div className="bg-white rounded-[8px] p-5 border border-gray-100 space-y-4">
              <h3 className="text-black font-semibold text-lg border-b pb-2">Child Branding Icon</h3>
              <div className="border-2 border-dashed border-gray-200 bg-[#F9F9F9] rounded-[8px] p-6 text-center relative flex flex-col items-center justify-center min-h-[180px]">
                {imageUrl ? (
                  <div className="relative group w-24 h-24 rounded-[8px] border overflow-hidden bg-white shadow-xs">
                    <img src={imageUrl.startsWith("http") ? imageUrl : `${baseStorageUrl}${imageUrl}`} className="w-full h-full object-cover" alt="" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div window-click-mock="true" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center cursor-pointer outline-none">
                    <IamgeIcon size="54" color="#A2A2A2" />
                    <p className="text-xs text-[#A2A2A2] mt-2 font-medium">Click to upload brand asset</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageFileChange} disabled={uploading} />
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
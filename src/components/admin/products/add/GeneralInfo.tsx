// // import {
// //   AlignLeft,
// //   Bold,
// //   ChevronDown,
// //   Code,
// //   Italic,
// //   ItalicIcon,
// //   LinkIcon,
// //   List,
// //   ListOrdered,
// //   Quote,
// //   Smile,
// //   Type,
// //   Underline,
// // } from "lucide-react";
// // import { Input } from "./Input";
// // import { Label } from "./Label";
// // import { Toggle } from "./Toggle";
// // import { SectionWrapper } from "./SectionWrapper";
// // import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";

// // export default function GeneralInfo() {
// //   return (
// //     <SectionWrapper title="General Information">
// //       <div title="General Information">
// //         <div className="flex flex-col gap-6">
// //           <div>
// //             <div className="flex justify-between items-end mb-1.5">
// //               <Label required>Item Name</Label>
// //               <div className="flex items-center gap-2 mb-1.5">
// //                 <span className="text-base font-normal text-black">
// //                   Auto Slug
// //                 </span>
// //                 <Toggle checked={false} />
// //               </div>
// //             </div>
// //             <Input placeholder="Ex: Samsung Galaxy S23 Ultra" />
// //           </div>

// //           <div>
// //             <Label required>Media</Label>
// //             <div className="bg-[#F9F9F9] rounded-[8px] py-12 flex flex-col items-center justify-center text-center">
// //               <div className="mb-4">
// //                 <IamgeIcon color="#A2A2A2" size="76" />
// //               </div>
// //               <p className="text-base text-[#A2A2A2] mb-1 font-normal">
// //                 Drag and drop image here, or click add image.
// //               </p>
// //               <p className="text-xs text-[#A2A2A2] mb-5 max-w-[320px] px-4">
// //                 Supported formats: JPG, PNG, Max size: 4MB. Note: Use images
// //                 with a 1:1.6 aspect ratio (855x1386 pixels.)
// //               </p>
// //               <button className="bg-[#F7931E] text-white px-4 py-3 rounded-[8px] text-sm font-semibold">
// //                 Add Image
// //               </button>
// //             </div>
// //           </div>

// //           <div>
// //             <div className="relative">
// //               <input
// //                 className="w-full bg-[#F9F9F9] rounded-[8px] pl-12 pr-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2]"
// //                 placeholder="Past YouTube Video Link (Optional)"
// //               />
// //             </div>
// //           </div>

// //           <div>
// //             <Label>Short Description</Label>
// //             <textarea
// //               className="w-full bg-[#F9FAFB] rounded-[8px] px-4 py-3 text-sm min-h-[88px] outline-none placeholder:[#A2A2A2]"
// //               placeholder="Ex: Short Description"
// //             />
// //           </div>

// //           <div>
// //             <Label required>Product Description</Label>
// //             <div className="bg-[#F9FAFB] rounded-[8px] overflow-hidden">
// //               <div className="flex flex-wrap items-center gap-4 p-3 border-b border-white">
// //                 <div className="flex items-center text-xs font-bold text-[#4F4D4D] cursor-pointer">
// //                   Normal <ChevronDown size={14} className="ml-1" />
// //                 </div>
// //                 <Bold size={16} className="text-[#4F4D4D]" />{" "}
// //                 <Italic size={16} className="text-[#4F4D4D]" />{" "}
// //                 <Underline size={16} className="text-[#4F4D4D]" />
// //                 {/* <div className="h-4 w-[1px] bg-[#4F4D4D] mx-1" /> */}
// //                 <Quote size={16} className="text-[#4F4D4D]" />{" "}
// //                 <Type size={16} className="text-[#4F4D4D]" />
// //                 {/* <div className="h-4 w-[1px] bg-gray-200 mx-1" /> */}
// //                 <AlignLeft size={16} className="text-[#4F4D4D]" />{" "}
// //                 <List size={16} className="text-[#4F4D4D]" />{" "}
// //                 <ListOrdered size={16} className="text-[#4F4D4D]" />
// //                 <div className="h-4 w-[1px] bg-gray-200 mx-1" />
// //                 <Code size={16} className="text-gray-400" />{" "}
// //                 <Smile size={16} className="text-[#4F4D4D]" />{" "}
// //                 <LinkIcon size={16} className="text-[#4F4D4D]" />
// //               </div>
// //               <textarea
// //                 className="w-full bg-transparent p-4 min-h-[140px] outline-none text-sm text-gray-600"
// //                 placeholder="Ex: Description"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </SectionWrapper>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { Loader2 } from "lucide-react";
// import { getAdminTokenAction } from "@/app/actions/auth";
// import { apiFetch } from "@/utils/api";
// import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";
// import Image from "next/image";

// export default function GeneralInfo() {
//   const { register, setValue, watch } = useFormContext();
//   const [uploading, setUploading] = useState(false);
//   const autoSlug = watch("autoSlug");
//   const images = watch("images") || [];

//   const handleImageUploadStream = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setUploading(true);
//       const token = await getAdminTokenAction();
//       const multipartForm = new FormData();
//       multipartForm.append("image", file);

//       const res = await apiFetch("/products/upload-image", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token || ""}` },
//         body: multipartForm,
//       });

//       if (!res.ok) throw new Error("Image server upload error");
//       const data = await res.json();

//       // Update form context state securely
//       setValue("images", [...images, data.image_url]);
//     } catch (err) {
//       console.error("Image dispatch upload failure log:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-[8px] px-4 py-5 mb-4 border border-gray-100">
//       <div className="flex flex-col gap-6">
//         <div>
//           <div className="flex justify-between items-end mb-1.5">
//             <label className="text-base font-normal text-black">
//               Item Name <span className="text-[#E30000]">*</span>
//             </label>
//             <div
//               className="flex items-center gap-2 mb-1.5 cursor-pointer"
//               onClick={() => setValue("autoSlug", !autoSlug)}
//             >
//               <span className="text-base font-normal text-black">
//                 Auto Slug
//               </span>
//               <div
//                 className={`w-10 h-5 rounded-full relative transition-colors ${autoSlug ? "bg-[#1DA1F2]" : "bg-gray-200"}`}
//               >
//                 <div
//                   className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-xs ${autoSlug ? "left-5" : "left-0.5"}`}
//                 />
//               </div>
//             </div>
//           </div>
//           <input
//             {...register("name", {
//               required: true,
//               onChange: (e) => {
//                 if (autoSlug) {
//                   const computed = e.target.value
//                     .toLowerCase()
//                     .replace(/[^a-z0-9]+/g, "-")
//                     .replace(/(^-|-$)/g, "");
//                   setValue("slug", computed);
//                 }
//               },
//             })}
//             className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2] text-gray-700"
//             placeholder="Ex: Samsung Galaxy S23 Ultra"
//           />
//         </div>

//         <div>
//           <label className="text-base font-normal text-black mb-1.5 block">
//             Product Link Slug (URL Path)
//           </label>
//           <input
//             {...register("slug")}
//             disabled={autoSlug}
//             className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2] text-gray-500 disabled:opacity-60"
//             placeholder="auto-computed-url-slug"
//           />
//         </div>

//         <div>
//           <label className="text-base font-normal text-black mb-1.5 block">
//             Media <span className="text-[#E30000]">*</span>
//           </label>
//           <div className="bg-[#F9F9F9] rounded-lg py-12 flex flex-col items-center justify-center text-center relative border border-dashed border-gray-200">
//             {images.length > 0 && (
//               <div className="flex flex-wrap gap-2.5 mb-4 px-4">
//                 {images.map((src: string, i: number) => (
//                   <Image
//                     key={i}
//                     src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "")}${src}`}
//                     width={64}
//                     height={64}
//                     className="object-cover border rounded bg-white"
//                     alt=""
//                     unoptimized
//                   />
//                 ))}
//               </div>
//             )}
//             <label className="cursor-pointer flex flex-col items-center">
//               <IamgeIcon color="#A2A2A2" size="76" />
//               <p className="text-base text-[#A2A2A2] mb-1 font-normal">
//                 Drag and drop image here, or click add image.
//               </p>
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageUploadStream}
//                 disabled={uploading}
//               />
//             </label>
//             {uploading && (
//               <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
//                 <Loader2 className="animate-spin text-orange-500" />
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="text-base font-normal text-black mb-1.5 block">
//             Short Description
//           </label>
//           <textarea
//             {...register("short_description")}
//             className="w-full bg-[#F9FAFB] rounded-lg px-4 py-3 text-sm min-h-[88px] outline-none placeholder:text-[#A2A2A2] text-gray-700 resize-none"
//             placeholder="Ex: Short Description"
//           />
//         </div>

//         <div>
//           <label className="text-base font-normal text-black mb-1.5 block">
//             Product Description <span className="text-[#E30000]">*</span>
//           </label>
//           <div className="bg-[#F9FAFB] rounded-lg overflow-hidden border">
//             <div className="flex flex-wrap items-center gap-4 p-3 border-b border-white bg-gray-50/50">
//               <span className="text-xs font-bold text-[#4F4D4D]">Normal</span>
//             </div>
//             <textarea
//               {...register("description", { required: true })}
//               className="w-full bg-transparent p-4 min-h-[140px] outline-none text-sm text-gray-600 focus:bg-white transition-colors"
//               placeholder="Ex: Description"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { uploadProductMedia } from "@/services-api/productService";
import { useRef, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { SectionWrapper } from "./SectionWrapper";
import { Label } from "./Label";
import { Toggle } from "./Toggle";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";
import RichTextEditor from "./Richtexteditor";

export default function GeneralInfoSection({
  images,
  setImages,
  uploading,
  setUploading,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}) {
  const { register, setValue, watch, control } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  // useRef to store drag index — survives React re-renders, unlike dataTransfer
  const dragIndexRef = useRef<number | null>(null);
  const autoSlug = watch("autoSlug");
  const baseStorageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  // ---- Drag & Drop reorder (ref-based — reliable across repeated drags) ----
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
      console.log("[Drag] dragStart → index:", index);
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log("[Drag] dragEnd — resetting ref. was:", dragIndexRef.current);
    dragIndexRef.current = null;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      const refVal = dragIndexRef.current;
      const dtVal = e.dataTransfer.getData("text/plain");
      console.log(
        "[Drag] drop → refVal:",
        refVal,
        "| dataTransfer raw:",
        dtVal,
        "| dropIndex:",
        dropIndex,
      );

      const draggedIndex = refVal !== null ? refVal : Number(dtVal);

      dragIndexRef.current = null;

      if (
        draggedIndex === null ||
        Number.isNaN(draggedIndex) ||
        draggedIndex === dropIndex
      ) {
        console.log("[Drag] drop ignored — same index or invalid");
        return;
      }

      console.log("[Drag] reordering:", draggedIndex, "→", dropIndex);
      setImages((prev: string[]) => {
        const updated = [...prev];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(dropIndex, 0, movedItem);
        return updated;
      });
    },
    [setImages],
  );
  // ---- end Drag & Drop reorder ----

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const paths = await uploadProductMedia(files);
      if (paths.length > 0) {
        setImages((prev: string[]) => [...prev, ...paths]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Asset Sync Rejection: ${err.message}`);
      } else {
        toast.error(`Asset Sync Rejection: Something went wrong`);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(e.target.files);
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
              <Toggle
                checked={!!autoSlug}
                onChange={(val) => setValue("autoSlug", val)}
              />
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
          <Label required>Slug</Label>
          <input
            {...register("slug")}
            disabled={autoSlug}
            className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none text-gray-500 disabled:opacity-60"
            placeholder="samsung-galaxy-s23-ultra"
          />
        </div>

        <div>
          <Label required>Media</Label>
          <div
            className="bg-[#F9F9F9] rounded-[8px] p-6 text-center relative flex flex-col items-center justify-center min-h-[160px]"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(e.dataTransfer.files);
              }
            }}
          >
            {images.length > 0 && (
              <div className="flex flex-row flex-wrap items-center justify-center gap-3 mb-4">
                {images.map((src: string, i: number) => {
                  const cleanImg = src.trim();
                  const finalSrc = cleanImg.startsWith("http")
                    ? cleanImg
                    : `${baseStorageUrl}/${cleanImg.replace(/^\/+/, "")}`;

                  return (
                    <div
                      key={cleanImg}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, i)}
                      onDragEnd={handleDragEnd}
                      className="relative group w-20 h-20 rounded border border-gray-200 overflow-hidden bg-white shadow-xs shrink-0 cursor-move"
                    >
                      <Image
                        unoptimized
                        width={100}
                        height={100}
                        src={finalSrc}
                        className="w-full h-full object-cover pointer-events-none"
                        alt={`image ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(
                            images.filter(
                              (_: string, idx: number) => idx !== i,
                            ),
                          )
                        }
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer flex flex-col items-center select-none"
            >
              <IamgeIcon size="48" color="#999" />
              <span className="text-[#A2A2A2] text-base font-normal">
                Drag image here or click to add.
              </span>
              <span className="max-w-[300px] text-xs text-[#A2A2A2] mt-2 font-normal">
                Recommended formats: JPG, PNG. Max size: 4MB. Use 1:1 aspect
                ratio (1080×1080 px).
              </span>
              <button className="cursor-pointer text-sm font-lato font-semibold px-4 py-2 bg-[#FF9F1C] rounded-sm text-white mt-3">
                Add Image
              </button>
            </div>
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={handleUpload}
              accept="image/*"
              multiple
              disabled={uploading}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <Loader2 className="animate-spin text-orange-500" size={24} />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Short Description</Label>
          <textarea
            {...register("short_description")}
            className="w-full bg-[#F9FAFB] rounded-[8px] px-4 py-3 text-sm min-h-[80px] outline-none text-gray-800 resize-none"
            placeholder="Summary highlights..."
          />
        </div>

        <div>
          <Label required>Product Description</Label>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Ex: Description"
              />
            )}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

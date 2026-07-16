// // "use client";
// // import React, {
// //   useRef,
// //   ChangeEvent,
// //   useMemo,
// //   useState,
// //   useEffect,
// // } from "react";
// // import Image from "next/image";
// // import { ChevronLeft, Loader2, UploadCloud, ChevronUp } from "lucide-react";
// // import { useMutation, useQuery } from "@tanstack/react-query";
// // import { uploadBlogImage } from "@/services-api/blogService";
// // import { searchProducts } from "@/services-api/productService";
// // import { BlogFormData } from "@/@types/blogpost.type";
// // import toast from "react-hot-toast";

// // import dynamic from "next/dynamic";
// // const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// // import "react-quill-new/dist/quill.snow.css";

// // import Select, { StylesConfig } from "react-select";
// // import PrimaryButton from "../../common/PrimaryButton";

// // interface Product {
// //   id?: string;
// //   _id?: string;
// //   name?: string;
// //   title?: string;
// // }

// // interface Props {
// //   editingId: string | null;
// //   formData: BlogFormData;
// //   setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
// //   onClose: () => void;
// //   onSave: () => void;
// //   isSaving: boolean;
// //   products?: Product[];
// // }

// // interface UploadResponse {
// //   image_url?: string;
// //   data?: {
// //     image_url?: string;
// //   };
// // }

// // export default function BlogForm({
// //   editingId,
// //   formData,
// //   setFormData,
// //   onClose,
// //   onSave,
// //   isSaving,
// //   products = [],
// // }: Props) {
// //   const blogBannerRef = useRef<HTMLInputElement>(null);
// //   const [isAutoSlug, setIsAutoSlug] = useState(true);

// //   const [searchValue, setSearchValue] = useState("");
// //   const [debouncedSearch, setDebouncedSearch] = useState("");

// //   // Keep track of all products encountered to ensure labels are visible for selected IDs
// //   const [availableProducts, setAvailableProducts] =
// //     useState<Product[]>(products);

// //   const backendBaseUrl =
// //     process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
// //     "http://localhost:8082";

// //   // Search debounce logic
// //   useEffect(() => {
// //     const handler = setTimeout(() => {
// //       setDebouncedSearch(searchValue);
// //     }, 500);
// //     return () => clearTimeout(handler);
// //   }, [searchValue]);

// //   // Fetch products based on search
// //   const { data: searchResults, isLoading: isSearching } = useQuery({
// //     queryKey: ["product-search", debouncedSearch],
// //     queryFn: () => searchProducts(debouncedSearch),
// //     enabled: debouncedSearch.length > 1,
// //   });

// //   // Synchronize search results with availableProducts state to maintain labels
// //   useEffect(() => {
// //     if (Array.isArray(searchResults)) {
// //       setAvailableProducts((prev) => {
// //         const newItems = searchResults.filter(
// //           (s) => !prev.find((p) => (p.id || p._id) === (s.id || s._id)),
// //         );
// //         return [...prev, ...newItems];
// //       });
// //     }
// //   }, [searchResults]);

// //   const generateSlug = (text: string) => {
// //     return text
// //       .toString()
// //       .toLowerCase()
// //       .trim()
// //       .replace(/\s+/g, "-")
// //       .replace(/[^\w\-]+/g, "")
// //       .replace(/\-\-+/g, "-");
// //   };

// //   const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     const newTitle = e.target.value;
// //     setFormData((prev) => ({
// //       ...prev,
// //       title: newTitle,
// //       slug: isAutoSlug ? generateSlug(newTitle) : prev.slug,
// //     }));
// //   };

// //   const blogImageMutation = useMutation<UploadResponse, Error, File>({
// //     mutationFn: (file: File) => uploadBlogImage(file),
// //     onSuccess: (res) => {
// //       const imageUrl = res?.image_url || res?.data?.image_url;
// //       if (imageUrl) {
// //         setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
// //         toast.success("Image uploaded successfully!");
// //       }
// //     },
// //     onError: () => {
// //       toast.error("Failed to upload image.");
// //     },
// //   });

// //   // Transform available products into React-Select options
// //   const selectOptions = useMemo(() => {
// //     return availableProducts.map((p) => ({
// //       value: (p.id || p._id) as string,
// //       label: (p.name || p.title) as string,
// //     }));
// //   }, [availableProducts]);

// //   // Map selected IDs from formData back to option objects for the Select value
// //   const currentSelectedOptions = useMemo(() => {
// //     return selectOptions.filter((opt) =>
// //       formData.product_ids?.includes(opt.value),
// //     );
// //   }, [formData.product_ids, selectOptions]);

// //   const modules = useMemo(
// //     () => ({
// //       toolbar: [
// //         [{ header: [1, 2, 3, false] }],
// //         ["bold", "italic", "underline", "strike", "blockquote"],
// //         [{ list: "ordered" }, { list: "bullet" }],
// //         [{ align: [] }],
// //         ["link", "image", "video"],
// //         ["clean"],
// //       ],
// //     }),
// //     [],
// //   );

// //   const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
// //     control: (base) => ({
// //       ...base,
// //       background: "#F9FAFB",
// //       borderColor: "#E5E7EB",
// //       borderRadius: "0.5rem",
// //       fontSize: "14px",
// //       boxShadow: "none",
// //       minHeight: "45px",
// //     }),
// //     multiValue: (base) => ({
// //       ...base,
// //       backgroundColor: "#E0F2FE",
// //       borderRadius: "4px",
// //     }),
// //     multiValueLabel: (base) => ({
// //       ...base,
// //       color: "#0369A1",
// //       fontWeight: "600",
// //     }),
// //     multiValueRemove: (base) => ({
// //       ...base,
// //       color: "#0369A1",
// //       ":hover": { backgroundColor: "#BAE6FD", color: "#ef4444" },
// //     }),
// //   };

// //   if (!formData) return null;

// //   return (
// //     <div className="bg-white min-h-screen p-6 font-lato">
// //       <div>
// //         <div className="flex items-center justify-between mb-6">
// //           <div className="flex items-center gap-4">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="p-2 bg-white cursor-pointer"
// //             >
// //               <ChevronLeft size={20} className="text-gray-600" />
// //             </button>
// //             <h1 className="text-xl font-bold text-slate-900">
// //               {editingId ? "Edit Blog" : "Create Blog"}
// //             </h1>
// //           </div>
// //           <PrimaryButton
// //             onClick={onSave}
// //             label={
// //               isSaving ? "Saving..." : editingId ? "Update Blog" : "Save Blog"
// //             }
// //           />
// //         </div>

// //         <div className="space-y-6">
// //           <div className="bg-white rounded-xl overflow-hidden">
// //             <div className="flex items-center justify-between py-5">
// //               <h3 className="font-bold text-slate-800 text-lg">
// //                 General Information
// //               </h3>
// //               <ChevronUp size={20} className="text-gray-400" />
// //             </div>

// //             <div className="space-y-6">
// //               <div>
// //                 <div className="flex justify-between items-center mb-2">
// //                   <label className="text-sm font-semibold text-slate-700">
// //                     Blog Title*
// //                   </label>
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-[11px] text-gray-400 font-bold uppercase">
// //                       Auto Slug
// //                     </span>
// //                     <label className="relative inline-flex items-center cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         className="sr-only peer"
// //                         checked={isAutoSlug}
// //                         onChange={() => setIsAutoSlug(!isAutoSlug)}
// //                       />
// //                       <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
// //                     </label>
// //                   </div>
// //                 </div>
// //                 <input
// //                   value={formData.title || ""}
// //                   onChange={handleTitleChange}
// //                   type="text"
// //                   placeholder="Ex: Samsung Galaxy S25 Ultra"
// //                   className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-semibold text-slate-700 mb-2">
// //                   Blog Slug
// //                 </label>
// //                 <input
// //                   value={formData.slug || ""}
// //                   onChange={(e) =>
// //                     setFormData((p) => ({ ...p, slug: e.target.value }))
// //                   }
// //                   type="text"
// //                   readOnly={isAutoSlug}
// //                   className={`w-full border border-gray-200 rounded-lg p-3 text-sm ${isAutoSlug ? "bg-gray-100 text-gray-400" : "bg-[#F9FAFB]"}`}
// //                 />
// //               </div>

// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-slate-700 mb-2">
// //                     Status
// //                   </label>
// //                   <select
// //                     value={formData.status || "PUBLISHED"}
// //                     onChange={(e) =>
// //                       setFormData((p) => ({
// //                         ...p,
// //                         status: e.target.value as BlogFormData["status"],
// //                       }))
// //                     }
// //                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
// //                   >
// //                     <option value="PUBLISHED">Published</option>
// //                     <option value="DRAFT">Draft</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-semibold text-slate-700 mb-2">
// //                     Display Order
// //                   </label>
// //                   <input
// //                     value={formData.order ?? 0}
// //                     onChange={(e) =>
// //                       setFormData((p) => ({
// //                         ...p,
// //                         order: parseInt(e.target.value) || 0,
// //                       }))
// //                     }
// //                     type="number"
// //                     min="0"
// //                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-semibold text-slate-700 mb-2">
// //                   Related Products (Search & Select)
// //                 </label>
// //                 <Select
// //                   isMulti
// //                   options={selectOptions}
// //                   isLoading={isSearching}
// //                   onInputChange={(val) => setSearchValue(val)}
// //                   value={currentSelectedOptions}
// //                   closeMenuOnSelect={false}
// //                   hideSelectedOptions={true}
// //                   onChange={(selected) => {
// //                     const ids = selected ? selected.map((s) => s.value) : [];
// //                     setFormData((prev) => ({ ...prev, product_ids: ids }));
// //                   }}
// //                   placeholder="Type to search and select products..."
// //                   styles={selectStyles}
// //                   noOptionsMessage={() =>
// //                     searchValue.length < 2
// //                       ? "Type at least 2 characters"
// //                       : "No products found"
// //                   }
// //                 />
// //                 <p className="text-[10px] text-gray-400 mt-1 italic">
// //                   *Selected {formData.product_ids?.length || 0} items
// //                 </p>
// //               </div>

// //               <div className="pt-2">
// //                 <label className="block text-sm font-semibold text-slate-700 mb-4 mt-2">
// //                   Blog Banner*
// //                 </label>
// //                 <input
// //                   type="file"
// //                   ref={blogBannerRef}
// //                   className="hidden"
// //                   accept="image/*"
// //                   onChange={(e) =>
// //                     e.target.files &&
// //                     blogImageMutation.mutate(e.target.files[0])
// //                   }
// //                 />

// //                 <div
// //                   onClick={() => blogBannerRef.current?.click()}
// //                   className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-[#FAFAFA] flex flex-col items-center justify-center cursor-pointer min-h-[220px] hover:bg-gray-50 transition-all"
// //                 >
// //                   {blogImageMutation.isPending ? (
// //                     <Loader2 size={32} className="animate-spin text-sky-500" />
// //                   ) : formData.featured_image ? (
// //                     <div className="relative w-full h-48">
// //                       <Image
// //                         src={`${backendBaseUrl}/${formData.featured_image?.replace(/^\/+/, "")}`}
// //                         className="object-contain rounded-lg"
// //                         alt="Preview"
// //                         fill
// //                         unoptimized
// //                       />
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <UploadCloud size={48} className="text-gray-300 mb-3" />
// //                       <p className="text-gray-500 text-sm font-medium text-center">
// //                         Click to add image
// //                       </p>
// //                       <button
// //                         type="button"
// //                         className="mt-5 bg-[#FF9F1C] text-white px-10 py-2.5 rounded-lg text-sm font-bold"
// //                       >
// //                         Add Image
// //                       </button>
// //                     </>
// //                   )}
// //                 </div>

// //                 <div className="mt-4">
// //                   <input
// //                     type="text"
// //                     placeholder="Past YouTube Video Link (Optional)"
// //                     value={formData.youtube_link || ""}
// //                     onChange={(e) =>
// //                       setFormData((prev) => ({
// //                         ...prev,
// //                         youtube_link: e.target.value,
// //                       }))
// //                     }
// //                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white">
// //             <h3 className="font-bold text-slate-800 mb-4">Blog Description*</h3>
// //             <ReactQuill
// //               theme="snow"
// //               value={formData.content || ""}
// //               onChange={(val) =>
// //                 setFormData((prev) => ({ ...prev, content: val }))
// //               }
// //               modules={modules}
// //               placeholder="Ex: Description"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       <style jsx global>{`
// //         .ql-toolbar.ql-snow {
// //           border-radius: 8px 8px 0 0;
// //           background: #f9fafb;
// //           border: 1px solid #e5e7eb !important;
// //           padding: 12px !important;
// //         }
// //         .ql-container.ql-snow {
// //           border-radius: 0 0 8px 8px;
// //           border: 1px solid #e5e7eb !important;
// //           min-height: 200px;
// //         }
// //         .ql-editor {
// //           font-size: 14px;
// //           min-height: 200px;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// "use client";
// import React, {
//   useRef,
//   ChangeEvent,
//   useMemo,
//   useState,
//   useEffect,
// } from "react";
// import Image from "next/image";
// import { ChevronLeft, Loader2, UploadCloud, ChevronUp } from "lucide-react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { uploadBlogImage } from "@/services-api/blogService";
// import { searchProducts } from "@/services-api/productService";
// import { BlogFormData } from "@/@types/blogpost.type";
// import toast from "react-hot-toast";

// import dynamic from "next/dynamic";
// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";

// import Select, { StylesConfig } from "react-select";
// import PrimaryButton from "../../common/PrimaryButton";

// interface Product {
//   id?: string;
//   _id?: string;
//   name?: string;
//   title?: string;
// }

// interface Props {
//   editingId: string | null;
//   formData: BlogFormData;
//   setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
//   onClose: () => void;
//   onSave: () => void;
//   isSaving: boolean;
//   products?: Product[];
// }

// interface UploadResponse {
//   image_url?: string;
//   data?: {
//     image_url?: string;
//   };
// }

// export default function BlogForm({
//   editingId,
//   formData,
//   setFormData,
//   onClose,
//   onSave,
//   isSaving,
//   products = [],
// }: Props) {
//   const blogBannerRef = useRef<HTMLInputElement>(null);
//   const [isAutoSlug, setIsAutoSlug] = useState(true);

//   const [searchValue, setSearchValue] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // Initialize state with products already associated with the blog
//   const [availableProducts, setAvailableProducts] =
//     useState<Product[]>(products);

//   const backendBaseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
//     "http://localhost:8082";

//   // Update availableProducts if the initial products prop changes (important for Edit Mode)
//   useEffect(() => {
//     if (products.length > 0) {
//       setAvailableProducts((prev) => {
//         const combined = [...prev];
//         products.forEach((p) => {
//           if (!combined.find((x) => (x.id || x._id) === (p.id || p._id))) {
//             combined.push(p);
//           }
//         });
//         return combined;
//       });
//     }
//   }, [products]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchValue);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchValue]);

//   const { data: searchResults, isLoading: isSearching } = useQuery({
//     queryKey: ["product-search", debouncedSearch],
//     queryFn: () => searchProducts(debouncedSearch),
//     enabled: debouncedSearch.length > 1,
//   });

//   useEffect(() => {
//     if (Array.isArray(searchResults)) {
//       setAvailableProducts((prev) => {
//         const newItems = searchResults.filter(
//           (s) => !prev.find((p) => (p.id || p._id) === (s.id || s._id)),
//         );
//         return [...prev, ...newItems];
//       });
//     }
//   }, [searchResults]);

//   const generateSlug = (text: string) => {
//     return text
//       .toString()
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, "-")
//       .replace(/[^\w\-]+/g, "")
//       .replace(/\-\-+/g, "-");
//   };

//   const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const newTitle = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       title: newTitle,
//       slug: isAutoSlug ? generateSlug(newTitle) : prev.slug,
//     }));
//   };

//   const blogImageMutation = useMutation<UploadResponse, Error, File>({
//     mutationFn: (file: File) => uploadBlogImage(file),
//     onSuccess: (res) => {
//       const imageUrl = res?.image_url || res?.data?.image_url;
//       if (imageUrl) {
//         setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
//         toast.success("Image uploaded successfully!");
//       }
//     },
//     onError: () => {
//       toast.error("Failed to upload image.");
//     },
//   });

//   const selectOptions = useMemo(() => {
//     return availableProducts.map((p) => ({
//       value: (p.id || p._id) as string,
//       label: (p.name || p.title) as string,
//     }));
//   }, [availableProducts]);

//   const currentSelectedOptions = useMemo(() => {
//     return selectOptions.filter((opt) =>
//       formData.product_ids?.includes(opt.value),
//     );
//   }, [formData.product_ids, selectOptions]);

//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike", "blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ align: [] }],
//         ["link", "image", "video"],
//         ["clean"],
//       ],
//     }),
//     [],
//   );

//   const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
//     control: (base) => ({
//       ...base,
//       background: "#F9FAFB",
//       borderColor: "#E5E7EB",
//       borderRadius: "0.5rem",
//       fontSize: "14px",
//       boxShadow: "none",
//       minHeight: "45px",
//     }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "#E0F2FE",
//       borderRadius: "4px",
//     }),
//     multiValueLabel: (base) => ({
//       ...base,
//       color: "#0369A1",
//       fontWeight: "600",
//     }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: "#0369A1",
//       ":hover": { backgroundColor: "#BAE6FD", color: "#ef4444" },
//     }),
//   };

//   if (!formData) return null;

//   return (
//     <div className="bg-white min-h-screen p-6 font-lato">
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="p-2 bg-white cursor-pointer"
//             >
//               <ChevronLeft size={20} className="text-gray-600" />
//             </button>
//             <h1 className="text-xl font-bold text-slate-900">
//               {editingId ? "Edit Blog" : "Create Blog"}
//             </h1>
//           </div>
//           <PrimaryButton
//             onClick={onSave}
//             label={
//               isSaving ? "Saving..." : editingId ? "Update Blog" : "Save Blog"
//             }
//           />
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-xl overflow-hidden">
//             <div className="flex items-center justify-between py-5">
//               <h3 className="font-bold text-slate-800 text-lg">
//                 General Information
//               </h3>
//               <ChevronUp size={20} className="text-gray-400" />
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="text-sm font-semibold text-slate-700">
//                     Blog Title*
//                   </label>
//                   <div className="flex items-center gap-2">
//                     <span className="text-[11px] text-gray-400 font-bold uppercase">
//                       Auto Slug
//                     </span>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={isAutoSlug}
//                         onChange={() => setIsAutoSlug(!isAutoSlug)}
//                       />
//                       <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
//                     </label>
//                   </div>
//                 </div>
//                 <input
//                   value={formData.title || ""}
//                   onChange={handleTitleChange}
//                   type="text"
//                   placeholder="Ex: Samsung Galaxy S25 Ultra"
//                   className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Blog Slug
//                 </label>
//                 <input
//                   value={formData.slug || ""}
//                   onChange={(e) =>
//                     setFormData((p) => ({ ...p, slug: e.target.value }))
//                   }
//                   type="text"
//                   readOnly={isAutoSlug}
//                   className={`w-full border border-gray-200 rounded-lg p-3 text-sm ${isAutoSlug ? "bg-gray-100 text-gray-400" : "bg-[#F9FAFB]"}`}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">
//                     Status
//                   </label>
//                   <select
//                     value={formData.status || "PUBLISHED"}
//                     onChange={(e) =>
//                       setFormData((p) => ({
//                         ...p,
//                         status: e.target.value as BlogFormData["status"],
//                       }))
//                     }
//                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
//                   >
//                     <option value="PUBLISHED">Published</option>
//                     <option value="DRAFT">Draft</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">
//                     Display Order
//                   </label>
//                   <input
//                     value={formData.order ?? 0}
//                     onChange={(e) =>
//                       setFormData((p) => ({
//                         ...p,
//                         order: parseInt(e.target.value) || 0,
//                       }))
//                     }
//                     type="number"
//                     min="0"
//                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Related Products (Search & Select)
//                 </label>
//                 <Select
//                   isMulti
//                   options={selectOptions}
//                   isLoading={isSearching}
//                   onInputChange={(val) => setSearchValue(val)}
//                   value={currentSelectedOptions}
//                   closeMenuOnSelect={false}
//                   hideSelectedOptions={true}
//                   onChange={(selected) => {
//                     const ids = selected ? selected.map((s) => s.value) : [];
//                     setFormData((prev) => ({ ...prev, product_ids: ids }));
//                   }}
//                   placeholder="Type to search and select products..."
//                   styles={selectStyles}
//                   noOptionsMessage={() =>
//                     searchValue.length < 2
//                       ? "Type at least 2 characters"
//                       : "No products found"
//                   }
//                 />
//                 <p className="text-[10px] text-gray-400 mt-1 italic">
//                   *Selected {formData.product_ids?.length || 0} items
//                 </p>
//               </div>

//               <div className="pt-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-4 mt-2">
//                   Blog Banner*
//                 </label>
//                 <input
//                   type="file"
//                   ref={blogBannerRef}
//                   className="hidden"
//                   accept="image/*"
//                   onChange={(e) =>
//                     e.target.files &&
//                     blogImageMutation.mutate(e.target.files[0])
//                   }
//                 />

//                 <div
//                   onClick={() => blogBannerRef.current?.click()}
//                   className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-[#FAFAFA] flex flex-col items-center justify-center cursor-pointer min-h-[220px] hover:bg-gray-50 transition-all"
//                 >
//                   {blogImageMutation.isPending ? (
//                     <Loader2 size={32} className="animate-spin text-sky-500" />
//                   ) : formData.featured_image ? (
//                     <div className="relative w-full h-48">
//                       <Image
//                         src={`${backendBaseUrl}/${formData.featured_image?.replace(/^\/+/, "")}`}
//                         className="object-contain rounded-lg"
//                         alt="Preview"
//                         fill
//                         unoptimized
//                       />
//                     </div>
//                   ) : (
//                     <>
//                       <UploadCloud size={48} className="text-gray-300 mb-3" />
//                       <p className="text-gray-500 text-sm font-medium text-center">
//                         Click to add image
//                       </p>
//                       <button
//                         type="button"
//                         className="mt-5 bg-[#FF9F1C] text-white px-10 py-2.5 rounded-lg text-sm font-bold"
//                       >
//                         Add Image
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <input
//                     type="text"
//                     placeholder="Past YouTube Video Link (Optional)"
//                     value={formData.youtube_link || ""}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         youtube_link: e.target.value,
//                       }))
//                     }
//                     className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white">
//             <h3 className="font-bold text-slate-800 mb-4">Blog Description*</h3>
//             <ReactQuill
//               theme="snow"
//               value={formData.content || ""}
//               onChange={(val) =>
//                 setFormData((prev) => ({ ...prev, content: val }))
//               }
//               modules={modules}
//               placeholder="Ex: Description"
//             />
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .ql-toolbar.ql-snow {
//           border-radius: 8px 8px 0 0;
//           background: #f9fafb;
//           border: 1px solid #e5e7eb !important;
//           padding: 12px !important;
//         }
//         .ql-container.ql-snow {
//           border-radius: 0 0 8px 8px;
//           border: 1px solid #e5e7eb !important;
//           min-height: 200px;
//         }
//         .ql-editor {
//           font-size: 14px;
//           min-height: 200px;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";
import React, {
  useRef,
  ChangeEvent,
  useMemo,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Loader2,
  UploadCloud,
  ChevronUp,
  Package,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadBlogImage } from "@/services-api/blogService";
import { searchProducts } from "@/services-api/productService";
import { BlogFormData } from "@/@types/blogpost.type";
import toast from "react-hot-toast";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

import Select, { StylesConfig } from "react-select";
import PrimaryButton from "../../common/PrimaryButton";

interface Product {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  featured_image?: string;
  thumbnail?: string;
}

interface Props {
  editingId: string | null;
  formData: BlogFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  products?: Product[];
}

interface UploadResponse {
  image_url?: string;
  data?: {
    image_url?: string;
  };
}

export default function BlogForm({
  editingId,
  formData,
  setFormData,
  onClose,
  onSave,
  isSaving,
  products = [],
}: Props) {
  const blogBannerRef = useRef<HTMLInputElement>(null);
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State to hold all products encountered (initial + searched) to maintain display labels
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "http://localhost:8082";

  // Effect to sync initial products (from API/Edit mode) into availableProducts state
  useEffect(() => {
    if (products && products.length > 0) {
      setAvailableProducts((prev) => {
        const combined = [...prev];
        products.forEach((p) => {
          const pId = p.id || p._id;
          if (!combined.find((x) => (x.id || x._id) === pId)) {
            combined.push(p);
          }
        });
        return combined;
      });
    }
  }, [products]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["product-search", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length > 1,
  });

  useEffect(() => {
    if (Array.isArray(searchResults)) {
      setAvailableProducts((prev) => {
        const newItems = searchResults.filter(
          (s) => !prev.find((p) => (p.id || p._id) === (s.id || s._id)),
        );
        return [...prev, ...newItems];
      });
    }
  }, [searchResults]);

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isAutoSlug ? generateSlug(newTitle) : prev.slug,
    }));
  };

  const blogImageMutation = useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadBlogImage(file),
    onSuccess: (res) => {
      const imageUrl = res?.image_url || res?.data?.image_url;
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
        toast.success("Image uploaded successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to upload image.");
    },
  });

  // Helper to get image path safely
  const getProductImagePath = (product: Product) => {
    const img = product.featured_image || product.thumbnail;
    if (!img) return null;
    return img.startsWith("http")
      ? img
      : `${backendBaseUrl}/${img.replace(/^\/+/, "")}`;
  };

  // Logic to render custom option with Image and Label
  const formatOptionLabel = (product: any) => {
    const originalProduct = availableProducts.find(
      (p) => (p.id || p._id) === product.value,
    );
    const imgSrc = originalProduct
      ? getProductImagePath(originalProduct)
      : null;

    return (
      <div className="flex items-center gap-3 py-1">
        <div className="relative w-8 h-8 rounded border bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.label}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <Package size={14} className="text-gray-400" />
          )}
        </div>
        <span className="text-sm font-medium text-slate-700">
          {product.label}
        </span>
      </div>
    );
  };

  const selectOptions = useMemo(() => {
    return availableProducts.map((p) => ({
      value: (p.id || p._id) as string,
      label: (p.name || p.title) as string,
    }));
  }, [availableProducts]);

  const currentSelectedOptions = useMemo(() => {
    return selectOptions.filter((opt) =>
      formData.product_ids?.includes(opt.value),
    );
  }, [formData.product_ids, selectOptions]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    [],
  );

  const selectStyles: StylesConfig<{ value: string; label: string }, true> = {
    control: (base) => ({
      ...base,
      background: "#F9FAFB",
      borderColor: "#E5E7EB",
      borderRadius: "0.5rem",
      fontSize: "14px",
      boxShadow: "none",
      minHeight: "45px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#E0F2FE",
      borderRadius: "6px",
      padding: "2px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369A1",
      fontWeight: "600",
      fontSize: "12px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0369A1",
      ":hover": { backgroundColor: "#BAE6FD", color: "#ef4444" },
    }),
  };

  if (!formData) return null;

  return (
    <div className="bg-white min-h-screen p-6 font-lato">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white cursor-pointer"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Blog" : "Create Blog"}
            </h1>
          </div>
          <PrimaryButton
            onClick={onSave}
            label={
              isSaving ? "Saving..." : editingId ? "Update Blog" : "Save Blog"
            }
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between py-5">
              <h3 className="font-bold text-slate-800 text-lg">
                General Information
              </h3>
              <ChevronUp size={20} className="text-gray-400" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Blog Title*
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">
                      Auto Slug
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isAutoSlug}
                        onChange={() => setIsAutoSlug(!isAutoSlug)}
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </div>
                <input
                  value={formData.title || ""}
                  onChange={handleTitleChange}
                  type="text"
                  placeholder="Ex: Samsung Galaxy S25 Ultra"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Blog Slug
                </label>
                <input
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, slug: e.target.value }))
                  }
                  type="text"
                  readOnly={isAutoSlug}
                  className={`w-full border border-gray-200 rounded-lg p-3 text-sm ${isAutoSlug ? "bg-gray-100 text-gray-400" : "bg-[#F9FAFB]"}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || "PUBLISHED"}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as BlogFormData["status"],
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Display Order
                  </label>
                  <input
                    value={formData.order ?? 0}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Related Products (Search & Select)
                </label>
                <Select
                  isMulti
                  options={selectOptions}
                  isLoading={isSearching}
                  onInputChange={(val) => setSearchValue(val)}
                  value={currentSelectedOptions}
                  formatOptionLabel={formatOptionLabel}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  onChange={(selected) => {
                    const ids = selected ? selected.map((s) => s.value) : [];
                    setFormData((prev) => ({ ...prev, product_ids: ids }));
                  }}
                  placeholder="Type to search products..."
                  styles={selectStyles}
                  noOptionsMessage={() =>
                    searchValue.length < 2
                      ? "Type at least 2 characters"
                      : "No products found"
                  }
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">
                  *Selected {formData.product_ids?.length || 0} items
                </p>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-4 mt-2">
                  Blog Banner*
                </label>
                <input
                  type="file"
                  ref={blogBannerRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    blogImageMutation.mutate(e.target.files[0])
                  }
                />

                <div
                  onClick={() => blogBannerRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-[#FAFAFA] flex flex-col items-center justify-center cursor-pointer min-h-[220px] hover:bg-gray-50 transition-all"
                >
                  {blogImageMutation.isPending ? (
                    <Loader2 size={32} className="animate-spin text-sky-500" />
                  ) : formData.featured_image ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={`${backendBaseUrl}/${formData.featured_image?.replace(/^\/+/, "")}`}
                        className="object-contain rounded-lg"
                        alt="Preview"
                        fill
                        unoptimized
                      />
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm font-medium text-center">
                        Click to add image
                      </p>
                      <button
                        type="button"
                        className="mt-5 bg-[#FF9F1C] text-white px-10 py-2.5 rounded-lg text-sm font-bold"
                      >
                        Add Image
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Past YouTube Video Link (Optional)"
                    value={formData.youtube_link || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        youtube_link: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-[#F9FAFB] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <h3 className="font-bold text-slate-800 mb-4">Blog Description*</h3>
            <ReactQuill
              theme="snow"
              value={formData.content || ""}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, content: val }))
              }
              modules={modules}
              placeholder="Ex: Description"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
          border: 1px solid #e5e7eb !important;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border-radius: 0 0 8px 8px;
          border: 1px solid #e5e7eb !important;
          min-height: 200px;
        }
        .ql-editor {
          font-size: 14px;
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}

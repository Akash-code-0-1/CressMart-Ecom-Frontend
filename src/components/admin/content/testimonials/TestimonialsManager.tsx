"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Star,
  Video as VideoIcon,
  CheckCircle,
  X,
  Upload,
} from "lucide-react";
import { 
  getAdminTestimonials, createTestimonial, 
  updateTestimonial, deleteTestimonial 
} from "@/services-api/testimonialService";
import { apiFetch } from "@/utils/api";
import { toast } from "react-hot-toast";
import Image from "next/image";
import PrimaryButton from "../../common/PrimaryButton";

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z"/><path d="m10 15 5-3-5-3z"/></svg>
);

const TestimonialsManager = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"FACEBOOK" | "YOUTUBE">("FACEBOOK");

  const [formData, setFormData] = useState<any>({
    type: "FACEBOOK",
    author_name: "",
    author_avatar: "",
    content: "",
    rating: 5,
    video_url: "",
    thumbnail: "",
    status: "PUBLISHED",
    order: 0
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-testimonials", activeTab],
    queryFn: () => getAdminTestimonials(activeTab),
  });
  const testimonials = res?.data || [];

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data };
      // If empty string, make it null so backend validation passes
      if (payload.video_url === "") payload.video_url = null;
      return editingId ? updateTestimonial(editingId, payload) : createTestimonial(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial saved!");
      closeModal();
    },
    onError: (err: any) => toast.error(err.message || "Save failed")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Deleted");
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ type: activeTab, author_name: "", author_avatar: "", content: "", rating: 5, video_url: "", thumbnail: "", status: "PUBLISHED", order: 0 });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "author_avatar" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      // 🚀 Using the new dedicated endpoint
      const uploadRes = await apiFetch("/testimonials/upload", { method: "POST", body });
      const result = await uploadRes.json();
      const url = result?.data?.image_url || result?.image_url;
      setFormData((prev: any) => ({ ...prev, [field]: url }));
      toast.success("Image staged for saving");
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const baseStorageUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8082";

  const getFullUrl = (path: string | null) => {
    if (!path || path === "") return "/images/placeholder.svg";
    return path.startsWith('http') ? path : `${baseStorageUrl}/${path.replace(/^\/+/, '')}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-lato">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Proof</h1>
            <p className="text-sm text-gray-500">Manage Facebook reviews and YouTube testimonials</p>
          </div>
          <PrimaryButton
            label="Add Testimonial"
            onClick={() => { setFormData({ ...formData, type: activeTab }); setIsModalOpen(true); }}
            icon={<PlusCircle size={20} />}
          />
        </div>

        <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl w-fit border border-gray-100 shadow-sm">
          <button onClick={() => setActiveTab("FACEBOOK")} className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "FACEBOOK" ? "bg-[#1877F2] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>
            <FacebookIcon /> Facebook
          </button>
          <button onClick={() => setActiveTab("YOUTUBE")} className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "YOUTUBE" ? "bg-[#FF0000] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>
            <YoutubeIcon /> YouTube
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group relative">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button onClick={() => { setEditingId(item.id); setFormData({ ...item }); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"><Edit2 size={14}/></button>
                  <button onClick={() => confirm("Delete?") && deleteMutation.mutate(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer"><Trash2 size={14}/></button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                    <Image src={getFullUrl(item.author_avatar)} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.author_name}</h4>
                    <div className="flex text-orange-400">
                      {[...Array(item.rating || 5)].map((_, i) => <Star key={i} size={10} className="fill-current"/>)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 flex-1 italic">"{item.content}"</p>
                
                {item.type === 'YOUTUBE' && item.thumbnail && (
                   <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border bg-gray-100">
                      <Image src={getFullUrl(item.thumbnail)} alt="" fill className="object-cover" unoptimized/>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20"><VideoIcon className="text-white"/></div>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{editingId ? "Edit" : "New"} Testimonial</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-200 rounded-full cursor-pointer"><X size={20}/></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Name</label>
                  <input required value={formData.author_name} onChange={e => setFormData({...formData, author_name: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Sort Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: +e.target.value})} className="w-full border rounded-xl p-2.5 text-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Content</label>
                <textarea required rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm" />
              </div>

              {formData.type === 'FACEBOOK' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">Rating</label>
                    <select value={formData.rating} onChange={e => setFormData({...formData, rating: +e.target.value})} className="w-full border rounded-xl p-2.5 text-sm">
                      {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Stars</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 text-center">
                    <label className="text-[11px] font-bold text-gray-400 uppercase block text-left">Avatar</label>
                    <label className="flex items-center justify-center gap-2 border-dashed border-2 border-gray-200 rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition-all">
                      {formData.author_avatar ? <CheckCircle className="text-emerald-500" size={18}/> : <Upload size={18} className="text-gray-400"/>}
                      <span className="text-xs font-bold text-gray-500">{formData.author_avatar ? "Uploaded" : "Upload"}</span>
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'author_avatar')} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">YouTube URL</label>
                    <input required value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase block">Thumbnail</label>
                    <label className="flex items-center justify-center gap-2 border-dashed border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-all">
                      {formData.thumbnail ? <CheckCircle className="text-emerald-500" size={20}/> : <Upload size={20} className="text-gray-400"/>}
                      <span className="text-sm font-bold text-gray-500">{formData.thumbnail ? "Thumbnail Ready" : "Upload Video Thumbnail"}</span>
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'thumbnail')} />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">Cancel</button>
                <button type="submit" disabled={mutation.isPending} className="flex-1 py-3 bg-[#FF7050] hover:bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-100 transition-all cursor-pointer">
                  {mutation.isPending ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
// "use client";
// import { useFieldArray, Control, useFormContext, Controller } from "react-hook-form";
// import { 
//   ChevronUp, ChevronDown, Trash2, 
//   Image as ImageIcon, Type, Columns, 
//   LayoutPanelLeft, Settings2, Plus
// } from "lucide-react";
// import { LogoUploadCard } from "./LogoUploadCard";

// interface Props { name: string; control: Control<any>; label: string; }

// export const PageBuilder = ({ name, control, label }: Props) => {
//   const { register } = useFormContext();
//   const { fields, append, remove, move } = useFieldArray({ control, name });

//   const addSection = (type: string) => {
//     append({ 
//       type, title: "", content: "", imageUrl: "", points: "", 
//       alignment: "right", 
//     });
//   };

//   return (
//     <div className="mb-14 bg-white rounded-[12px] border border-[#EEEEEE] overflow-hidden font-lato shadow-sm">
//       {/* Builder Header */}
//       <div className="bg-[#F9F9F9] p-5 border-b border-[#EEEEEE] flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#003032] p-2 rounded-lg text-white">
//              <LayoutPanelLeft size={20} />
//           </div>
//           <h3 className="text-lg font-bold text-[#003032] uppercase tracking-tight">{label}</h3>
//         </div>
//         <span className="text-[10px] font-bold text-[#FF7050] bg-[#FFF1F0] px-3 py-1 rounded-full border border-[#FFD8D1]">
//           {fields.length} ACTIVE BLOCKS
//         </span>
//       </div>

//       <div className="p-6 space-y-6 bg-white">
//         {fields.map((field: any, index) => (
//           <div key={field.id} className="group border border-[#EEEEEE] rounded-[12px] hover:border-[#FF7050]/30 transition-all overflow-hidden bg-white shadow-sm">
            
//             {/* Block Toolbar */}
//             <div className="bg-[#F9F9F9] px-4 py-2 border-b border-[#EEEEEE] flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-1">
//                   <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="p-1 hover:text-[#FF7050] disabled:opacity-20"><ChevronUp size={16}/></button>
//                   <button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="p-1 hover:text-[#FF7050] disabled:opacity-20"><ChevronDown size={16}/></button>
//                 </div>
//                 <div className="h-4 w-[1px] bg-[#E2E2E2]" />
//                 <span className="text-[10px] font-black uppercase text-[#003032]/60 tracking-widest">
//                   Block {index + 1} — <span className="text-[#FF7050]">{field.type.replace("_", " ")}</span>
//                 </span>
//               </div>
//               <button type="button" onClick={() => remove(index)} className="text-[#A2A2A2] hover:text-[#FF4D4D] transition-colors"><Trash2 size={16} /></button>
//             </div>

//             {/* Block Body */}
//             <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 font-poppins">
//               {/* Text Inputs */}
//               <div className="md:col-span-7 space-y-5">
//                 <div>
//                   <label className="text-[11px] font-bold text-[#000000] mb-2 block uppercase tracking-wider">Heading</label>
//                   <input 
//                     {...register(`${name}.${index}.title`)} 
//                     placeholder="Enter heading..." 
//                     className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none border-none placeholder:text-[#A2A2A2]"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-[11px] font-bold text-[#000000] mb-2 block uppercase tracking-wider">Description</label>
//                   <textarea 
//                     {...register(`${name}.${index}.content`)} 
//                     rows={3} 
//                     placeholder="Enter content..." 
//                     className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none border-none placeholder:text-[#A2A2A2] leading-relaxed"
//                   />
//                 </div>

//                 {field.type === "image_text" && (
//                   <div>
//                     <label className="text-[11px] font-bold text-[#FF7050] mb-2 block uppercase tracking-wider">Feature Points (New line per point)</label>
//                     <textarea 
//                       {...register(`${name}.${index}.points`)} 
//                       placeholder="• Authenticity&#10;• Fast Delivery" 
//                       className="w-full bg-[#FFFBF0] rounded-[8px] px-4 py-3 text-xs italic outline-none border border-orange-100"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Media Settings */}
//               <div className="md:col-span-5 bg-[#F9F9F9] p-5 rounded-[12px] border border-[#EEEEEE] space-y-5 text-left">
//                 {field.type !== "text_block" && (
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-bold text-[#003032]/50 uppercase flex items-center gap-2"><ImageIcon size={12}/> Media Upload</label>
//                     <Controller
//                       control={control}
//                       name={`${name}.${index}.imageUrl`}
//                       render={({ field: { onChange, value } }) => (
//                         <LogoUploadCard 
//                           // 💡 THE FIX: Provide a unique 'title' string for every block
//                           // This ensures the label's 'htmlFor' finds the unique input ID
//                           title={`${name}_${index}_image`} 
//                           value={value || ""} 
//                           onChange={onChange} 
//                         />
//                       )}
//                     />
//                   </div>
//                 )}

//                 {field.type === "image_text" && (
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-bold text-[#003032]/50 uppercase flex items-center gap-2"><Settings2 size={12}/> Position</label>
//                     <div className="flex bg-white rounded-lg p-1 border border-[#EEEEEE]">
//                       {["left", "right"].map((align) => (
//                         <label key={align} className="flex-1 text-center cursor-pointer">
//                           <input type="radio" {...register(`${name}.${index}.alignment`)} value={align} className="peer hidden" />
//                           <span className="block py-2 text-[10px] font-bold peer-checked:bg-[#003032] peer-checked:text-white text-[#A2A2A2] rounded-md transition-all uppercase">
//                             {align}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="mt-8 flex flex-wrap justify-center gap-4 py-6 border-t border-[#F0F0F0]">
//           <button type="button" onClick={() => addSection("banner")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all shadow-sm group">
//             <ImageIcon size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Wide Banner
//           </button>
//           <button type="button" onClick={() => addSection("text_block")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all shadow-sm group">
//             <Type size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Intro/Text
//           </button>
//           <button type="button" onClick={() => addSection("image_text")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all shadow-sm group">
//             <Columns size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Split Section
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


"use client";
import dynamic from "next/dynamic";
import { useFieldArray, Control, useFormContext, Controller } from "react-hook-form";
import { 
  ChevronUp, ChevronDown, Trash2, 
  Image as ImageIcon, Type, Columns, 
  LayoutPanelLeft, Settings2, Info
} from "lucide-react";
import { LogoUploadCard } from "./LogoUploadCard";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 animate-pulse rounded-lg" />
});

interface Props { name: string; control: Control<any>; label: string; }

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    ["link", "clean"],
  ],
};

export const PageBuilder = ({ name, control, label }: Props) => {
  const { register } = useFormContext();
  
  // 💡 This hook is now reset every time activePageTab changes thanks to the 'key' prop in parent
  const { fields, append, remove, move } = useFieldArray({ 
    control, 
    name: name 
  });

  const addSection = (type: string) => {
    append({ 
      type, title: "", content: "", imageUrl: "", points: "", 
      alignment: "right", 
    });
  };

  const getImageHint = (type: string) => {
    if (type === "banner") return "Recommended: 1200 x 400px (Wide WebP/PNG)";
    if (type === "image_text") return "Recommended: 500 x 500px (Square WebP/PNG)";
    return "Recommended: Under 1MB";
  };

  return (
    <div className="mb-14 bg-white rounded-[12px] border border-[#EEEEEE] overflow-hidden font-lato shadow-sm">
      <div className="bg-[#F9F9F9] p-5 border-b border-[#EEEEEE] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#003032] p-2 rounded-lg text-white">
             <LayoutPanelLeft size={20} />
          </div>
          <h3 className="text-lg font-bold text-[#003032] uppercase tracking-tight">{label}</h3>
        </div>
        <span className="text-[10px] font-bold text-[#FF7050] bg-[#FFF1F0] px-3 py-1 rounded-full border border-[#FFD8D1]">
          {fields.length} ACTIVE BLOCKS
        </span>
      </div>

      <div className="p-6 space-y-6 bg-white">
        {fields.map((field: any, index) => (
          <div key={field.id} className="group border border-[#EEEEEE] rounded-[12px] hover:border-[#FF7050]/30 transition-all overflow-hidden bg-white shadow-sm">
            
            <div className="bg-[#F9F9F9] px-4 py-2 border-b border-[#EEEEEE] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="p-1 hover:text-[#FF7050] disabled:opacity-20"><ChevronUp size={16}/></button>
                  <button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="p-1 hover:text-[#FF7050] disabled:opacity-20"><ChevronDown size={16}/></button>
                </div>
                <div className="h-4 w-[1px] bg-[#E2E2E2]" />
                <span className="text-[10px] font-black uppercase text-[#003032]/60 tracking-widest">
                  Block {index + 1} — <span className="text-[#FF7050]">{field.type.replace("_", " ")}</span>
                </span>
              </div>
              <button type="button" onClick={() => remove(index)} className="text-[#A2A2A2] hover:text-[#FF4D4D] transition-colors"><Trash2 size={16} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 font-poppins">
              <div className={field.type === "text_block" ? "md:col-span-12 space-y-5" : "md:col-span-7 space-y-5"}>
                <div>
                  <label className="text-[11px] font-bold text-[#000000] mb-2 block uppercase tracking-wider">Heading</label>
                  <input 
                    {...register(`${name}.${index}.title`)} 
                    placeholder="Enter heading..." 
                    className="w-full bg-[#F9F9F9] rounded-[8px] px-4 py-3 text-sm outline-none border-none placeholder:text-[#A2A2A2]"
                  />
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-[#000000] mb-2 block uppercase tracking-wider">Description Content (Rich Text)</label>
                  <div className="bg-[#F9F9F9] rounded-[8px] overflow-hidden border border-transparent focus-within:border-orange-200 transition-all">
                    <Controller
                      control={control}
                      name={`${name}.${index}.content`}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value || ""}
                          onChange={field.onChange}
                          modules={quillModules}
                          placeholder="Write professional content here..."
                          className="bg-[#F9F9F9] border-none"
                        />
                      )}
                    />
                  </div>
                </div>

                {field.type === "image_text" && (
                  <div>
                    <label className="text-[11px] font-bold text-[#FF7050] mb-2 block uppercase tracking-wider">Feature Points (New line per point)</label>
                    <textarea 
                      {...register(`${name}.${index}.points`)} 
                      placeholder="• Point 1&#10;• Point 2" 
                      className="w-full bg-[#FFFBF0] rounded-[8px] px-4 py-3 text-xs italic outline-none border border-orange-100"
                    />
                  </div>
                )}
              </div>

              {field.type !== "text_block" && (
                <div className="md:col-span-5 bg-[#F9F9F9] p-5 rounded-[12px] border border-[#EEEEEE] space-y-5 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#003032]/50 uppercase flex items-center gap-1.5"><ImageIcon size={12}/> Media Upload</label>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-[#FF7050] font-medium bg-[#FFF7F5] px-2.5 py-1.5 rounded-md border border-[#FFE5E1]">
                      <Info size={13} className="shrink-0" />
                      <span>{getImageHint(field.type)}</span>
                    </div>

                    <Controller
                      control={control}
                      name={`${name}.${index}.imageUrl`}
                      render={({ field: { onChange, value } }) => (
                        <LogoUploadCard 
                          title={`${name}_${index}_image`} 
                          value={value || ""} 
                          onChange={onChange} 
                        />
                      )}
                    />
                  </div>

                  {field.type === "image_text" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#003032]/50 uppercase flex items-center gap-2"><Settings2 size={12}/> Position</label>
                      <div className="flex bg-white rounded-lg p-1 border border-[#EEEEEE]">
                        {["left", "right"].map((align) => (
                          <label key={align} className="flex-1 text-center cursor-pointer">
                            <input type="radio" {...register(`${name}.${index}.alignment`)} value={align} className="peer hidden" />
                            <span className="block py-2 text-[10px] font-bold peer-checked:bg-[linear-gradient(90deg,#38BDF8_0%,#1E90FF_100%)] peer-checked:text-white text-[#A2A2A2] rounded-md transition-all uppercase">{align}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-wrap justify-center gap-4 py-6 border-t border-[#F0F0F0]">
          <button type="button" onClick={() => addSection("banner")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all group shadow-sm">
            <ImageIcon size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Banner
          </button>
          <button type="button" onClick={() => addSection("text_block")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all group shadow-sm">
            <Type size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Text Block
          </button>
          <button type="button" onClick={() => addSection("image_text")} className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E2E2] rounded-xl text-xs font-bold text-[#003032] hover:border-[#FF7050] hover:text-[#FF7050] transition-all group shadow-sm">
            <Columns size={16} className="text-[#FF7050] group-hover:scale-110 transition-transform"/> + Split Section
          </button>
        </div>
      </div>

      <style jsx global>{`
        .ql-container.ql-snow { border: none !important; font-family: 'Poppins', sans-serif; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #EEEEEE !important; background: #fdfdfd; }
        .ql-editor { min-height: 150px; font-size: 14px; color: #4A4A4A; }
      `}</style>
    </div>
  );
};
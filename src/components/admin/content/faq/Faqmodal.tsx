// "use client";

// import React from "react";
// import { X } from "lucide-react";
// import { FAQ } from "@/services-api/faqService";

// export type FAQFormData = Omit<FAQ, "id" | "createdAt" | "updatedAt">;

// interface FaqModalProps {
//   isEditing: boolean;
//   formData: FAQFormData;
//   isSaving: boolean;
//   onChange: (data: FAQFormData) => void;
//   onClose: () => void;
//   onSave: () => void;
// }

// const FaqModal: React.FC<FaqModalProps> = ({
//   isEditing,
//   formData,
//   isSaving,
//   onChange,
//   onClose,
//   onSave,
// }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">
//         <div className="p-8 border-b flex justify-between items-center">
//           <h2 className="text-2xl font-black text-[#001B34] uppercase tracking-tight">
//             {isEditing ? "Update" : "Create"} FAQ
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
//           <div className="space-y-2">
//             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
//               The Question
//             </label>
//             <input
//               value={formData.question}
//               onChange={(e) =>
//                 onChange({ ...formData, question: e.target.value })
//               }
//               className="w-full bg-[#F8FAFC] border-transparent p-5 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
//               The Answer
//             </label>
//             <textarea
//               value={formData.answer}
//               onChange={(e) =>
//                 onChange({ ...formData, answer: e.target.value })
//               }
//               className="w-full bg-[#F8FAFC] border-transparent p-5 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 min-h-[140px] transition-all"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Priority Value
//               </label>
//               <input
//                 type="number"
//                 value={formData.priority}
//                 onChange={(e) =>
//                   onChange({
//                     ...formData,
//                     priority: parseInt(e.target.value) || 0,
//                   })
//                 }
//                 className="w-full bg-[#F8FAFC] p-5 rounded-3xl font-bold outline-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
//                 Status
//               </label>
//               <select
//                 value={formData.status}
//                 onChange={(e) =>
//                   onChange({
//                     ...formData,
//                     status: e.target.value as "active" | "draft",
//                   })
//                 }
//                 className="w-full bg-[#F8FAFC] p-5 rounded-3xl font-bold outline-none cursor-pointer"
//               >
//                 <option value="active">Active</option>
//                 <option value="draft">Draft</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="p-10 border-t flex gap-6 bg-slate-50/50">
//           <button
//             onClick={onClose}
//             className="flex-1 py-5 font-black text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSave}
//             disabled={isSaving}
//             className="flex-[2] py-5 bg-[#0C1425] text-white rounded-3xl font-black shadow-xl"
//           >
//             {isSaving ? "SAVING..." : "SAVE QUESTION"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaqModal;
"use client";

import React from "react";
import { X } from "lucide-react";
import { FAQ } from "@/services-api/faqService";

export type FAQFormData = Omit<FAQ, "id" | "createdAt" | "updatedAt">;

interface FaqModalProps {
  isEditing: boolean;
  formData: FAQFormData;
  isSaving: boolean;
  onChange: (data: FAQFormData) => void;
  onClose: () => void;
  onSave: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({
  isEditing,
  formData,
  isSaving,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[3rem] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
        {/* Close Button - Banner Style */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center space-y-6">
            {/* Header Text */}
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {isEditing ? "Update" : "Create"} FAQ
              </h2>
              <p className="text-[12px] text-slate-400">
                Manage your frequently asked questions.
              </p>
            </div>

            {/* Input Fields - Styled exactly like Banner modal */}
            <div className="w-full space-y-4 pt-4">
              <div className="space-y-1">
                <input
                  value={formData.question}
                  onChange={(e) =>
                    onChange({ ...formData, question: e.target.value })
                  }
                  placeholder="The Question"
                  className="w-full bg-[#F8F9FA] border-none px-6 py-4 rounded-2xl outline-none text-slate-600 placeholder:text-slate-400 text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    onChange({ ...formData, answer: e.target.value })
                  }
                  placeholder="The Answer"
                  rows={4}
                  className="w-full bg-[#F8F9FA] border-none px-6 py-4 rounded-2xl outline-none text-slate-600 placeholder:text-slate-400 text-sm font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      status: e.target.value as "active" | "draft",
                    })
                  }
                  className="w-full bg-[#F8F9FA] border-none px-6 py-4 rounded-2xl outline-none text-slate-500 text-sm font-bold cursor-pointer appearance-none"
                >
                  <option value="active">ACTIVE</option>
                  <option value="draft">DRAFT</option>
                </select>

                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      priority: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Priority"
                  className="w-full bg-[#F8F9FA] border-none px-6 py-4 rounded-2xl outline-none text-slate-600 text-sm font-medium"
                />
              </div>
            </div>

            {/* Save Button - Styled exactly like Banner modal */}
            <div className="w-full pt-4 flex justify-start">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-[#F1F3F5] hover:bg-[#e9ecef] text-slate-800 px-12 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer min-w-[140px]"
              >
                {isSaving ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;

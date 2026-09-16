// import { useFormContext } from "react-hook-form";
// import { SectionWrapper } from "./SectionWrapper";
// import { Label } from "./Label";
// import { Input } from "./Input";

// export default function SeoSection() {
//   const { register } = useFormContext();

//   return (
//     <SectionWrapper title="SEO Info">
//       <div className="space-y-4">
//         <div>
//           <Label>Meta Title</Label>
//           <Input
//             placeholder="Meta Title for search engines"
//             {...register("seoTitle")}
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Replaces default product title in search results and social shares.
//           </p>
//         </div>
//         <div>
//           <Label>Meta Tags (Keywords)</Label>
//           <Input
//             placeholder="e.g. fashion, shoes, summer sale (comma separated)"
//             {...register("seoKeywords")}
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Keywords used for search engine categorization.
//           </p>
//         </div>
//         <div>
//           <Label>Meta Description</Label>
//           <Input
//             placeholder="Short summary for Google search snippet"
//             {...register("seoDescription")}
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Brief summary displayed in search engine snippet previews.
//           </p>
//         </div>
//       </div>
//     </SectionWrapper>
//   );
// }




import { useFormContext, Controller } from "react-hook-form";
import { SectionWrapper } from "./SectionWrapper";
import { Label } from "./Label";
import { Input } from "./Input";
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

// Mini component for the tag UI
const TagInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const newTags = [...tags, input.trim()];
      onChange(newTags.join(", "));
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags.join(", "));
  };

  return (
    <div className="w-full">
      {/* Changed border-focus color to blue-500 */}
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white min-h-[42px] items-center focus-within:border-[linear-gradient(90deg,#38BDF8_0%,#1E90FF_100%)] transition-colors">
        {tags.map((tag, idx) => (
          // Changed background to blue-50 and text to blue-600
          <span key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-sm font-medium border border-blue-200">
            {tag}
            {/* Hover color changed to red for the X */}
            <X size={14} className="cursor-pointer hover:text-red-600" onClick={() => removeTag(idx)} />
          </span>
        ))}
        <input
          className="flex-1 outline-none text-sm px-2 bg-transparent"
          placeholder={tags.length === 0 ? "e.g. fashion, shoes..." : ""}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default function SeoSection() {
  const { register, control } = useFormContext();

  return (
    <SectionWrapper title="SEO Info">
      <div className="space-y-4">
        <div>
          <Label>Meta Title</Label>
          <Input
            placeholder="Meta Title for search engines"
            {...register("seoTitle")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Replaces default product title in search results and social shares.
          </p>
        </div>
        
        <div>
          <Label>Meta Tags (Keywords)</Label>
          <Controller
            name="seoKeywords"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value || ""} onChange={field.onChange} />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Keywords used for search engine categorization. Press Enter to add.
          </p>
        </div>

        <div>
          <Label>Meta Description</Label>
          <Input
            placeholder="Short summary for Google search snippet"
            {...register("seoDescription")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Brief summary displayed in search engine snippet previews.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
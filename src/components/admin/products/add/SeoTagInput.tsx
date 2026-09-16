import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SeoTagInput = ({ value, onChange }: Props) => {
  const [input, setInput] = useState("");
  // Split by comma and filter out empty strings
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange(newTags.join(", "));
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    onChange(newTags.join(", "));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white min-h-[46px] items-center focus-within:border-[#FF7050] transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-[#FF7050]/10 text-[#FF7050] px-2 py-1 rounded text-sm font-medium border border-[#FF7050]/20"
          >
            {tag}
            <X
              size={14}
              className="cursor-pointer hover:text-red-600 transition-colors"
              onClick={() => removeTag(tag)}
            />
          </span>
        ))}
        <input
          className="flex-1 outline-none text-sm px-2 min-w-[120px] bg-transparent"
          placeholder={tags.length === 0 ? "e.g. fashion, polo, summer..." : ""}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Type a keyword and press <b>Enter</b> to add.
      </p>
    </div>
  );
};

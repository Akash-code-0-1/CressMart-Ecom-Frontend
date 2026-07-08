import {
  AlignLeft,
  Bold,
  ChevronDown,
  Code,
  Italic,
  ItalicIcon,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Smile,
  Type,
  Underline,
} from "lucide-react";
import { Input } from "./Input";
import { Label } from "./Label";
import { Toggle } from "./Toggle";
import { SectionWrapper } from "./SectionWrapper";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";

export default function GeneralInfo() {
  return (
    <SectionWrapper title="General Information">
      <div title="General Information">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <Label required>Item Name</Label>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base font-normal text-black">
                  Auto Slug
                </span>
                <Toggle checked={false} />
              </div>
            </div>
            <Input placeholder="Ex: Samsung Galaxy S23 Ultra" />
          </div>

          <div>
            <Label required>Media</Label>
            <div className="bg-[#F9F9F9] rounded-[8px] py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <IamgeIcon color="#A2A2A2" size="76" />
              </div>
              <p className="text-base text-[#A2A2A2] mb-1 font-normal">
                Drag and drop image here, or click add image.
              </p>
              <p className="text-xs text-[#A2A2A2] mb-5 max-w-[320px] px-4">
                Supported formats: JPG, PNG, Max size: 4MB. Note: Use images
                with a 1:1.6 aspect ratio (855x1386 pixels.)
              </p>
              <button className="bg-[#F7931E] text-white px-4 py-3 rounded-[8px] text-sm font-semibold">
                Add Image
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                className="w-full bg-[#F9F9F9] rounded-[8px] pl-12 pr-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2]"
                placeholder="Past YouTube Video Link (Optional)"
              />
            </div>
          </div>

          <div>
            <Label>Short Description</Label>
            <textarea
              className="w-full bg-[#F9FAFB] rounded-[8px] px-4 py-3 text-sm min-h-[88px] outline-none placeholder:[#A2A2A2]"
              placeholder="Ex: Short Description"
            />
          </div>

          <div>
            <Label required>Product Description</Label>
            <div className="bg-[#F9FAFB] rounded-[8px] overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-3 border-b border-white">
                <div className="flex items-center text-xs font-bold text-[#4F4D4D] cursor-pointer">
                  Normal <ChevronDown size={14} className="ml-1" />
                </div>
                <Bold size={16} className="text-[#4F4D4D]" />{" "}
                <Italic size={16} className="text-[#4F4D4D]" />{" "}
                <Underline size={16} className="text-[#4F4D4D]" />
                {/* <div className="h-4 w-[1px] bg-[#4F4D4D] mx-1" /> */}
                <Quote size={16} className="text-[#4F4D4D]" />{" "}
                <Type size={16} className="text-[#4F4D4D]" />
                {/* <div className="h-4 w-[1px] bg-gray-200 mx-1" /> */}
                <AlignLeft size={16} className="text-[#4F4D4D]" />{" "}
                <List size={16} className="text-[#4F4D4D]" />{" "}
                <ListOrdered size={16} className="text-[#4F4D4D]" />
                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                <Code size={16} className="text-gray-400" />{" "}
                <Smile size={16} className="text-[#4F4D4D]" />{" "}
                <LinkIcon size={16} className="text-[#4F4D4D]" />
              </div>
              <textarea
                className="w-full bg-transparent p-4 min-h-[140px] outline-none text-sm text-gray-600"
                placeholder="Ex: Description"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

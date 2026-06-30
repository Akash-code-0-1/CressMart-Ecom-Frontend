import { Label } from "./Label";
import { SectionWrapper } from "./SectionWrapper";
import { Toggle } from "./Toggle";
import { Input } from "./Input";
import { Plus } from "lucide-react";
import IamgeIcon from "@/components/store-front/svg/svg/IamgeIcon";
import PrimaryButton from "../../common/PrimaryButton";
import PluseIcon from "@/components/store-front/svg/svg/PluseIcon";
import SeconderyButton from "../../common/SeconderyButton";
import CloseIcon from "@/components/store-front/svg/svg/CloseIcon";

export default function ProductVariant() {
  return (
    <SectionWrapper
      title="Product Variants"
      description="You can add multiple variant for a single product here. Like Size, Color, and Weight etc."
    >
      <div className="bg-white border border-[#38BDF8] rounded-[16px] px-4 py-6 mb-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-xl font-medium text-black">
              Make this variant mandatory
            </h4>
            <p className="text-[12px] text-[#A2A2A2]">
              Toggle this on if you want your customer to select at least one of
              the variant options
            </p>
          </div>
          <Toggle checked={false} sideLabel="[No]" />
        </div>
        <div className="mb-4">
          <Label>Title</Label>
          <Input placeholder="Enter the name of variant (e.g., Colour, Size, Material)" />
        </div>
        <div className="flex gap-2 items-end">
          <div className="w-[67px] h-[67px] bg-[#F9F9F9] rounded-[8px] flex items-center justify-center shrink-0 mb-1">
            <IamgeIcon color="#A2A2A2" size="60" />
          </div>
          <div className="flex-1">
            <Label>Attribute</Label>
            <Input placeholder="Enter variant Option (e.g., Red, Large, Cotton)" />
          </div>
          <div className="flex-1">
            <Label>Extra Price</Label>
            <Input placeholder="Enter Extra price for this option" />
          </div>
          <button className=" cursor-pointer bg-[#FEF5F5] p-2.5 text-red-400 hover:bg-red-50 rounded-[8px] transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="mt-4">
          <PrimaryButton label="Add More Option" icon={<PluseIcon />} />
        </div>
      </div>
      <SeconderyButton
        label="Add a new variant"
        icon={
          <Plus
            size={21}
            strokeWidth={1.5}
            color="black"
            className="border border-w-[1.5px] rounded-full"
          />
        }
      />
    </SectionWrapper>
  );
}

import { useFormContext } from "react-hook-form";
import { SectionWrapper } from "./SectionWrapper";
import { Label } from "./Label";
import { Input } from "./Input";

export default function SeoSection() {
  const { register } = useFormContext();

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
          <Input
            placeholder="e.g. fashion, shoes, summer sale (comma separated)"
            {...register("seoKeywords")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Keywords used for search engine categorization.
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


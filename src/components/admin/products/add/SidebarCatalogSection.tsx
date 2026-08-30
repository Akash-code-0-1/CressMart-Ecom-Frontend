// import { useQuery } from "@tanstack/react-query";
// import { useFormContext } from "react-hook-form";
// import { apiFetch } from "@/utils/api";
// import { ChevronDown } from "lucide-react";
// import React from "react";
// import { Label } from "./Label";

// export default function SidebarCatalogSection() {
//   const { setValue, watch } = useFormContext();
//   const activeCatId = watch("category_id");

//   const { data: treeResponse, isLoading } = useQuery({
//     queryKey: ["categories-nested-tree-upload"],
//     queryFn: async () => {
//       const res = await apiFetch("/categories/tree");
//       if (!res.ok) throw new Error("Tree serialization error");
//       return res.json();
//     },
//   });

//   const unwindTree = (nodes: any[], level = 0) => {
//     if (!Array.isArray(nodes)) return null;
//     return nodes.map((node) => (
//       <React.Fragment key={node.id}>
//         <option value={node.id}>
//           {"\u00A0\u00A0".repeat(level) + (level > 0 ? "├─ " : "") + node.name}
//         </option>
//         {node.children &&
//           node.children.length > 0 &&
//           unwindTree(node.children, level + 1)}
//       </React.Fragment>
//     ));
//   };

//   const parsedTreeNodes = (() => {
//     if (!treeResponse) return [];
//     if (Array.isArray(treeResponse)) return treeResponse;
//     if (treeResponse.data && Array.isArray(treeResponse.data))
//       return treeResponse.data;
//     if (treeResponse.data?.data && Array.isArray(treeResponse.data.data))
//       return treeResponse.data.data;
//     return [];
//   })();

//   return (
//     <div className="bg-white rounded-[8px] p-5 border border-gray-100 shadow-xs">
//       <h3 className="text-black font-medium text-base mb-4">
//         Catalog Selection
//       </h3>
//       <Label required>System Category Tree</Label>
//       <div className="relative w-full">
//         <select
//           value={activeCatId || ""}
//           onChange={(e) => setValue("category_id", e.target.value)}
//           className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 px-4 py-3 text-xs rounded-[8px] outline-none appearance-none cursor-pointer focus:bg-white"
//         >
//           <option value="">
//             {isLoading
//               ? "Synchronizing tree schemas..."
//               : "Select Category Node*"}
//           </option>
//           {parsedTreeNodes.length > 0 && unwindTree(parsedTreeNodes)}
//         </select>
//         <ChevronDown
//           size={14}
//           className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//         />
//       </div>
//     </div>
//   );
// }

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { apiFetch } from "@/utils/api";
import { useMemo, useEffect } from "react";

interface CategoryNode {
  id: string | number;
  name: string;
  children?: CategoryNode[];
}

// Custom dropdown chevron icon (matches design)
function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
    >
      <path
        d="M0.394621 2.28L3.84795 5.73333C3.97131 5.85694 4.11782 5.955 4.27912 6.02191C4.44042 6.08882 4.61333 6.12326 4.78795 6.12326C4.96258 6.12326 5.13549 6.08882 5.29679 6.02191C5.45809 5.955 5.6046 5.85694 5.72795 5.73333L9.18129 2.28C10.008 1.44 9.42129 0 8.23462 0H1.34129C0.141288 0 -0.445378 1.44 0.394621 2.28Z"
        fill="#969696"
      />
    </svg>
  );
}

// Reusable styled select, matches the image design
function CatalogSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: CategoryNode[];
}) {
  return (
    <div className="mb-4">
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F9F9F9] text-gray-800 px-3 py-4 text-sm rounded-[8px] outline-none appearance-none cursor-pointer focus:bg-white"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>
    </div>
  );
}

export default function SidebarCatalogSection() {
  const { setValue, watch } = useFormContext();

  const activeCatId = watch("category_id");
  const rootCatId = watch("root_category_id");
  const subCatId = watch("sub_category_id");
  const childCatId = watch("child_category_id");

  const { data: treeResponse, isLoading } = useQuery({
    queryKey: ["categories-nested-tree-upload"],
    queryFn: async () => {
      const res = await apiFetch("/categories/tree?limit=200");
      if (!res.ok) throw new Error("Tree serialization error");
      return res.json();
    },
  });

  const rootNodes: CategoryNode[] = useMemo(() => {
    if (!treeResponse) return [];
    if (Array.isArray(treeResponse)) return treeResponse;
    if (treeResponse.data && Array.isArray(treeResponse.data))
      return treeResponse.data;
    if (treeResponse.data?.data && Array.isArray(treeResponse.data.data))
      return treeResponse.data.data;
    return [];
  }, [treeResponse]);

  // Pre-fill root/sub/child dropdowns when editing an existing product (activeCatId is set)
  useEffect(() => {
    if (!activeCatId || rootNodes.length === 0 || rootCatId) return;

    for (const root of rootNodes) {
      if (String(root.id) === String(activeCatId)) {
        setValue("root_category_id", String(root.id));
        return;
      }
      if (root.children) {
        for (const sub of root.children) {
          if (String(sub.id) === String(activeCatId)) {
            setValue("root_category_id", String(root.id));
            setValue("sub_category_id", String(sub.id));
            return;
          }
          if (sub.children) {
            for (const child of sub.children) {
              if (String(child.id) === String(activeCatId)) {
                setValue("root_category_id", String(root.id));
                setValue("sub_category_id", String(sub.id));
                setValue("child_category_id", String(child.id));
                return;
              }
            }
          }
        }
      }
    }
  }, [activeCatId, rootNodes, rootCatId, setValue]);

  // Level 2: children of selected root category
  const subCategoryNodes: CategoryNode[] = useMemo(() => {
    const selected = rootNodes.find((n) => String(n.id) === String(rootCatId));
    return selected?.children ?? [];
  }, [rootNodes, rootCatId]);

  // Level 3: children of selected sub category
  const childCategoryNodes: CategoryNode[] = useMemo(() => {
    const selected = subCategoryNodes.find(
      (n) => String(n.id) === String(subCatId),
    );
    return selected?.children ?? [];
  }, [subCategoryNodes, subCatId]);

  const handleCategoryChange = (val: string) => {
    setValue("root_category_id", val);
    setValue("sub_category_id", "");
    setValue("child_category_id", "");
    setValue("category_id", val);
  };

  const handleSubCategoryChange = (val: string) => {
    setValue("sub_category_id", val);
    setValue("child_category_id", "");
    setValue("category_id", val || rootCatId);
  };

  const handleChildCategoryChange = (val: string) => {
    setValue("child_category_id", val);
    setValue("category_id", val || subCatId || rootCatId);
  };

  return (
    <div className="bg-white rounded-lg p-5">
      <h3 className="text-black font-medium text-lg mb-4">Catalog</h3>

      <CatalogSelect
        value={rootCatId || ""}
        onChange={handleCategoryChange}
        placeholder={isLoading ? "Loading..." : "Select Category*"}
        options={rootNodes}
      />

      {/* Sub Category shows only after Category is selected and has sub-categories */}
      {rootCatId && subCategoryNodes.length > 0 && (
        <CatalogSelect
          value={subCatId || ""}
          onChange={handleSubCategoryChange}
          placeholder="Select Sub Category*"
          options={subCategoryNodes}
        />
      )}

      {/* Child Category shows only after Sub Category is selected and has child-categories */}
      {rootCatId && subCatId && childCategoryNodes.length > 0 && (
        <CatalogSelect
          value={childCatId || ""}
          onChange={handleChildCategoryChange}
          placeholder="Select Child Category*"
          options={childCategoryNodes}
        />
      )}
    </div>
  );
}

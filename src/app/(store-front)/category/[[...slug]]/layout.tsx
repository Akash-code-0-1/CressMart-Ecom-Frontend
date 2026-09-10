// import { getCategory } from "@/services-api/categoryService";
// import { Metadata } from "next";

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug?: string[] | string };
// }): Promise<Metadata> {
//   const slugParam = params?.slug;
//   const targetCategorySlug = Array.isArray(slugParam)
//     ? slugParam[slugParam.length - 1]
//     : slugParam || "";

//   if (!targetCategorySlug) {
//     return {
//       title: "All Products - Store Catalog",
//       description: "Explore our collection of products.",
//     };
//   }

//   try {
//     const category = await getCategory(targetCategorySlug);
//     return {
//       title: category?.meta_title || category?.name || "Category Catalog",
//       description:
//         category?.meta_description ||
//         category?.description ||
//         `Explore products in ${category?.name || "catalog"}`,
//       keywords: category?.meta_tags || category?.name || "",
//     };
//   } catch {
//     return {
//       title: "Category Catalog",
//       description: "Browse products by category.",
//     };
//   }
// }

// export default function CategoryLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <section>
//       <main>{children}</main>
//     </section>
//   );
// }



import { getCategory } from "@/services-api/categoryService";
import { Metadata } from "next";

// 1. Update the type to accept a Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] | string }>;
}): Promise<Metadata> {
  // 2. Await the params
  const resolvedParams = await params;
  
  // 3. Access the slug from the resolved params
  const slugParam = resolvedParams?.slug;
  
  const targetCategorySlug = Array.isArray(slugParam)
    ? slugParam[slugParam.length - 1]
    : slugParam || "";

  if (!targetCategorySlug) {
    return {
      title: "All Products - Store Catalog",
      description: "Explore our collection of products.",
    };
  }

  try {
    const category = await getCategory(targetCategorySlug);
    return {
      title: category?.meta_title || category?.name || "Category Catalog",
      description:
        category?.meta_description ||
        category?.description ||
        `Explore products in ${category?.name || "catalog"}`,
      keywords: category?.meta_tags || category?.name || "",
    };
  } catch {
    return {
      title: "Category Catalog",
      description: "Browse products by category.",
    };
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <main>{children}</main>
    </section>
  );
}
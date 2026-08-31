import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProductBySlug } from "@/services-api/productService";
import ProductDetailContent from "../ProductDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.startsWith("mohasagor-")) {
    return {
      title: "Product Details",
    };
  }

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return { title: "Product Not Found" };
    }

    const title = product.meta_title || product.name || "Product Details";
    const description =
      product.meta_description ||
      product.short_description ||
      product.description ||
      "Check out this product on our store.";

    const images = Array.isArray(product.images)
      ? product.images.map((img: string | { url?: string }) =>
          typeof img === "string" ? img : img.url || "",
        ).filter(Boolean)
      : [];

    const keywords = product.meta_tags
      ? product.meta_tags.split(",").map((k: string) => k.trim())
      : undefined;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: images.length > 0 ? images : undefined,
      },
    };
  } catch {
    return {
      title: "Product Details",
    };
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Skip server-side prefetch for Mohasagor products —
  // they are fetched directly from Mohasagor API on the client side.
  if (!slug.startsWith("mohasagor-")) {
    await queryClient.prefetchQuery({
      queryKey: ["product", slug],
      queryFn: () => getProductBySlug(slug),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailContent slug={slug} />
    </HydrationBoundary>
  );
}


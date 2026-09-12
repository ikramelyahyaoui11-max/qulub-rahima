import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ProductDetail from "@/components/ProductDetail";
import OtherOffers from "@/components/OtherOffers";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/product/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} | القلوب الرحيمة`,
    description: product.description,
  };
}

export default async function ProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="bg-brand-cream-100">
        <ProductDetail product={product} />
        <OtherOffers products={products} excludeId={product.id} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

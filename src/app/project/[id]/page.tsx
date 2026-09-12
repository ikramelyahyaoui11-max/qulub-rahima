import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import ProjectDetail from "@/components/ProjectDetail";
import OtherOffers from "@/components/OtherOffers";
import { getOtherProjects, getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/project/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const projects = await getOtherProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.name} | القلوب الرحيمة`,
    description: project.description,
  };
}

export default async function ProjectPage(props: PageProps<"/project/[id]">) {
  const { id } = await props.params;
  const projects = await getOtherProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="bg-brand-cream-100">
        <ProjectDetail project={project} />
        <OtherOffers products={products} excludeId={project.id} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

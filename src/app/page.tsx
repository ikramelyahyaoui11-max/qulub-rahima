import Header from "@/components/Header";
import PromoBar from "@/components/PromoBar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Journey from "@/components/Journey";
import ProofOfImpact from "@/components/ProofOfImpact";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <PromoBar />
      <main>
        <Hero />
        <Products products={products} />
        <Journey />
        <ProofOfImpact />
        <Services />
        <Stats />
        <WhyUs />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

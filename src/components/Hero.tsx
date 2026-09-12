import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { BRAND, HERO_CATEGORIES } from "@/lib/data";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-cream-100">
      <div className="pattern-motif absolute inset-0 opacity-25" />
      <div className="animate-float-slow absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-gold-400/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-green-700/12 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="order-2 lg:order-1">
          <HeroCarousel />
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-right">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-brand-green-900 sm:text-5xl lg:text-[3.4rem]">
            احجزوا أضحيتكم بثقة...
            <br />
            <span className="text-brand-gold-600">ونحن ننوب عنكم</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-brand-green-900/70 lg:mr-0">
            نتولى شراء الذبيحة وذبحها ونوزيعها على الفقراء والمحتاجين في أفريقيا، ونوثق لكم
            كل خطوة بالصور والفيديو حتى نصلكم مطمئنين.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-end">
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-6 py-3 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل عبر واتساب
            </a>
            <a href="#products" className="btn-primary px-8 py-3 text-sm">
              احجز الآن
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-end">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-green-900/70">
              <ShieldCheck className="h-4 w-4 text-brand-green-700" />
              ننوب عنكم في:
            </span>
            {HERO_CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-brand-green-800 text-white shadow-sm"
                    : "border border-brand-green-800/15 bg-white/80 text-brand-green-900"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

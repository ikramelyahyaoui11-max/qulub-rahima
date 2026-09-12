import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-brand-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow">Testimonials</span>
        <h2 className="mt-3 text-3xl font-extrabold text-brand-green-900 sm:text-4xl">
          آراء العملاء
        </h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mt-4 text-brand-green-900/70">الثقة مستمرة بوجودكم</p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-right sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card-elevate relative flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <Quote className="absolute left-5 top-5 h-8 w-8 text-brand-gold-500/15" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-gold-500 text-brand-gold-500" />
                ))}
              </div>
              <p className="relative text-sm leading-7 text-brand-green-900/80">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-black/5 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-sm font-bold text-white shadow-sm">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm font-bold text-brand-green-900">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { ComponentType } from "react";
import { Scroll, HeartHandshake, Baby, Beef } from "lucide-react";
import { SERVICES } from "@/lib/data";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  scroll: Scroll,
  hands: HeartHandshake,
  baby: Baby,
  sheep: Beef,
};

export default function Services() {
  return (
    <section id="services" className="bg-brand-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow">Our Services</span>
        <h2 className="mt-3 text-3xl font-extrabold text-brand-green-900 sm:text-4xl">خدماتنا</h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mx-auto mt-4 max-w-2xl text-brand-green-900/70">
          اختر نوع المناسبة ومستوى التنفيذ والتوثيق
        </p>

        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <div
                key={service.id}
                className="card-elevate flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-8 shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green-700 to-brand-green-900 text-white shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-base font-extrabold text-brand-green-900">{service.name}</p>
                <p className="text-xs text-brand-green-900/60">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

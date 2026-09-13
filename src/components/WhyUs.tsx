import type { ComponentType } from "react";
import { Globe2, Zap, Video, ShieldCheck } from "lucide-react";
import { WHY_US } from "@/lib/data";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  globe: Globe2,
  zap: Zap,
  video: Video,
  shield: ShieldCheck,
};

export default function WhyUs() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow">Why Us</span>
        <h2 className="mt-3 text-3xl font-extrabold text-brand-green-900 sm:text-4xl">
          مميزات المؤسسة
        </h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />

        <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-6">
          {WHY_US.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.title}
                className="card-elevate flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-center sm:gap-3 sm:px-4 sm:py-6"
              >
                <span className="ring-brand-gold-500/20 flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold-500/15 text-brand-gold-600 ring-2 sm:h-14 sm:w-14 sm:ring-4">
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <p className="text-[11px] font-extrabold leading-tight text-brand-green-900 sm:text-base">
                  {item.title}
                </p>
                <p className="hidden text-sm leading-6 text-brand-green-900/60 sm:block">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

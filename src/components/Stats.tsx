import type { ComponentType } from "react";
import { Smile, Globe2, Users, CheckCircle2 } from "lucide-react";
import { STATS } from "@/lib/data";

const ICONS: ComponentType<{ className?: string }>[] = [Smile, Globe2, Users, CheckCircle2];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-brand-green-900 py-16">
      <div className="pattern-motif-dark absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-eyebrow bg-white/10 text-white">Our Impact</span>
          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
            إحصائيات المؤسسة
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={stat.label}
                className="card-elevate rounded-2xl border border-white/10 bg-white/5 py-8 text-center backdrop-blur-sm"
              >
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-500/20 text-brand-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

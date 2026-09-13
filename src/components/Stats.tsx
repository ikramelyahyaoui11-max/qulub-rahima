"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Smile, Globe2, Users, CheckCircle2 } from "lucide-react";
import { STATS } from "@/lib/data";

const ICONS: ComponentType<{ className?: string }>[] = [Smile, Globe2, Users, CheckCircle2];
const DURATION_MS = 1600;

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

function StatCard({
  stat,
  Icon,
  start,
}: {
  stat: (typeof STATS)[number];
  Icon: ComponentType<{ className?: string }>;
  start: boolean;
}) {
  const count = useCountUp(stat.value, start);

  return (
    <div className="card-elevate rounded-2xl border border-white/10 bg-white/5 py-8 text-center backdrop-blur-sm">
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-500/20 text-brand-gold-400">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-3xl font-extrabold text-white">
        {count.toLocaleString("en-US")}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-white/70">{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-green-900 py-16">
      <div className="pattern-motif-dark absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-eyebrow bg-white/10 text-white">Our Impact</span>
          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
            إحصائيات المؤسسة
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} Icon={ICONS[i]} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

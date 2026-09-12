"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { type OtherProject } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { usePrice } from "@/lib/currency";

const CATEGORY_STYLES: Record<string, string> = {
  "يبقى الأثر": "from-brand-gold-400 to-brand-gold-600",
  "صدقة جارية": "from-brand-green-700 to-brand-green-900",
  "مشروع رزق": "from-brand-green-600 to-brand-gold-600",
};

function ProjectCard({ project }: { project: OtherProject }) {
  const { addItem } = useCart();
  const price = usePrice(project.price);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const gradient = CATEGORY_STYLES[project.category] ?? "from-brand-gold-400 to-brand-green-700";

  const stopAndRun = (fn: () => void) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const handleAddToCart = () => {
    addItem({
      id: `project|${project.id}|`,
      kind: "project",
      refId: project.id,
      name: project.name,
      photo: project.photo ?? "/logo-mark.png",
      price: project.price,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/project/${project.id}`}
      className="card-elevate flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white text-right shadow-sm"
    >
      <div
        className={`relative flex h-36 items-center justify-center overflow-hidden ${
          project.photo ? "bg-white" : `bg-gradient-to-br ${gradient}`
        }`}
      >
        {project.photo ? (
          <Image src={project.photo} alt={project.name} fill sizes="320px" className="object-cover" />
        ) : (
          <>
            <div className="pattern-motif absolute inset-0 opacity-30" />
            <div className="opacity-25 brightness-0 invert">
              <Image src="/logo-mark.png" alt="" width={56} height={56} />
            </div>
          </>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-green-800 shadow-sm">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-extrabold text-brand-green-900">{project.name}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-5 text-brand-green-900/70">
          {project.description}
        </p>

        <p className="mt-3 text-lg font-extrabold text-brand-green-900">
          {price.amount}
          <span className="mr-1 text-sm font-medium text-brand-green-900/60">
            {price.symbol}
          </span>
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-black/10 px-2 py-1">
            <button
              type="button"
              onClick={stopAndRun(() => setQty((q) => q + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={stopAndRun(() => setQty((q) => Math.max(1, q - 1)))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
              aria-label="إنقاص الكمية"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={stopAndRun(handleAddToCart)}
          className={`btn-primary mt-3 py-2.5 text-sm ${added ? "!bg-brand-green-700" : ""}`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              تمت الإضافة
            </>
          ) : (
            <>
              <ShoppingBasket className="h-4 w-4" />
              أضف للسلة
            </>
          )}
        </button>
      </div>
    </Link>
  );
}

export default function OtherProjects({ projects }: { projects: OtherProject[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="other-projects" className="relative overflow-hidden bg-brand-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow">Other Projects</span>
        <h2 className="mt-3 text-3xl font-extrabold text-brand-green-900 sm:text-4xl">
          أبواب القلوب الرحيمة الأخرى
        </h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mx-auto mt-4 max-w-2xl text-brand-green-900/70">
          صدقات جارية ومشاريع تنموية نُنفذها مؤسسة القلوب الرحيمة لخدمة الأسر المحتاجة
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-right sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

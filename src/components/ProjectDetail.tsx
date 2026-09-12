"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { DELIVERY_NOTE, type OtherProject } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { usePrice } from "@/lib/currency";

const CATEGORY_STYLES: Record<string, string> = {
  "يبقى الأثر": "from-brand-gold-400 to-brand-gold-600",
  "صدقة جارية": "from-brand-green-700 to-brand-green-900",
  "مشروع رزق": "from-brand-green-600 to-brand-gold-600",
};

export default function ProjectDetail({ project }: { project: OtherProject }) {
  const { addItem, closeCart } = useCart();
  const price = usePrice(project.price);
  const router = useRouter();
  const [dedicationName, setDedicationName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const gradient = CATEGORY_STYLES[project.category] ?? "from-brand-gold-400 to-brand-green-700";

  const buildCartItem = () => {
    const name = dedicationName.trim();
    const cartId = ["project", project.id, name].join("|");
    return {
      id: cartId,
      kind: "project" as const,
      refId: project.id,
      name: project.name,
      photo: project.photo ?? "/logo-mark.png",
      price: project.price,
      quantity,
      dedicationName: name || undefined,
    };
  };

  const handleAddToCart = () => {
    addItem(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickBook = () => {
    addItem(buildCartItem());
    closeCart();
    router.push("/booking");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/#other-projects"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-brand-green-800 shadow-sm transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-600"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع للمشروعات
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="order-2 text-right lg:order-1">
          <span className="section-eyebrow">{project.category}</span>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-green-900">{project.name}</h1>
          <p className="mt-3 text-brand-green-900/70">{project.description}</p>
          <p className="mt-4 text-2xl font-extrabold text-brand-green-900">
            {price.amount}
            <span className="mr-1 text-sm font-medium text-brand-green-900/60">
              {price.symbol}
            </span>
          </p>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-bold text-brand-green-900">الاسم عند التوثيق (اختياري)</span>
              <input
                type="text"
                value={dedicationName}
                onChange={(e) => setDedicationName(e.target.value)}
                placeholder="مثال: باسم أسرة فلان"
                className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none transition-colors placeholder:text-brand-green-900/40 focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
              />
            </label>

            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-bold text-brand-green-900">التسليم</span>
              <p className="rounded-lg bg-brand-cream-100 px-3 py-2 text-brand-green-900/70">
                {DELIVERY_NOTE}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`btn-primary flex-1 py-3 text-sm transition-colors ${
                  added ? "!bg-brand-green-700" : ""
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    تمت الإضافة للسلة
                  </>
                ) : (
                  <>
                    <ShoppingBasket className="h-4 w-4" />
                    أضف للسلة
                  </>
                )}
              </button>
              <div className="flex items-center gap-3 rounded-full border border-black/10 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickBook}
              className="text-center text-xs font-semibold text-brand-green-800/70 underline-offset-2 hover:text-brand-gold-600 hover:underline"
            >
              أو تابع الحجز مباشرة لهذا المشروع فقط
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div
            className={`shadow-brand relative mx-auto flex h-80 max-w-md items-center justify-center overflow-hidden rounded-[2rem] ${
              project.photo ? "bg-white" : `bg-gradient-to-br ${gradient}`
            } ring-4 ring-white sm:h-96`}
          >
            {project.photo ? (
              <Image src={project.photo} alt={project.name} fill sizes="(min-width: 1024px) 448px, 90vw" className="object-cover" />
            ) : (
              <>
                <div className="pattern-motif absolute inset-0 opacity-30" />
                <div className="opacity-25 brightness-0 invert">
                  <Image src="/logo-mark.png" alt="" width={140} height={140} />
                </div>
              </>
            )}
            <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-green-800 shadow-sm">
              {project.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Minus, Plus, ShoppingBasket, Star } from "lucide-react";
import {
  ADDON_OPTIONS,
  DELIVERY_NOTE,
  INTENTIONS,
  getProductPrice,
  type Product,
} from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, closeCart } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();
  const [addon, setAddon] = useState(ADDON_OPTIONS[0]);
  const [intention, setIntention] = useState(product.defaultIntention);
  const [dedicationName, setDedicationName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = getProductPrice(product, addon, currency.code.toLowerCase() as "egp" | "usd" | "sar");

  const buildCartItem = () => {
    const name = dedicationName.trim();
    const cartId = ["product", product.id, addon, intention, name].join("|");
    return {
      id: cartId,
      kind: "product" as const,
      refId: product.id,
      name: product.name,
      photo: product.photo,
      price: getProductPrice(product, addon, "egp"),
      quantity,
      addon,
      intention,
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
        href="/#products"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-brand-green-800 shadow-sm transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-600"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع للمنتجات
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="order-2 text-right lg:order-1">
          <span className="section-eyebrow">{product.tag}</span>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-green-900">{product.name}</h1>
          <div className="mt-2 flex justify-end gap-1">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-brand-gold-500 text-brand-gold-500" />
            ))}
          </div>
          <p className="mt-3 text-brand-green-900/70">{product.description}</p>
          <p className="mt-4 text-2xl font-extrabold text-brand-green-900">
            {price.toLocaleString("en-US")}
            <span className="mr-1 text-sm font-medium text-brand-green-900/60">
              {currency.symbol}
            </span>
          </p>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-bold text-brand-green-900">إضافات على الطلب</span>
              <select
                value={addon}
                onChange={(e) => setAddon(e.target.value)}
                className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
              >
                {ADDON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-bold text-brand-green-900">النية</span>
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
              >
                {INTENTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-bold text-brand-green-900">الاسم عند التوثيق</span>
              <input
                type="text"
                value={dedicationName}
                onChange={(e) => setDedicationName(e.target.value)}
                placeholder="مثال: خالد بن فهد و والديه"
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
              أو تابع الحجز مباشرة لهذا المنتج فقط
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="shadow-brand relative mx-auto h-80 max-w-md overflow-hidden rounded-[2rem] bg-white ring-4 ring-white sm:h-96">
            <Image
              src={product.photo}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 448px, 90vw"
              className={product.hasPosterPhoto ? "object-contain" : "object-cover"}
            />
            {!product.hasPosterPhoto && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/70 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-green-800 shadow-sm">
                  {product.badge}
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-brand-gold-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {product.tag}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

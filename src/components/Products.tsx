"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBasket, Star, Users } from "lucide-react";
import { ADDON_OPTIONS, getProductPrice, type Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const price = getProductPrice(product, ADDON_OPTIONS[0], currency.code.toLowerCase() as "egp" | "usd" | "sar");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const stopAndRun = (fn: () => void) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const handleAddToCart = () => {
    addItem({
      id: `product|${product.id}|${ADDON_OPTIONS[0]}|${product.defaultIntention}|`,
      kind: "product",
      refId: product.id,
      name: product.name,
      photo: product.photo,
      price: getProductPrice(product, ADDON_OPTIONS[0], "egp"),
      quantity: qty,
      addon: ADDON_OPTIONS[0],
      intention: product.defaultIntention,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-elevate group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-right shadow-[0_2px_10px_-4px_rgba(11,31,22,0.12)]"
    >
      <div className="h-1 w-full bg-gradient-to-l from-brand-gold-400 via-brand-gold-500 to-brand-gold-600" />
      <div
        className={`relative overflow-hidden ${
          product.hasPosterPhoto ? "aspect-square bg-brand-cream-100 p-4" : "h-56 bg-brand-cream-100"
        }`}
      >
        <Image
          src={product.photo}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className={`transition-transform duration-500 group-hover:scale-105 ${
            product.hasPosterPhoto ? "object-contain" : "object-cover"
          }`}
        />
        {!product.hasPosterPhoto && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/85 via-brand-green-950/10 to-transparent" />
            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-green-800 shadow-sm">
              {product.badge}
            </span>
            <span className="absolute left-3 top-3 rounded-full bg-brand-gold-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {product.tag}
            </span>
            <p className="absolute bottom-3 right-3 text-lg font-extrabold text-white drop-shadow">
              {product.name}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.hasPosterPhoto && (
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-brand-green-900">{product.name}</h3>
            <span className="shrink-0 rounded-full bg-brand-gold-500/12 px-2.5 py-1 text-[11px] font-bold text-brand-gold-600">
              {product.tag}
            </span>
          </div>
        )}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-brand-green-900/70">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-brand-green-800/80">
          <Users className="h-4 w-4" />
          <span>{product.beneficiaries}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: product.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-brand-gold-500 text-brand-gold-500" />
            ))}
          </div>
          <p className="text-lg font-extrabold text-brand-gold-600">
            {price.toLocaleString("en-US")}
            <span className="mr-1 text-xs font-medium text-brand-green-900/60">
              {currency.symbol}
            </span>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-black/10 px-3 py-1.5">
            <button
              type="button"
              onClick={stopAndRun(() => setQty((q) => q + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{qty}</span>
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
          className={`btn-primary mt-3 w-full py-2.5 text-sm ${added ? "!bg-brand-green-700" : ""}`}
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

export default function Products({ products }: { products: Product[] }) {
  return (
    <section id="products" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="section-eyebrow">Packages</span>
        <h2 className="mt-3 text-3xl font-extrabold text-brand-green-900 sm:text-4xl">المنتجات</h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mx-auto mt-4 max-w-2xl text-brand-green-900/70">
          باقات بأسعار جاهزة وواضحة، وكل باقة نشمل التوثيق الكامل بالصور والفيديو
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

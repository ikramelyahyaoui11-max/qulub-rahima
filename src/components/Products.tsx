"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBasket, Users } from "lucide-react";
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
          product.hasPosterPhoto ? "aspect-square bg-brand-cream-100 p-2 sm:p-4" : "h-32 bg-brand-cream-100 sm:h-56"
        }`}
      >
        <Image
          src={product.photo}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 380px, 45vw"
          className={`transition-transform duration-500 group-hover:scale-105 ${
            product.hasPosterPhoto ? "object-contain" : "object-cover"
          }`}
        />
        {!product.hasPosterPhoto && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/85 via-brand-green-950/10 to-transparent" />
            <span className="absolute right-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-green-800 shadow-sm sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
              {product.badge}
            </span>
            <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-gold-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
              {product.tag}
            </span>
            <p className="absolute bottom-1.5 right-1.5 text-sm font-extrabold text-white drop-shadow sm:bottom-3 sm:right-3 sm:text-lg">
              {product.name}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {product.hasPosterPhoto && (
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <h3 className="text-base font-extrabold text-brand-green-900 sm:text-xl">{product.name}</h3>
            <span className="shrink-0 rounded-full bg-brand-gold-500/12 px-2 py-0.5 text-[10px] font-bold text-brand-gold-600 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {product.tag}
            </span>
          </div>
        )}
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-brand-green-900/70 sm:mt-2 sm:text-sm sm:leading-6">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-green-800/80 sm:mt-4 sm:gap-2 sm:text-sm">
          <Users className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>{product.beneficiaries}</span>
        </div>

        <div className="mt-2 flex items-center justify-end">
          <p className="text-base font-extrabold text-brand-gold-600 sm:text-lg">
            {price.toLocaleString("en-US")}
            <span className="mr-1 text-[10px] font-medium text-brand-green-900/60 sm:text-xs">
              {currency.symbol}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center sm:mt-4">
          <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1 sm:gap-3 sm:px-3 sm:py-1.5">
            <button
              type="button"
              onClick={stopAndRun(() => setQty((q) => q + 1))}
              className="flex h-5 w-5 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200 sm:h-6 sm:w-6"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
            <span className="w-4 text-center text-xs font-semibold sm:w-5 sm:text-sm">{qty}</span>
            <button
              type="button"
              onClick={stopAndRun(() => setQty((q) => Math.max(1, q - 1)))}
              className="flex h-5 w-5 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200 sm:h-6 sm:w-6"
              aria-label="إنقاص الكمية"
            >
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={stopAndRun(handleAddToCart)}
          className={`btn-primary mt-2 w-full py-2 text-xs sm:mt-3 sm:py-2.5 sm:text-sm ${added ? "!bg-brand-green-700" : ""}`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              تمت الإضافة
            </>
          ) : (
            <>
              <ShoppingBasket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

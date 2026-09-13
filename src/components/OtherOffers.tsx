"use client";

import Image from "next/image";
import Link from "next/link";
import { ADDON_OPTIONS, getProductPrice, type CurrencyKey, type Product } from "@/lib/data";
import { useCurrency } from "@/lib/currency";

function OfferCard({ product }: { product: Product }) {
  const { currency } = useCurrency();
  const price = getProductPrice(product, ADDON_OPTIONS[0], currency.code.toLowerCase() as CurrencyKey);
  const photo = product.photo;

  return (
    <Link
      href={`/product/${product.id}`}
      className="card-elevate overflow-hidden rounded-2xl border border-black/5 bg-brand-cream-100 text-right"
    >
      <div
        className={`relative flex h-24 items-center justify-center overflow-hidden ${
          product.hasPosterPhoto ? "bg-white" : "bg-gradient-to-br from-brand-gold-400 to-brand-green-700"
        }`}
      >
        <Image
          src={photo}
          alt={product.name}
          fill
          sizes="180px"
          className={product.hasPosterPhoto ? "object-contain" : "object-cover"}
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-brand-green-900">{product.name}</p>
        <p className="mt-1 text-xs text-brand-green-900/70">
          {price.toLocaleString("en-US")} {currency.symbol}
        </p>
      </div>
    </Link>
  );
}

export default function OtherOffers({
  products,
  excludeId,
}: {
  products: Product[];
  excludeId: string;
}) {
  const items = products.filter((p) => p.id !== excludeId);

  return (
    <section className="border-t border-black/5 bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="section-eyebrow">More</span>
        <h2 className="mb-6 mt-3 text-right text-xl font-extrabold text-brand-green-900">
          عروض أخرى متاحة
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((product) => (
            <OfferCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

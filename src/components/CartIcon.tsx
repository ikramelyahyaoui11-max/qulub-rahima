"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartIcon({ className = "" }: { className?: string }) {
  const { totalCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="السلة"
      className={`relative inline-flex ${className}`}
    >
      <ShoppingBasket className="h-5 w-5" />
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-green-800 px-1 text-[10px] font-bold text-white">
          {totalCount}
        </span>
      )}
    </button>
  );
}

"use client";

import { MessageCircle, ShoppingBasket } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/data";

export default function FloatingActions() {
  const { totalCount, toggleCart } = useCart();

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col gap-3">
      <button
        type="button"
        onClick={toggleCart}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold-500 text-white shadow-lg transition-transform hover:scale-105 sm:h-11 sm:w-11"
        aria-label="السلة"
      >
        <ShoppingBasket className="h-5 w-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-green-800 px-1 text-[10px] font-bold text-white">
            {totalCount}
          </span>
        )}
      </button>
      <a
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:h-11 sm:w-11"
        aria-label="واتساب"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href="#"
        className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition-transform hover:scale-105 sm:flex"
        aria-label="فيسبوك"
      >
        <FacebookIcon className="h-5 w-5" />
      </a>
      <a
        href="#"
        className="hidden h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition-transform hover:scale-105 sm:flex"
        aria-label="إنستغرام"
      >
        <InstagramIcon className="h-5 w-5" />
      </a>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import CurrencySelector from "./CurrencySelector";
import { BRAND, NAV_LINKS } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-brand-cream-100/95 backdrop-blur transition-shadow ${
        scrolled ? "border-black/10 shadow-[0_4px_20px_-8px_rgba(11,31,22,0.15)]" : "border-black/5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="الصفحة الرئيسية">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              className="text-sm font-medium text-brand-green-900/80 transition-colors hover:text-brand-gold-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CurrencySelector />
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-4 py-2 text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            تواصل عبر واتساب
          </a>
          <Link href="/#products" className="btn-primary px-5 py-2 text-sm">
            احجز الآن
          </Link>
          <CartIcon className="text-brand-green-900" />
        </div>

        <div className="flex items-center gap-3">
          <CartIcon className="text-brand-green-900 md:hidden" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-green-700/30 text-brand-green-900 lg:hidden"
            aria-label="فتح القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-brand-cream-100 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-green-900/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <CurrencySelector className="self-start" />
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-4 py-2 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل عبر واتساب
            </a>
            <Link
              href="/#products"
              onClick={() => setOpen(false)}
              className="btn-primary py-2 text-sm"
            >
              احجز الآن
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

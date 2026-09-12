"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CURRENCIES, useCurrency } from "@/lib/currency";

export default function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrencyCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-green-900 transition-colors hover:border-brand-gold-500/40"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {currency.label} ({currency.symbol})
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl bg-brand-green-900 py-1 text-right shadow-xl">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setCurrencyCode(c.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              <span>
                {c.label} ({c.symbol})
              </span>
              {c.code === currency.code && <Check className="h-4 w-4 text-brand-gold-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

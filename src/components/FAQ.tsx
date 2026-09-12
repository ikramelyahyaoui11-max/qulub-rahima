"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-brand-green-900 sm:text-4xl">
          الأسئلة الشائعة
        </h2>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mt-4 text-brand-green-900/70">إذا لم نجد ما نريد، لا تترددوا بالتواصل معنا</p>

        <div className="mt-8 flex flex-col gap-3 text-right">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isOpen
                    ? "border-brand-gold-500/40 bg-white shadow-sm"
                    : "border-black/5 bg-brand-cream-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                >
                  <span className="text-sm font-bold text-brand-green-900 sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                      isOpen
                        ? "rotate-45 bg-brand-gold-500 text-white"
                        : "bg-white text-brand-green-800"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-7 text-brand-green-900/70">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

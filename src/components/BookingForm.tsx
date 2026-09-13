"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { ADDON_OPTIONS, BRAND, INTENTIONS } from "@/lib/data";
import { submitOrderAction } from "@/app/booking/actions";

function itemLine(
  item: {
    name: string;
    quantity: number;
    price: number;
    addon?: string;
    intention?: string;
    dedicationName?: string;
  },
  format: (amountEGP: number) => { amount: string; symbol: string }
) {
  const details: string[] = [];
  if (item.addon) details.push(`الإضافات: ${item.addon}`);
  if (item.intention) details.push(`النية: ${item.intention}`);
  if (item.dedicationName) details.push(`الاسم عند التوثيق: ${item.dedicationName}`);
  const detailStr = details.length ? ` (${details.join(" - ")})` : "";
  const { amount, symbol } = format(item.price * item.quantity);
  return `${item.name}${detailStr} × ${item.quantity} — ${amount} ${symbol}`;
}

export default function BookingForm() {
  const { items, totalPrice, updateItem } = useCart();
  const { currency, format } = useCurrency();
  const total = format(totalPrice);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [orderNumber] = useState(() => String(Date.now() % 1000000).padStart(6, "0"));

  const canSubmit = items.length > 0 && name.trim().length > 1 && phone.trim().length >= 8;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitOrderAction({
      orderNumber,
      name: name.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || undefined,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        addon: item.addon,
        intention: item.intention,
        dedicationName: item.dedicationName,
      })),
      totalEGP: totalPrice,
      totalDisplay: total.amount,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
    }).catch(() => {
      // best-effort save; don't block handing the customer off to WhatsApp
    });
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      `رقم الطلب: #${orderNumber}`,
      `الاسم: ${name.trim()}`,
      `رقم الهاتف: ${phone.trim()}`,
    ];
    if (whatsappNumber.trim()) lines.push(`رقم واتساب: ${whatsappNumber.trim()}`);
    lines.push("", "ملخص الطلب:");
    items.forEach((item, i) => lines.push(`${i + 1}) ${itemLine(item, format)}`));
    lines.push("", `الإجمالي: ${total.amount} ${total.symbol}`);
    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [orderNumber, name, phone, whatsappNumber, items, format, total]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream-200 text-brand-green-800">
          <ShoppingBasket className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-brand-green-900">سلتك فارغة</h1>
        <p className="mt-2 text-brand-green-900/70">
          أضف منتجًا أو مشروعًا أولًا قبل إتمام الحجز.
        </p>
        <Link href="/#products" className="btn-primary mt-6 inline-flex px-8 py-3 text-sm">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-brand-green-800 shadow-sm transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-600"
      >
        <ArrowRight className="h-4 w-4" />
        الرجوع
      </Link>

      <div className="text-center">
        <span className="section-eyebrow">Booking</span>
        <h1 className="mt-3 text-3xl font-extrabold text-brand-green-900">إتمام الحجز</h1>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-gold-500" />
        <p className="mx-auto mt-4 max-w-md text-brand-green-900/70">
          املأ بياناتك وسيتم تحويلك مباشرة إلى واتساب لتأكيد الحجز مع تفاصيل طلبك وسعره
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-6 text-right shadow-sm">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">الاسم</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك الكامل"
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none transition-colors placeholder:text-brand-green-900/40 focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">رقم الهاتف</span>
          <input
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-right text-brand-green-900 outline-none transition-colors placeholder:text-brand-green-900/40 focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">رقم واتساب</span>
          <input
            type="tel"
            dir="ltr"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="01xxxxxxxxx (إن كان مختلفًا)"
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-right text-brand-green-900 outline-none transition-colors placeholder:text-brand-green-900/40 focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <div className="flex items-center justify-between rounded-lg bg-brand-gold-500/10 px-3 py-2 text-sm">
          <span className="font-bold text-brand-green-900">رقم الطلب</span>
          <span dir="ltr" className="font-extrabold text-brand-gold-600">
            #{orderNumber}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">ملخص الطلب</span>
          <div className="flex flex-col divide-y divide-black/5 rounded-lg bg-brand-cream-100 p-3">
            {items.map((item) => {
              const lineTotal = format(item.price * item.quantity);
              return (
              <div key={item.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
                <p className="text-brand-green-900/80">
                  {item.name} × {item.quantity} —{" "}
                  {lineTotal.amount} {lineTotal.symbol}
                  {item.dedicationName && ` - الاسم عند التوثيق: ${item.dedicationName}`}
                </p>
                {item.kind === "product" && (
                  <>
                    <label className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-brand-green-900">إضافات على الطلب</span>
                      <select
                        value={item.addon}
                        onChange={(e) => updateItem(item.id, { addon: e.target.value })}
                        className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-brand-green-900 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
                      >
                        {ADDON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-brand-green-900">النية</span>
                      <select
                        value={item.intention}
                        onChange={(e) => updateItem(item.id, { intention: e.target.value })}
                        className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-brand-green-900 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
                      >
                        {INTENTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
              </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-lg font-extrabold text-brand-green-900">
          <span>
            {total.amount}
            <span className="mr-1 text-sm font-medium text-brand-green-900/60">
              {total.symbol}
            </span>
          </span>
          <span>الإجمالي:</span>
        </div>

        <a
          href={canSubmit ? whatsappHref : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canSubmit}
          onClick={(e) => {
            if (!canSubmit) {
              e.preventDefault();
              return;
            }
            handleSubmit();
          }}
          className={`btn-primary py-3 text-sm ${
            canSubmit ? "" : "cursor-not-allowed opacity-50"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          إرسال الطلب عبر واتساب
        </a>
        {!canSubmit && (
          <p className="-mt-3 text-center text-xs text-brand-green-900/50">
            يرجى كتابة الاسم ورقم هاتف صحيح لإرسال الطلب
          </p>
        )}
      </div>
    </div>
  );
}

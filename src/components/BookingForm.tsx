"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, MessageCircle, ShoppingBasket } from "lucide-react";
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
  const { items, totalPrice, updateItem, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const total = format(totalPrice);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    orderNumber: string | null;
    name: string;
    lines: string[];
    total: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = items.length > 0 && name.trim().length > 1 && phone.trim().length >= 8;

  const handleSend = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const orderInput = {
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
    };

    let orderNumber: string | null = null;
    try {
      const result = await submitOrderAction(orderInput);
      orderNumber = result.orderNumber;
    } catch {
      // best-effort save; the customer still gets an on-screen confirmation below
    }

    const lines: string[] = [];
    if (orderNumber) lines.push(`رقم الطلب: ${orderNumber}`);
    lines.push(`الاسم: ${name.trim()}`, `رقم الهاتف: ${phone.trim()}`);
    if (whatsappNumber.trim()) lines.push(`رقم واتساب: ${whatsappNumber.trim()}`);
    lines.push("", "ملخص الطلب:");
    items.forEach((item, i) => lines.push(`${i + 1}) ${itemLine(item, format)}`));
    lines.push("", `الإجمالي: ${total.amount} ${total.symbol}`);
    const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;

    // Show the confirmation immediately on-screen — this is automatic and doesn't
    // depend on WhatsApp opening successfully (popups can be blocked, the app may
    // not be installed, etc). Sending the WhatsApp message stays an optional,
    // one-tap step for customers who want to chat with the team directly.
    setConfirmed({
      orderNumber,
      name: name.trim(),
      lines: items.map((item) => itemLine(item, format)),
      total: `${total.amount} ${total.symbol}`,
      whatsappUrl,
    });
    clearCart();
    setSubmitting(false);
  };

  const copyOrderNumber = async () => {
    if (!confirmed?.orderNumber) return;
    try {
      await navigator.clipboard.writeText(confirmed.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — the number is already visible on screen
    }
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-700/10 text-brand-green-700">
            <Check className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-green-900">
              تم استلام طلبك بنجاح
            </h1>
            <p className="mt-2 text-brand-green-900/70">
              شكرًا لك يا {confirmed.name}، سيتواصل معك فريقنا قريبًا لتأكيد التفاصيل
            </p>
          </div>

          {confirmed.orderNumber && (
            <button
              type="button"
              onClick={copyOrderNumber}
              className="flex items-center gap-2 rounded-full bg-brand-cream-100 px-5 py-2 text-sm font-bold text-brand-green-900"
            >
              رقم الطلب: <span dir="ltr">{confirmed.orderNumber}</span>
              {copied ? (
                <Check className="h-4 w-4 text-brand-green-700" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-brand-green-900/50" />
              )}
            </button>
          )}

          <div className="w-full rounded-xl bg-brand-cream-100 p-4 text-right">
            <p className="mb-2 text-sm font-bold text-brand-green-900">ملخص الطلب</p>
            <ul className="flex flex-col gap-1.5 text-sm text-brand-green-900/80">
              {confirmed.lines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-base font-extrabold text-brand-green-900">
              <span dir="ltr">{confirmed.total}</span>
              <span>الإجمالي</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row-reverse">
            <a
              href={confirmed.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 py-3 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              تأكيد الطلب عبر واتساب
            </a>
            <Link href="/" className="btn-outline flex-1 py-3 text-sm">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          املأ بياناتك وسيتم تأكيد طلبك فورًا على الشاشة، ويمكنك إرساله عبر واتساب لمتابعة أسرع
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

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSend}
          className={`btn-primary py-3 text-sm ${
            canSubmit && !submitting ? "" : "cursor-not-allowed opacity-50"
          }`}
        >
          <Check className="h-4 w-4" />
          {submitting ? "جارٍ التأكيد..." : "تأكيد الطلب"}
        </button>
        {!canSubmit && (
          <p className="-mt-3 text-center text-xs text-brand-green-900/50">
            يرجى كتابة الاسم ورقم هاتف صحيح لإرسال الطلب
          </p>
        )}
      </div>
    </div>
  );
}

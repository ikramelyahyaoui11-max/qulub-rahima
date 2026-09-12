"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";
import { usePrice } from "@/lib/currency";

function CartLineItem({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const price = usePrice(item.price * item.quantity);

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <button
        type="button"
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
        aria-label="إزالة"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1">
        <button
          type="button"
          onClick={onIncrease}
          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
          aria-label="زيادة الكمية"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          type="button"
          onClick={onDecrease}
          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-green-800 hover:bg-brand-cream-200"
          aria-label="إنقاص الكمية"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1">
        <p className="text-sm font-extrabold text-brand-green-900">{item.name}</p>
        <p className="mt-0.5 text-xs text-brand-green-900/60">
          {price.amount} {price.symbol}
        </p>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();
  const total = usePrice(totalPrice);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة الطلبات"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white text-right shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-green-900 hover:bg-brand-cream-200"
            aria-label="إغلاق السلة"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-extrabold text-brand-green-900">سلة الطلبات</h2>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream-200 text-brand-green-800">
              <ShoppingBasket className="h-6 w-6" />
            </span>
            <p className="font-bold text-brand-green-900">سلتك فارغة</p>
            <p className="text-sm text-brand-green-900/60">
              أضف منتجًا أو مشروعًا لتظهر تفاصيله هنا
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col divide-y divide-black/5">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-black/5 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-base font-extrabold text-brand-green-900">
                <span>
                  {total.amount}
                  <span className="mr-1 text-xs font-medium text-brand-green-900/60">
                    {total.symbol}
                  </span>
                </span>
                <span>الإجمالي</span>
              </div>
              <Link href="/booking" onClick={closeCart} className="btn-primary w-full py-3 text-sm">
                إتمام الحجز
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full text-center text-xs font-semibold text-brand-green-900/60 hover:text-red-600"
              >
                إفراغ السلة
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

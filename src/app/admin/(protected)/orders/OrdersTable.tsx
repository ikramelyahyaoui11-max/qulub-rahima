"use client";

import { useMemo, useState } from "react";
import { Phone, MessageCircle, Trash2, Download, CheckCircle2, Circle } from "lucide-react";
import type { Order } from "@/lib/store";
import { deleteOrderAction, setOrderContactedAction } from "../../actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toLocalDateInputValue(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function itemLine(item: Order["items"][number]) {
  const details: string[] = [];
  if (item.addon) details.push(item.addon);
  if (item.intention) details.push(`النية: ${item.intention}`);
  if (item.dedicationName) details.push(`الاسم عند التوثيق: ${item.dedicationName}`);
  const detailStr = details.length ? ` (${details.join(" - ")})` : "";
  return `${item.name}${detailStr} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString("en-US")} ج.م`;
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function exportToExcel(orders: Order[]) {
  const headers = [
    "رقم الطلب",
    "التاريخ",
    "الاسم",
    "الهاتف",
    "واتساب",
    "المنتجات",
    "الإجمالي",
    "العملة",
    "تم التواصل",
  ];
  const rows = orders.map((order) => [
    order.orderNumber ?? "",
    formatDate(order.createdAt),
    order.name,
    order.phone,
    order.whatsappNumber ?? "",
    order.items.map(itemLine).join(" | "),
    order.totalDisplay,
    order.currencySymbol,
    order.contacted ? "نعم" : "لا",
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `طلبات-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [dateFilter, setDateFilter] = useState("");
  const [contactedFilter, setContactedFilter] = useState<"all" | "yes" | "no">("all");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (dateFilter && toLocalDateInputValue(order.createdAt) !== dateFilter) return false;
      if (contactedFilter === "yes" && !order.contacted) return false;
      if (contactedFilter === "no" && order.contacted) return false;
      return true;
    });
  }, [orders, dateFilter, contactedFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-bold text-brand-green-900">فلترة حسب اليوم</span>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-1.5 text-sm text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter("")}
                className="text-xs font-semibold text-brand-green-900/50 hover:text-red-600"
              >
                مسح
              </button>
            )}
          </div>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-bold text-brand-green-900">التواصل عبر واتساب</span>
          <select
            value={contactedFilter}
            onChange={(e) => setContactedFilter(e.target.value as "all" | "yes" | "no")}
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-1.5 text-sm text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          >
            <option value="all">الكل</option>
            <option value="yes">تم التواصل</option>
            <option value="no">لسه</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => exportToExcel(filtered)}
          className="btn-primary mr-auto px-4 py-2 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          تصدير Excel ({filtered.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-right text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-brand-cream-100 text-xs font-bold text-brand-green-900/70">
              <th className="whitespace-nowrap px-4 py-3">رقم الطلب</th>
              <th className="whitespace-nowrap px-4 py-3">التاريخ</th>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">التواصل</th>
              <th className="px-4 py-3">الطلب</th>
              <th className="whitespace-nowrap px-4 py-3">الإجمالي</th>
              <th className="whitespace-nowrap px-4 py-3">تم التواصل؟</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-brand-green-900/50">
                  مفيش طلبات مطابقة للفلتر
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="align-top transition-colors hover:bg-brand-cream-100/50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      dir="ltr"
                      className="rounded-full bg-brand-gold-500/10 px-2.5 py-1 text-xs font-extrabold text-brand-gold-600"
                    >
                      {order.orderNumber ? `#${order.orderNumber}` : "—"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs text-brand-green-900/60">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-4 font-bold text-brand-green-900">{order.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <a
                        href={`tel:${order.phone}`}
                        className="flex items-center gap-1.5 rounded-full bg-brand-cream-100 px-2.5 py-1 text-xs font-semibold text-brand-green-800"
                        dir="ltr"
                      >
                        <Phone className="h-3 w-3" />
                        {order.phone}
                      </a>
                      {order.whatsappNumber && order.whatsappNumber !== order.phone && (
                        <a
                          href={`https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-semibold text-[#128C4A]"
                          dir="ltr"
                        >
                          <MessageCircle className="h-3 w-3" />
                          {order.whatsappNumber}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand-green-900/80">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, i) => (
                        <p key={i}>{itemLine(item)}</p>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-extrabold text-brand-green-900">
                    {order.totalDisplay}
                    <span className="mr-1 text-xs font-medium text-brand-green-900/60">
                      {order.currencySymbol}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <form action={setOrderContactedAction}>
                      <input type="hidden" name="id" value={order.id} />
                      <input type="hidden" name="contacted" value={order.contacted ? "false" : "true"} />
                      <button
                        type="submit"
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          order.contacted
                            ? "bg-brand-green-800/10 text-brand-green-800"
                            : "bg-black/5 text-brand-green-900/50 hover:bg-black/10"
                        }`}
                      >
                        {order.contacted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Circle className="h-3.5 w-3.5" />
                        )}
                        {order.contacted ? "تم التواصل" : "لسه"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-4">
                    <form action={deleteOrderAction}>
                      <input type="hidden" name="id" value={order.id} />
                      <button
                        type="submit"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                        aria-label="حذف الطلب"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

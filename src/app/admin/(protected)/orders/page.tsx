import { Phone, MessageCircle, Trash2, Inbox } from "lucide-react";
import { getOrders } from "@/lib/store";
import { deleteOrderAction } from "../../actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function itemLine(item: {
  name: string;
  quantity: number;
  price: number;
  addon?: string;
  intention?: string;
  dedicationName?: string;
}) {
  const details: string[] = [];
  if (item.addon) details.push(item.addon);
  if (item.intention) details.push(`النية: ${item.intention}`);
  if (item.dedicationName) details.push(`الاسم عند التوثيق: ${item.dedicationName}`);
  const detailStr = details.length ? ` (${details.join(" - ")})` : "";
  return `${item.name}${detailStr} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString("en-US")} ج.م`;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-extrabold text-brand-green-900">الطلبات ({orders.length})</h2>
        <p className="mt-1 text-sm text-brand-green-900/60">
          كل طلب بيتسجل هنا لحظة ما العميل يدوس على &quot;إرسال الطلب عبر واتساب&quot;، حتى لو ملبعتش
          الرسالة فعليًا
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/10 bg-white py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream-200 text-brand-green-800">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="font-bold text-brand-green-900">لسه مفيش طلبات</p>
          <p className="text-sm text-brand-green-900/60">هتظهر هنا أول ما حد يحجز من الموقع</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 text-right shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-brand-green-900">{order.name}</p>
                  <p className="mt-0.5 text-xs text-brand-green-900/50">{formatDate(order.createdAt)}</p>
                </div>
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
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1.5 rounded-full bg-brand-cream-100 px-3 py-1.5 font-semibold text-brand-green-800"
                  dir="ltr"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {order.phone}
                </a>
                {order.whatsappNumber && order.whatsappNumber !== order.phone && (
                  <a
                    href={`https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 font-semibold text-[#128C4A]"
                    dir="ltr"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {order.whatsappNumber}
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg bg-brand-cream-100 p-3 text-sm text-brand-green-900/80">
                {order.items.map((item, i) => (
                  <p key={i}>{itemLine(item)}</p>
                ))}
              </div>

              <div className="flex items-center justify-between text-base font-extrabold text-brand-green-900">
                <span>الإجمالي:</span>
                <span>
                  {order.totalDisplay}
                  <span className="mr-1 text-xs font-medium text-brand-green-900/60">
                    {order.currencySymbol}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-brand-cream-100 text-xs font-bold text-brand-green-900/70">
                <th className="whitespace-nowrap px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">التواصل</th>
                <th className="px-4 py-3">الطلب</th>
                <th className="whitespace-nowrap px-4 py-3">الإجمالي</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => (
                <tr key={order.id} className="align-top transition-colors hover:bg-brand-cream-100/50">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

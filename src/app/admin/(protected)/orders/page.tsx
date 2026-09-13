import { Inbox } from "lucide-react";
import { getOrders } from "@/lib/store";
import OrdersTable from "./OrdersTable";

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
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}

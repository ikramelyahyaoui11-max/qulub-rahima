"use server";

import { addOrder, generateId, reserveNextOrderNumber, type Order, type OrderItem } from "@/lib/store";
import { appendOrderToSheet } from "@/lib/googleSheets";

export async function submitOrderAction(input: {
  name: string;
  phone: string;
  whatsappNumber?: string;
  items: OrderItem[];
  totalEGP: number;
  totalDisplay: string;
  currencyCode: string;
  currencySymbol: string;
}): Promise<{ id: string; orderNumber: string }> {
  const orderNumber = await reserveNextOrderNumber();
  const order: Order = {
    id: generateId("order"),
    orderNumber,
    name: input.name.trim(),
    phone: input.phone.trim(),
    whatsappNumber: input.whatsappNumber?.trim() || undefined,
    items: input.items,
    totalEGP: input.totalEGP,
    totalDisplay: input.totalDisplay,
    currencyCode: input.currencyCode,
    currencySymbol: input.currencySymbol,
    createdAt: new Date().toISOString(),
  };
  await addOrder(order);

  try {
    await appendOrderToSheet(order);
  } catch {
    // best-effort: the order is already saved locally either way; a missed
    // sync can be retried from the "مزامنة الآن" button on /admin/orders
  }

  return { id: order.id, orderNumber };
}

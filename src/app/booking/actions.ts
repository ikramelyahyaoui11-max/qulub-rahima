"use server";

import { addOrder, generateId, type Order, type OrderItem } from "@/lib/store";

export async function submitOrderAction(input: {
  name: string;
  phone: string;
  whatsappNumber?: string;
  items: OrderItem[];
  totalEGP: number;
  totalDisplay: string;
  currencyCode: string;
  currencySymbol: string;
}): Promise<{ id: string }> {
  const order: Order = {
    id: generateId("order"),
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
  return { id: order.id };
}

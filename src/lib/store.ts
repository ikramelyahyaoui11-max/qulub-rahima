import {
  PRODUCTS as SEED_PRODUCTS,
  OTHER_PROJECTS as SEED_OTHER_PROJECTS,
  type Product,
  type OtherProject,
} from "./data";
import { readJSON, writeJSON, updateJSON } from "./storage";

const PRODUCTS_KEY = "products";
const OTHER_PROJECTS_KEY = "other-projects";
const SETTINGS_KEY = "settings";
const ORDERS_KEY = "orders";
const ORDER_COUNTER_KEY = "order-counter";
const STARTING_ORDER_NUMBER = 1800;

export type OrderItem = {
  name: string;
  quantity: number;
  price: number; // in EGP
  addon?: string;
  intention?: string;
  dedicationName?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  name: string;
  phone: string;
  whatsappNumber?: string;
  items: OrderItem[];
  totalEGP: number;
  totalDisplay: string;
  currencyCode: string;
  currencySymbol: string;
  createdAt: string;
  contacted?: boolean;
};

export type Settings = {
  usdRate: number;
  sarRate: number;
  eurRate: number;
};

const DEFAULT_SETTINGS: Settings = { usdRate: 49, sarRate: 13.05, eurRate: 53 };

export async function getProducts(): Promise<Product[]> {
  return readJSON(PRODUCTS_KEY, SEED_PRODUCTS);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJSON(PRODUCTS_KEY, products);
}

export async function getOtherProjects(): Promise<OtherProject[]> {
  return readJSON(OTHER_PROJECTS_KEY, SEED_OTHER_PROJECTS);
}

export async function saveOtherProjects(projects: OtherProject[]): Promise<void> {
  await writeJSON(OTHER_PROJECTS_KEY, projects);
}

export async function getSettings(): Promise<Settings> {
  return readJSON(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJSON(SETTINGS_KEY, settings);
}

export async function getOrders(): Promise<Order[]> {
  return readJSON(ORDERS_KEY, []);
}

export async function addOrder(order: Order): Promise<void> {
  await updateJSON<Order[]>(ORDERS_KEY, [], (orders) => [order, ...orders]);
}

export async function deleteOrder(id: string): Promise<void> {
  await updateJSON<Order[]>(ORDERS_KEY, [], (orders) => orders.filter((o) => o.id !== id));
}

export async function setOrderContacted(id: string, contacted: boolean): Promise<void> {
  await updateJSON<Order[]>(ORDERS_KEY, [], (orders) =>
    orders.map((o) => (o.id === id ? { ...o, contacted } : o))
  );
}

/** Generates a short, unique, URL-safe id for a new item (Arabic names can't be reliably slugified). */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Reserves and returns the next sequential order number (T1800, T1801, ...). */
export async function reserveNextOrderNumber(): Promise<string> {
  const counter = await updateJSON<{ last: number }>(
    ORDER_COUNTER_KEY,
    { last: STARTING_ORDER_NUMBER - 1 },
    (current) => ({ last: current.last + 1 })
  );
  return `T${counter.last}`;
}

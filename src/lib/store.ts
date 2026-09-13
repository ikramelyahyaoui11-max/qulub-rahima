import fs from "fs/promises";
import path from "path";
import {
  PRODUCTS as SEED_PRODUCTS,
  OTHER_PROJECTS as SEED_OTHER_PROJECTS,
  type Product,
  type OtherProject,
} from "./data";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const OTHER_PROJECTS_FILE = path.join(DATA_DIR, "other-projects.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

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
  name: string;
  phone: string;
  whatsappNumber?: string;
  items: OrderItem[];
  totalEGP: number;
  totalDisplay: string;
  currencyCode: string;
  currencySymbol: string;
  createdAt: string;
};

export type Settings = {
  usdRate: number;
  sarRate: number;
};

const DEFAULT_SETTINGS: Settings = { usdRate: 49, sarRate: 13.05 };

async function readJSON<T>(file: string, seed: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

async function writeJSON<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  return readJSON(PRODUCTS_FILE, SEED_PRODUCTS);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJSON(PRODUCTS_FILE, products);
}

export async function getOtherProjects(): Promise<OtherProject[]> {
  return readJSON(OTHER_PROJECTS_FILE, SEED_OTHER_PROJECTS);
}

export async function saveOtherProjects(projects: OtherProject[]): Promise<void> {
  await writeJSON(OTHER_PROJECTS_FILE, projects);
}

export async function getSettings(): Promise<Settings> {
  return readJSON(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJSON(SETTINGS_FILE, settings);
}

export async function getOrders(): Promise<Order[]> {
  return readJSON(ORDERS_FILE, []);
}

export async function addOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  await writeJSON(ORDERS_FILE, [order, ...orders]);
}

export async function deleteOrder(id: string): Promise<void> {
  const orders = await getOrders();
  await writeJSON(ORDERS_FILE, orders.filter((o) => o.id !== id));
}

/** Generates a short, unique, URL-safe id for a new item (Arabic names can't be reliably slugified). */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  kind: "product" | "project";
  refId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  addon?: string;
  intention?: string;
  dedicationName?: string;
};

type NewCartItem = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, patch: Partial<CartItem>) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "qulub-rahima-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted or inaccessible storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (private mode, quota, ...)
    }
  }, [items, hydrated]);

  const addItem = (newItem: NewCartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  const updateItem = (id: string, patch: Partial<CartItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const clearCart = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItem,
        clearCart,
        totalCount,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

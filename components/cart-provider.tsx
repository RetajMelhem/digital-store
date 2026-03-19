"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY, Locale } from "@/lib/constants";

export type CartItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
};

type Addable = Omit<CartItem, "quantity">;

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Addable, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getLocalizedName: (item: CartItem, locale: Locale) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      count,
      subtotal,
      addItem: (item: Addable, quantity: number = 1) =>
        setItems((current) => {
          const existing = current.find((entry) => entry.id === item.id);

          if (existing) {
            return current.map((entry) =>
              entry.id === item.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry
            );
          }

          return [...current, { ...item, quantity }];
        }),
      updateQuantity: (id: string, quantity: number) =>
        setItems((current) =>
          current.map((entry) =>
            entry.id === id
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry
          )
        ),
      removeItem: (id: string) =>
        setItems((current) => current.filter((entry) => entry.id !== id)),
      clearCart: () => setItems([]),
      getLocalizedName: (item: CartItem, locale: Locale) =>
        locale === "ar" ? item.nameAr : item.nameEn
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
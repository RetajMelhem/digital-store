"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  addItem: (item: Addable, quantity?: number, toastLocale?: Locale) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getLocalizedName: (item: CartItem, locale: Locale) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastLocale, setToastLocale] = useState<Locale | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  function hideToast() {
    setToastLocale(null);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  }

  function showToast(locale?: Locale) {
    if (!locale) return;
    setToastLocale(locale);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      hideToast();
    }, 3000);
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      } else {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      count,
      subtotal,
      addItem: (item: Addable, quantity: number = 1, toastMessageArg?: string) => {
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
        });
        showToast(toastMessageArg as Locale | undefined);
      },
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

  return (
    <CartContext.Provider value={value}>
      {children}
      {toastLocale ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-background text-center shadow-card">
            <div className="h-1 w-full bg-surface-muted">
              <div className="h-full w-full origin-left bg-brand animate-[toast-progress_3s_linear_forwards]" />
            </div>
            <div className="p-6">
            <p className="text-lg font-bold text-foreground">
              {toastLocale === "ar" ? "تمت إضافة المنتج إلى السلة" : "Product added to cart"}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" className="btn-secondary" onClick={hideToast}>
                {toastLocale === "ar" ? "موافق" : "OK"}
              </button>
              <Link href={`/${toastLocale}/cart`} className="btn-primary" onClick={hideToast}>
                {toastLocale === "ar" ? "انتقل إلى السلة" : "Go to cart"}
              </Link>
            </div>
            </div>
          </div>
        </div>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

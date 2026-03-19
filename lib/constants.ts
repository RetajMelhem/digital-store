export const ADMIN_ROUTE = "/admin-secret-9f3k";
export const ADMIN_COOKIE = "digital_store_admin";
export const CART_STORAGE_KEY = "digital-store-bilingual-cart";
export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: "Account Hub",
  description: "Account Hub is a bilingual digital subscriptions store built with Next.js and Prisma",
  icons: {
    icon: "/images/our logo/our logo.png",
    shortcut: "/images/our logo/our logo.png",
    apple: "/images/our logo/our logo.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            var savedTheme = window.localStorage.getItem("theme");
            var theme = savedTheme === "dark" || savedTheme === "light"
              ? savedTheme
              : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            document.documentElement.dataset.theme = theme;
          } catch (error) {}`}
        </Script>
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

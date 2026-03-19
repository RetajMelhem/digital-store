import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-bg-elevated)",
          muted: "var(--color-bg-muted)"
        },
        foreground: "var(--color-text)",
        muted: "var(--color-text-muted)",
        line: "var(--color-border)",
        brand: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)"
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)"
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)"
        },
        hero: {
          DEFAULT: "var(--color-hero)",
          surface: "var(--color-hero-surface)",
          muted: "var(--color-hero-muted)"
        },
        success: {
          DEFAULT: "var(--color-success)",
          soft: "var(--color-success-soft)"
        }
      },
      boxShadow: {
        card: "var(--shadow-card)",
        soft: "var(--shadow-soft)"
      }
    }
  },
  plugins: []
};

export default config;

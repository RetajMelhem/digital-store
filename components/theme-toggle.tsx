"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/lib/constants";
import { dictionary } from "@/lib/i18n";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<Theme>("light");
  const t = dictionary[locale];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : getSystemTheme();
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!window.localStorage.getItem("theme")) {
        const systemTheme = getSystemTheme();
        document.documentElement.dataset.theme = systemTheme;
        setTheme(systemTheme);
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="inline-flex rounded-2xl border border-line bg-surface p-1 shadow-sm">
      <button
        type="button"
        onClick={() => applyTheme("light")}
        className={`rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
          theme === "light" ? "bg-brand text-[var(--color-text-inverse)] shadow-sm" : "text-muted hover:bg-surface-muted"
        }`}
        aria-label={t.lightMode}
        aria-pressed={theme === "light"}
      >
        {t.lightMode}
      </button>
      <button
        type="button"
        onClick={() => applyTheme("dark")}
        className={`rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
          theme === "dark" ? "bg-brand text-[var(--color-text-inverse)] shadow-sm" : "text-muted hover:bg-surface-muted"
        }`}
        aria-label={t.darkMode}
        aria-pressed={theme === "dark"}
      >
        {t.darkMode}
      </button>
    </div>
  );
}

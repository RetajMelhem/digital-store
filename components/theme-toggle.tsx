"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
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
    <button
      type="button"
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-foreground shadow-premium transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 min-[400px]:inline-flex sm:h-11 sm:w-11"
      aria-label={theme === "dark" ? t.lightMode : t.darkMode}
    >
      {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" strokeWidth={1.9} /> : <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" strokeWidth={1.9} />}
    </button>
  );
}

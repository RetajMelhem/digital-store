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
    <button
      type="button"
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-foreground shadow-sm hover:bg-surface-muted"
      aria-label={theme === "dark" ? t.lightMode : t.darkMode}
    >
      {theme === "dark" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" strokeLinecap="round" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c-.12.58-.18 1.17-.18 1.79A8 8 0 0 0 19.21 13c.61 0 1.21-.06 1.79-.21Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

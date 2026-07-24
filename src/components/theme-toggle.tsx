"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
    >
      {mounted ? (
        isDark ? <Sun size={15} /> : <Moon size={15} />
      ) : (
        <span className="h-[15px] w-[15px]" />
      )}
    </button>
  );
}

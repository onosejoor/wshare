"use client";

import { MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwtich() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  console.log(theme);
  


  return (
    <button
      className="p-3 bg-primary/10 rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Sun className="text-muted" />
      ) : (
        <MoonIcon className="text-accent" />
      )}
    </button>
  );
}

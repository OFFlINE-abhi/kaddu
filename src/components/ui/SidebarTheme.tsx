"use client";

import { useState, useEffect } from "react";

export default function useSidebarTheme() {
  const [theme, setTheme] = useState<"default" | "theme1" | "theme2">("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("sidebar-theme") as "default" | "theme1" | "theme2";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-sidebar-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "default" ? "theme1" : theme === "theme1" ? "theme2" : "default";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-sidebar-theme", newTheme);
    localStorage.setItem("sidebar-theme", newTheme);
  };

  return { theme, toggleTheme };
}

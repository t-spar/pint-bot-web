"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  function toggleDark() {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  }

  const links = [
    { path: "/", label: "Home" },
    { path: "/debts/all", label: "All Debts" },
    { path: "/debts/personal", label: "My Debts" },
    { path: "/user-profile", label: "User Profile" },
  ];

  return (
    <aside className="w-64 h-screen p-4 border-r bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <nav className="flex-1">
        <ul className="space-y-4">
          {links.map(({ path, label }) => (
            <li key={path}>
              <Link href={path} className="font-medium hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={toggleDark}
        className="mt-4 px-3 py-2 rounded border font-medium hover:underline"
      >
        {isDark ? "Switch To Light Mode" : "Switch To Dark Mode"}
      </button>
    </aside>
  );
}

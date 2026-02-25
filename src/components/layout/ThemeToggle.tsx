"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    // Load theme on mount
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (saved) {
            setTheme(saved);
            document.documentElement.classList.toggle("dark", saved === "dark");
        } else {
            setTheme(prefersDark ? "dark" : "light");
            document.documentElement.classList.toggle("dark", prefersDark);
        }
    }, []);

    // Toggle handler
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700 shadow-md transition-all hover:scale-105 cusor-pionter"
        >
            {theme === "light" ? (
                <Moon size={20} className="text-slate-700" />
            ) : (
                <Sun size={20} className="text-yellow-400" />
            )}
        </button>
    );
}

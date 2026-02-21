"use client";

import Link from 'next/link';
import { Search, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b dark:bg-gradient-to-r dark:from-black dark:to-[#4a0412] dark:border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
        </div>
        <span className="font-bold text-xl">Match Hub</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <Link href="/turfs">Turfs</Link>
        <Link href="/games">Games</Link>
        <Link href="/tournaments">Tournaments</Link>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 border border-gray-400 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-gray-900 dark:text-yellow-500" />
          ) : (
            <Moon size={20} className="text-gray-900" />
          )}
        </button>
        <button className="font-medium text-gray-900 dark:text-white">Login</button>
        <button className="bg-[#D31D3F] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition">
          Register
        </button>
      </div>
    </nav>
  );
};

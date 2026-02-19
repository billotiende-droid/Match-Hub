"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Checks for system preference on mount
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
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-800">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center gap-3">
        {/* Ball Logo SVG */}
        <div className="w-10 h-10 relative">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Ball base circle */}
            <circle cx="32" cy="32" r="30" fill="#1a1a1a" className="dark:fill-white" />
            
            {/* Ball pattern lines */}
            <path
              d="M32 2C32 2 45 10 50 20C55 30 52 45 52 45"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="dark:stroke-black"
            />
            <path
              d="M32 2C32 2 19 10 14 20C9 30 12 45 12 45"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="dark:stroke-black"
            />
            <path
              d="M2 32C2 32 10 19 20 14C30 9 45 12 45 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="dark:stroke-black"
            />
            <path
              d="M62 32C62 32 54 19 44 14C34 9 19 12 19 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="dark:stroke-black"
            />
            
            {/* Center pentagon */}
            <path
              d="M32 22L38 30L35 39L29 39L26 30L32 22Z"
              fill="white"
              className="dark:fill-black"
            />
          </svg>
        </div>
      
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Match Hub
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Turfs
        </Link>
        <Link
          href="/matches"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Games
        </Link>
        <Link
          href="/leagues"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Tournament
        </Link>
      </div>


      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
        // Sun icon for light mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
          Sign In
        </button>
        
      
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

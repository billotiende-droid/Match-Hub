"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearAuthSession, getAuthSession, type AuthSession } from '@/services/authService';
import { applyTheme, getTheme, initTheme } from '@/services/themeService';

export const Navbar = () => {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  useEffect(() => {
    initTheme();
  }, []);

  const toggleTheme = () => {
    const currentTheme = getTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 border-b border-[var(--color-border)] bg-white">
      <Link href="/" className="flex items-center gap-3 text-gray-900">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#006600" stroke="#DC143C" strokeWidth="2" />
            <path d="M12 2C12 2 5 6 5 12C5 17 9 21 12 22C15 21 19 17 19 12C19 6 12 2 12 2Z" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M2 12H22" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M5.5 5.5L18.5 18.5" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M18.5 5.5L5.5 18.5" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="#ffffff" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight">Match Hub</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        <Link href="/turfs" className="hover:text-[var(--color-primary)] transition-colors">Turfs</Link>
        <Link href="/games" className="hover:text-[var(--color-primary)] transition-colors">Games</Link>
        <Link href="/tournaments" className="hover:text-[var(--color-primary)] transition-colors">Tournaments</Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-colors bg-white"
          aria-label="Toggle theme"
        >
          <Moon size={20} className="hidden dark:block text-[var(--foreground)]" />
          <Sun size={20} className="block dark:hidden text-[var(--color-accent)]" />
        </button>
        {session ? (
          <>
            <Link href="/dashboard" className="font-medium text-gray-900 dark:text-white">
              {session.user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-strong)] transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-700 font-semibold hover:text-[var(--color-primary)] transition-colors"
            >
              Login
            </Link>
            <Link href="/signup" className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-strong)] transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

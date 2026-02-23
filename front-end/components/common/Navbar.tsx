"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearAuthSession, getAuthSession, type AuthSession } from '@/services/authService';
import { applyTheme, getTheme, initTheme, subscribeTheme, type ThemeMode } from '@/services/themeService';

export const Navbar = () => {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>(() => getTheme());
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  useEffect(() => {
    initTheme();
    return subscribeTheme((nextTheme) => setTheme(nextTheme));
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
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
        <div className="w-9 h-9 bg-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-sm">
          <div className="w-4 h-4 rounded-full border-2 border-white" />
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
          {theme === "dark" ? (
            <Moon size={20} className="text-[var(--foreground)]" />
          ) : (
            <Sun size={20} className="text-[var(--color-accent)]" />
          )}
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

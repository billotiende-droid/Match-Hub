"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { clearAuthSession, getAuthSession, subscribeAuthSession } from '@/services/authService';
import { applyTheme, getTheme, initTheme, subscribeTheme } from '@/services/themeService';

export const Navbar = () => {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const theme = useSyncExternalStore(
    (onStoreChange) => subscribeTheme(() => onStoreChange()),
    getTheme,
    () => "light"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/turfs', label: 'Turfs' },
    { href: '/games', label: 'Games' },
    { href: '/tournaments', label: 'Tournaments' },
    ...(session?.user.user_type === "admin"
      ? [{ href: '/dashboard/bookings', label: 'Bookings' }]
      : []),
  ];

  useEffect(() => {
    initTheme();
  }, []);

  const setLightMode = () => {
    applyTheme("light");
  };

  const setDarkMode = () => {
    applyTheme("dark");
  };

  const handleLogout = () => {
    clearAuthSession();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const dashboardHref = session?.user.user_type === "admin" ? "/dashboard/bookings" : "/dashboard";

  return (
    <>
      <nav className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 border-b border-[var(--color-border)] bg-white/95 dark:bg-[var(--surface)]/95 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight">Match Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-gray-600 dark:text-gray-300 font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--color-primary)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={setLightMode}
            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-all duration-300 ease-in-out bg-white dark:bg-[var(--surface)] hover:scale-110"
            aria-label="Switch to light mode"
          >
            <Sun size={20} className="text-[var(--color-accent)] transition-transform duration-300" />
          </button>
          <button
            onClick={setDarkMode}
            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-all duration-300 ease-in-out bg-white dark:bg-[var(--surface)] hover:scale-110"
            aria-label="Switch to dark mode"
          >
            <Moon size={20} className="text-[var(--foreground)] transition-transform duration-300" />
          </button>
          {session ? (
            <>
              <Link href={dashboardHref} className="font-medium text-gray-900 dark:text-white max-w-40 truncate">
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
                className="border border-[var(--color-secondary)] text-[var(--color-secondary)] px-5 py-2 rounded-xl font-semibold hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link href="/signup" className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-xl font-semibold hover:bg-[var(--color-primary-strong)] transition">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={setLightMode}
            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-all duration-300 ease-in-out bg-white dark:bg-[var(--surface)] hover:scale-110"
            aria-label="Switch to light mode"
          >
            <Sun size={18} className="text-[var(--color-accent)] transition-transform duration-300" />
          </button>
          <button
            onClick={setDarkMode}
            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-all duration-300 ease-in-out bg-white dark:bg-[var(--surface)] hover:scale-110"
            aria-label="Switch to dark mode"
          >
            <Moon size={18} className="text-[var(--foreground)] transition-transform duration-300" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--surface-muted)] transition-colors bg-white dark:bg-[var(--surface)]"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[61px] z-30 border-b border-[var(--color-border)] bg-white/95 dark:bg-[var(--surface)]/95 backdrop-blur-md px-4 pb-4 pt-3 space-y-3">
          <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-200 font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-lg hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--surface-muted)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {session ? (
            <div className="flex flex-col gap-2">
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--surface-muted)]"
              >
                {session.user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[var(--color-primary-strong)] transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center border border-[var(--color-secondary)] text-[var(--color-secondary)] px-4 py-2.5 rounded-xl font-semibold hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[var(--color-primary-strong)] transition">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

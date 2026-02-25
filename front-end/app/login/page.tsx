"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone } from "lucide-react";
import { login } from "@/services/authService";

type AccountRole = "player" | "admin" ;

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "player" as AccountRole,
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasIdentifier = Boolean(formData.email.trim() || formData.phone.trim());

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasIdentifier) {
      setError("Enter email or phone number");
      return;
    }
    if (!formData.password.trim()) {
      setError("Enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const session = await login({
        role: formData.role,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        password: formData.password,
      });

      if (session.user.user_type === "admin") {
        router.replace("/dashboard");
        return;
      }
      router.replace("/turfs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-white dark:hidden" />
      <div
        className="absolute inset-0 bg-cover bg-left md:bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-white/70 dark:hidden" />
      <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(120deg,rgba(5,10,21,0.72)_0%,rgba(8,21,46,0.58)_48%,rgba(6,15,32,0.7)_100%)]" />
      <div className="absolute inset-0 opacity-15 dark:opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 w-full max-w-md surface-card rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Sign in to Match Hub</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Login with your role and credentials.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "player" as const, label: "Player" },
            { value: "admin" as const, label: "Admin" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: option.value }))}
              className={[
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                formData.role === option.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                  : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
              ].join(" ")}
              disabled={isLoading}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-10 pl-10"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="07XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className="h-10 pl-10"
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>
            <p className="text-[11px] text-gray-500">Provide at least one: email or phone.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                className="h-10 pl-10 pr-10"
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="h-10 w-full" disabled={isLoading || !hasIdentifier}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-300">No account yet? </span>
          <Link href="/signup" className="font-medium text-[var(--color-primary)] hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}

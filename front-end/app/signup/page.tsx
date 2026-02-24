"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { signup } from "@/services/authService";

type AccountRole = "player" | "admin";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "player" as AccountRole,
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = useMemo(
    () => [
      { label: "At least 6 characters", met: formData.password.length >= 6 },
      { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
      { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
      { label: "Contains number", met: /\d/.test(formData.password) },
    ],
    [formData.password]
  );

  const allPasswordChecksMet = passwordChecks.every((item) => item.met);
  const passwordsMatch =
    formData.password.length > 0 && formData.password === formData.confirmPassword;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Fill in name, email, and phone");
      return;
    }
    if (!allPasswordChecksMet) {
      setError("Password does not meet requirements");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const session = await signup({
        role: formData.role,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (session.user.user_type === "admin") {
        router.replace("/dashboard");
        return;
      }
      router.replace("/turfs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-white dark:hidden" />
      <div
        className="hidden dark:block absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,36,0.7)_0%,rgba(8,26,56,0.58)_45%,rgba(6,14,29,0.72)_100%)]" />
      <div className="absolute inset-0 opacity-15 dark:opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.16)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative z-10 w-full max-w-md surface-card rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-5">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Register as a player or a turf owner.
          </p>
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
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="h-10 pl-10"
                disabled={isLoading}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="h-10 pl-10"
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="h-10 pl-10"
                disabled={isLoading}
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Create password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-10 pl-10 pr-10"
                disabled={isLoading}
                required
                autoComplete="new-password"
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

            {formData.password ? (
              <div className="grid gap-1.5 pt-1">
                {passwordChecks.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[11px]">
                    <Check className={`h-3.5 w-3.5 ${item.met ? "text-[var(--color-secondary)]" : "text-gray-400"}`} />
                    <span className={item.met ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-10 pl-10 pr-10"
                disabled={isLoading}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.confirmPassword && !passwordsMatch ? (
              <p className="text-[11px] text-red-600 dark:text-red-300">Passwords do not match</p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="h-10 w-full"
            disabled={isLoading || !allPasswordChecksMet || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { requestOtp, verifyOtp } from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleRequestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    try {
      await requestOtp(phone.trim());
      setStep(2);
      setInfo("OTP sent. In current MVP backend, any OTP value is accepted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyOtp({
        phone: phone.trim(),
        otp: otp.trim(),
        name: name.trim(),
      });
      router.push("/turfs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-cover bg-left md:bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-white/30 dark:hidden" />
      <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,36,0.7)_0%,rgba(8,26,56,0.58)_45%,rgba(6,14,29,0.72)_100%)]" />
      <div className="absolute inset-0 opacity-15 dark:opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.16)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative z-10 w-full max-w-md surface-card rounded-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-black mb-2">Create Account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign up in two quick steps.</p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold mb-1">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white dark:bg-gray-900"
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Phone Number</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white dark:bg-gray-900"
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold mb-1">Email (optional)</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white dark:bg-gray-900"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">OTP sent to {phone}</p>
            <label className="block">
              <span className="block text-sm font-semibold mb-1">OTP Code</span>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-white dark:bg-gray-900"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full border border-[var(--color-border)] py-3 rounded-xl font-semibold hover:bg-[var(--surface-muted)] transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {error && <p className="text-sm text-[var(--color-primary-strong)] mt-4">{error}</p>}
        {info && <p className="text-sm text-[var(--color-primary)] mt-4">{info}</p>}

        {email && step === 2 && (
          <p className="text-xs text-gray-500 mt-3">
            Email capture is enabled in UI. Backend profile email save can be added in the next step.
          </p>
        )}

        <p className="text-sm mt-6 text-gray-600 dark:text-gray-300">
          Already have an account? <Link className="text-[var(--color-primary)] font-bold" href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

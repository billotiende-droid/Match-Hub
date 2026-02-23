"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { requestOtp, verifyOtp } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
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
      await verifyOtp({ phone: phone.trim(), otp: otp.trim() });
      router.push("/turfs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-gray-900 dark:text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white dark:hidden" />
      <div
        className="hidden dark:block absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div
        className="hidden dark:block absolute inset-0 bg-[linear-gradient(120deg,rgba(5,10,21,0.72)_0%,rgba(8,21,46,0.58)_48%,rgba(6,15,32,0.7)_100%)]"
      />
      <div className="absolute inset-0 opacity-15 dark:opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 w-full max-w-md surface-card rounded-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-black mb-2">Login</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Use your phone number to sign in.</p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
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
              {loading ? "Verifying..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full border border-[var(--color-border)] py-3 rounded-xl font-semibold hover:bg-[var(--surface-muted)] transition-colors"
            >
              Change Phone Number
            </button>
          </form>
        )}

        {error && <p className="text-sm text-[var(--color-primary-strong)] mt-4">{error}</p>}
        {info && <p className="text-sm text-[var(--color-primary)] mt-4">{info}</p>}

        <p className="text-sm mt-6 text-gray-600 dark:text-gray-300">
          New to Match Hub? <Link className="text-[var(--color-primary)] font-bold" href="/signup">Create account</Link>
        </p>
      </div>
    </main>
  );
}

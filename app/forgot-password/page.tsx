"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Turnstile } from "@/components/ui/Turnstile";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/careers/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: token }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message || "Something went wrong.");
        setResetSignal((s) => s + 1);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto surface overflow-hidden">
          <div className="bg-[#1a3a52] px-6 py-8 text-center text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d41f3d] via-amber-500 to-[#d41f3d]" />
            <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
            <p className="text-slate-300 text-sm mt-1 font-light">We&apos;ll email you a secure reset link</p>
          </div>

          <div className="p-6 sm:p-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-slate-600">
                  If an account exists for <strong className="text-[#1a3a52]">{email}</strong>, a password reset link is on its way. The link expires in 30 minutes.
                </p>
                <Link href="/login" className="inline-block text-sm font-bold text-[#1a3a52] hover:underline">Back to sign in</Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                <p className="text-sm text-slate-600">Enter the email associated with your account.</p>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
                  />
                </div>
                <Turnstile onVerify={setToken} onExpire={() => setToken("")} resetSignal={resetSignal} />
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
                <p className="text-center text-sm text-slate-500">
                  <Link href="/login" className="font-bold text-[#1a3a52] hover:underline">Back to sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

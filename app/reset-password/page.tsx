"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/careers/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push("/login"), 1800);
      } else {
        setError(data.message || "Could not reset password.");
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
            <h1 className="text-2xl font-bold tracking-tight">Choose a new password</h1>
          </div>

          <div className="p-6 sm:p-8">
            {!token ? (
              <p className="text-sm text-red-700">This reset link is invalid. Please request a new one from the <Link href="/forgot-password" className="font-bold underline">forgot password</Link> page.</p>
            ) : done ? (
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-slate-600">Password updated. Redirecting you to sign in…</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">At least 8 characters, with a letter and a number.</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Updating…" : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}

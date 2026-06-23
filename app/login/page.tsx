"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Turnstile } from "@/components/ui/Turnstile";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/careers";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/careers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe, turnstileToken: token }),
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("account-auth-change"));
        router.push(returnUrl);
      } else if (data.needsVerification) {
        router.push(`/register?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        setError(data.message || "Sign in failed.");
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
            <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-slate-300 text-sm mt-1 font-light">PEPPL Careers Portal</p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="yourname@gmail.com"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Password</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#d41f3d] focus:ring-[#d41f3d]"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#d41f3d] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Turnstile onVerify={setToken} onExpire={() => setToken("")} resetSignal={resetSignal} />

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <p className="text-center text-sm text-slate-500">
                New here?{" "}
                <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`} className="font-bold text-[#1a3a52] hover:underline">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CareersLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

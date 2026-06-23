"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Turnstile } from "@/components/ui/Turnstile";
import { PhoneInput } from "@/components/ui/PhoneInput";

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/careers";

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/careers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          acceptedTerms,
          turnstileToken: token,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message || "Registration failed.");
        setResetSignal((s) => s + 1);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/careers/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code }),
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("account-auth-change"));
        router.push(returnUrl);
      } else {
        setError(data.message || "Verification failed.");
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
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-slate-300 text-sm mt-1 font-light">
              {step === 1 ? "Join the PEPPL Careers Portal" : "Verify your email to finish"}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {step === 1 ? (
              <form onSubmit={submitRegister} className="space-y-4">
                <Field label="Full Name" value={form.name} onChange={set("name")} required autoComplete="name" placeholder="e.g. Rohan Sharma" />
                <Field label="Email" type="email" value={form.email} onChange={set("email")} required autoComplete="email" placeholder="yourname@gmail.com" />
                <PhoneInput onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
                <Field label="Password" type="password" value={form.password} onChange={set("password")} required autoComplete="new-password" hint="At least 8 characters, with a letter and a number." />
                <Field label="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} required autoComplete="new-password" />

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#d41f3d] focus:ring-[#d41f3d]"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="/terms" target="_blank" className="font-semibold text-[#1a3a52] underline">Terms &amp; Conditions</Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="font-semibold text-[#1a3a52] underline">Privacy Policy</Link>.
                  </span>
                </label>

                <Turnstile onVerify={setToken} onExpire={() => setToken("")} resetSignal={resetSignal} />

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="font-bold text-[#1a3a52] hover:underline">Sign in</Link>
                </p>
              </form>
            ) : (
              <form onSubmit={submitVerify} className="space-y-5">
                <p className="text-sm text-slate-600">
                  We sent a 6-digit verification code to <strong className="text-[#1a3a52]">{form.email}</strong>. Enter it below to activate your account. This one-time step verifies your email — afterwards you&apos;ll sign in with your password.
                </p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  placeholder="••••••"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] text-center text-2xl font-mono tracking-[0.5em] p-3"
                />
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Verifying…" : "Verify & Continue"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function Field({
  label, hint, ...props
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">{label}</label>
      <input
        {...props}
        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] p-2.5 text-sm"
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export default function CareersRegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}

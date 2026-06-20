"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export default function SupplierRegister() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message || "Failed to register.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("supplier", JSON.stringify(data.supplier));
        window.dispatchEvent(new Event("supplier-auth-change"));
        router.push("/supplier");
      } else {
        setError(data.message || "Invalid OTP code.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto surface overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a3a52] px-6 py-8 text-center text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d41f3d] via-amber-500 to-[#d41f3d]" />
            <div className="mx-auto h-12 w-12 bg-white rounded flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Supplier Registration</h1>
            <p className="text-slate-300 text-sm mt-1 font-light">Partner with PEPL</p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#d41f3d]' : 'bg-slate-200'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#d41f3d]' : 'bg-slate-200'}`} />
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={requestRegistration} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">
                    Company / Individual Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] text-sm p-2.5 border"
                    placeholder="e.g. Acme Fabrication"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] text-sm p-2.5 border"
                    placeholder="contact@company.com"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">We'll send a code to this email to verify your account.</p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#1a3a52] hover:bg-[#0f1f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3a52] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Registering..." : "Register & Get Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Code sent to</p>
                  <p className="text-sm font-medium text-[#1a3a52] mt-1">{email}</p>
                </div>
                
                <div>
                  <label htmlFor="code" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] text-center text-2xl font-mono tracking-widest p-3 border"
                    placeholder="------"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#d41f3d] hover:bg-[#b01830] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d41f3d] disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Verifying..." : "Verify & Access Portal"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
              Already have an account?{" "}
              <Link href="/supplier-login" className="font-bold text-[#1a3a52] hover:text-[#d41f3d] hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

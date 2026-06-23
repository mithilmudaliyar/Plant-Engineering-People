"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export default function EmployeeLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        // Store a non-sensitive display copy; real authz is the httpOnly session cookie.
        localStorage.setItem("employee", JSON.stringify(data.employee));
        window.dispatchEvent(new Event("employee-auth-change"));
        router.push("/employee");
      } else {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto surface overflow-hidden">
          <div className="bg-[#1a3a52] px-6 py-8 text-center text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d41f3d] via-amber-500 to-[#d41f3d]" />
            <div className="mx-auto h-12 w-12 bg-white rounded flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain rounded-full" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Portal</h1>
            <p className="text-slate-300 text-sm mt-1 font-light">Internal Operations Access</p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">PEPPL Email Address</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] text-sm p-2.5 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">Password</label>
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a3a52] focus:ring-[#1a3a52] text-sm p-2.5 border"
                />
              </div>
              
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#1a3a52] hover:bg-[#0f1f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3a52] disabled:opacity-50 transition-colors"
              >
                {loading ? "Authenticating..." : "Sign In to Operations"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

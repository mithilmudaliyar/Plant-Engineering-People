"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [account, setAccount] = useState<{ id: number; email: string; name: string } | null>(null);
  const [employee, setEmployee] = useState<{ id: number; email: string; name: string; role: string } | null>(null);

  const isHomePage = pathname === "/";

  const checkAuth = () => {
    // Unified external account — identity from the secure session cookie.
    fetch("/api/careers/me")
      .then((r) => r.json())
      .then((d) => setAccount(d.authenticated ? d.applicant : null))
      .catch(() => setAccount(null));
    // Staff (mostly on the staff subdomain) — display copy in localStorage.
    try {
      const savedEmployee = localStorage.getItem("employee");
      setEmployee(savedEmployee ? JSON.parse(savedEmployee) : null);
    } catch { setEmployee(null); }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("account-auth-change", checkAuth);
    window.addEventListener("employee-auth-change", checkAuth);
    return () => {
      window.removeEventListener("account-auth-change", checkAuth);
      window.removeEventListener("employee-auth-change", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    // Clear both possible sessions (unified account + staff); no-ops if absent.
    fetch("/api/careers/logout", { method: "POST" }).catch(() => {});
    fetch("/api/employee/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("employee");
    setAccount(null);
    setEmployee(null);
    window.dispatchEvent(new Event("account-auth-change"));
    window.dispatchEvent(new Event("employee-auth-change"));
    router.push("/");
    setMobileOpen(false);
  };

  const headerBg = isHomePage && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm";

  const logoTextColor = isHomePage && !scrolled ? "text-white" : "text-[#0C1B33]";
  const navTextColor = isHomePage && !scrolled
    ? "text-white/85 hover:text-white"
    : "text-slate-600 hover:text-[#0C1B33]";
  const activeNavColor = isHomePage && !scrolled
    ? "text-orange-400 border-b-2 border-orange-400"
    : "text-orange-500 border-b-2 border-orange-500";

  const positionClass = isHomePage ? "fixed w-full" : "sticky top-0";

  return (
    <header className={`${positionClass} z-50 border-b transition-all duration-300 ${headerBg}`}>
      <Container>
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          {/* Logo */}
          <Link href="/" className="group flex cursor-pointer items-center gap-0 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
              <Image src="/logo.png" alt={`${site.company.name} Logo`} width={48} height={48} className="object-contain rounded-full" priority />
            </div>
            <div className={`flex flex-col leading-tight pl-3 transition-colors ${logoTextColor}`}>
              <span className="text-[13px] sm:text-sm font-extrabold tracking-tight">
                Plant Engineering People Pvt. Ltd.
              </span>
              <span className={`hidden sm:block text-[10px] font-medium tracking-wide sm:opacity-70 ${isHomePage && !scrolled ? "text-white" : "text-[#0C1B33] sm:text-slate-500"}`}>{site.company.shortName}</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex flex-1 ml-8">
            {site.navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-sm cursor-pointer ${
                    active ? activeNavColor : navTextColor
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/contact"
              className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Get a Quote
            </Link>

            {employee ? (
              <div className="flex items-center gap-2">
                <Link href="/employee" className="px-4 py-2 text-sm font-semibold text-white bg-[#0C1B33] rounded-xl hover:bg-[#08111f] transition-colors whitespace-nowrap">
                  Staff Portal
                </Link>
                <button onClick={handleSignOut} className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer">
                  Sign Out
                </button>
              </div>
            ) : account ? (
              <div className="flex items-center gap-2">
                <Link href="/supplier" className="px-4 py-2 text-sm font-semibold text-white bg-[#0C1B33] rounded-xl hover:bg-[#08111f] transition-colors whitespace-nowrap">
                  My Portal
                </Link>
                <button onClick={handleSignOut} className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 text-sm font-semibold border rounded-xl transition-colors cursor-pointer ${
                  isHomePage && !scrolled
                    ? "border-white/40 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-700 hover:border-[#0C1B33] hover:text-[#0C1B33]"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`inline-flex md:hidden items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
              isHomePage && !scrolled
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-slate-300 text-[#0C1B33] hover:bg-slate-50"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-slate-200 bg-white py-4 space-y-1">
            {site.navigation.map((item) => (
              <Link key={item.href} href={item.href}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-lg cursor-pointer ${pathname === item.href ? "text-orange-500 bg-orange-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#0C1B33]"}`}
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-2 border-t border-slate-100 mt-2">
              {employee ? (
                <>
                  <Link href="/employee" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-xl bg-[#0C1B33] px-4 py-2.5 text-sm font-bold text-white cursor-pointer">Staff Portal</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer">Sign Out</button>
                </>
              ) : account ? (
                <>
                  <Link href="/supplier" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-xl bg-[#0C1B33] px-4 py-2.5 text-sm font-bold text-white cursor-pointer">My Portal</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">Login</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">Create account</Link>
                </>
              )}
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer">Get a Quote</Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}

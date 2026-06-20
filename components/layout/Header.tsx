"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loginMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [supplier, setSupplier] = useState<{ id: number; email: string; name?: string } | null>(null);
  const [employee, setEmployee] = useState<{ id: number; email: string; name: string; role: string } | null>(null);

  const isHomePage = pathname === "/";

  const checkAuth = () => {
    try {
      const savedSupplier = localStorage.getItem("supplier");
      setSupplier(savedSupplier ? JSON.parse(savedSupplier) : null);
    } catch { setSupplier(null); }
    try {
      const savedEmployee = localStorage.getItem("employee");
      setEmployee(savedEmployee ? JSON.parse(savedEmployee) : null);
    } catch { setEmployee(null); }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("supplier-auth-change", checkAuth);
    window.addEventListener("employee-auth-change", checkAuth);
    return () => {
      window.removeEventListener("supplier-auth-change", checkAuth);
      window.removeEventListener("employee-auth-change", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (loginMenuRef.current && !loginMenuRef.current.contains(e.target as Node)) setLoginOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("supplier");
    localStorage.removeItem("employee");
    window.dispatchEvent(new Event("supplier-auth-change"));
    window.dispatchEvent(new Event("employee-auth-change"));
    router.push("/");
    setMobileOpen(false);
  };

  // On homepage, header starts transparent over hero; on scroll becomes solid
  const headerBg = isHomePage && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-white border-gray-200 shadow-sm";

  const logoTextColor = isHomePage && !scrolled ? "text-white" : "text-[#1a3a52]";
  const navTextColor = isHomePage && !scrolled ? "text-white/90 hover:text-white" : "text-gray-700 hover:text-[#1a3a52]";
  const activeNavColor = isHomePage && !scrolled ? "text-amber-400 border-b-2 border-amber-400" : "text-[#d41f3d] border-b-2 border-[#d41f3d]";

  const positionClass = isHomePage ? "fixed w-full" : "sticky top-0";

  return (
    <header className={`${positionClass} z-50 border-b transition-all duration-300 ${headerBg}`}>
      <Container>
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          {/* Logo — L&T style dark block */}
          <Link href="/" className="group flex cursor-pointer items-center gap-0 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt={`${site.company.name} Logo`} width={48} height={48} className="object-contain" priority />
            </div>
            <div className={`flex flex-col leading-tight pl-3 transition-colors ${logoTextColor}`}>
              <span className="hidden sm:block text-sm font-extrabold tracking-tight">{site.company.shortName}</span>
              <span className={`text-[13px] sm:text-[10px] font-bold sm:font-medium sm:opacity-70 ${isHomePage && !scrolled ? "text-white" : "text-[#1a3a52] sm:text-gray-500"}`}>
                Plant Engineering People
              </span>
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
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-sm ${
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
              className="rounded-md bg-[#d41f3d] px-5 py-2 text-sm font-bold text-white hover:bg-[#b01830] transition-colors whitespace-nowrap"
            >
              Get a Quote
            </Link>

            {employee ? (
              <div className="flex items-center gap-2">
                <Link href="/employee" className="px-4 py-2 text-sm font-semibold text-white bg-[#1a3a52] rounded-md hover:bg-[#0f1f2e] transition-colors whitespace-nowrap">
                  Staff Portal
                </Link>
                <button onClick={handleSignOut} className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:border-[#d41f3d] hover:text-[#d41f3d] transition-colors cursor-pointer">
                  Sign Out
                </button>
              </div>
            ) : supplier ? (
              <div className="flex items-center gap-2">
                <Link href="/supplier" className="px-4 py-2 text-sm font-semibold text-white bg-[#1a3a52] rounded-md hover:bg-[#0f1f2e] transition-colors whitespace-nowrap">
                  Supplier Portal
                </Link>
                <button onClick={handleSignOut} className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:border-[#d41f3d] hover:text-[#d41f3d] transition-colors cursor-pointer">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="relative" ref={loginMenuRef}>
                <button
                  type="button"
                  onClick={() => setLoginOpen((v) => !v)}
                  aria-expanded={loginOpen}
                  className={`px-4 py-2 text-sm font-semibold border rounded-md transition-colors cursor-pointer ${
                    isHomePage && !scrolled
                      ? "border-white/40 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:border-[#1a3a52] hover:text-[#1a3a52]"
                  }`}
                >
                  Login ▾
                </button>
                {loginOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    <Link href="/supplier-login" onClick={() => setLoginOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d41f3d] border-b border-gray-100">
                      Supplier Portal
                    </Link>
                    <Link href="/employee-login" onClick={() => setLoginOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-[#d41f3d]">
                      Employee Portal
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`inline-flex md:hidden items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              isHomePage && !scrolled
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-gray-300 text-[#1a3a52] hover:bg-gray-50"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
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
          <nav className="md:hidden border-t border-gray-200 bg-white py-4 space-y-1">
            {site.navigation.map((item) => (
              <Link key={item.href} href={item.href}
                className={`block px-4 py-2.5 text-sm font-semibold rounded-md ${pathname === item.href ? "text-[#d41f3d] bg-red-50" : "text-gray-700 hover:bg-gray-50 hover:text-[#1a3a52]"}`}
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="pt-2 px-4 space-y-2 border-t border-gray-100 mt-2">
              {employee ? (
                <>
                  <Link href="/employee" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-md bg-[#1a3a52] px-4 py-2.5 text-sm font-bold text-white">Staff Portal</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md cursor-pointer">Sign Out</button>
                </>
              ) : supplier ? (
                <>
                  <Link href="/supplier" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-md bg-[#1a3a52] px-4 py-2.5 text-sm font-bold text-white">Supplier Portal</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md cursor-pointer">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/supplier-login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md">Supplier Login</Link>
                  <Link href="/supplier-register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md">Register</Link>
                  <Link href="/employee-login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md">Employee Login</Link>
                </>
              )}
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-md bg-[#d41f3d] px-4 py-2.5 text-sm font-bold text-white">Get a Quote</Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}

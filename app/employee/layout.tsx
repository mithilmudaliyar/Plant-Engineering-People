"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/employee", label: "Dashboard", exact: true },
  { href: "/employee/inquiries", label: "Inquiries" },
  { href: "/employee/news", label: "News" },
  { href: "/employee/jobs", label: "Jobs" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    await fetch("/api/employee/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("employee");
    router.push("/employee-login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/employee" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="PEPPL" width={28} height={28} className="rounded-full" />
              <span className="text-sm font-bold text-[#0C1B33]">Staff Portal</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    (item.exact ? pathname === item.href : pathname.startsWith(item.href))
                      ? "text-[#d41f3d] bg-red-50"
                      : "text-slate-600 hover:text-[#0C1B33] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={signOut}
            className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

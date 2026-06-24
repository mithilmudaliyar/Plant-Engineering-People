"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState<{ name: string; role: string } | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) { router.push("/employee-login"); return; }
    setEmployee(JSON.parse(saved));
    fetch("/api/employee/inquiries")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUnread(d.inquiries.filter((i: { read: boolean }) => !i.read).length); })
      .catch(() => {});
  }, [router]);

  if (!employee) return null;

  const sections = [
    {
      href: "/employee/inquiries",
      title: "Inquiries",
      desc: "Contact form submissions from the website.",
      badge: unread > 0 ? unread : null,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/employee/news",
      title: "News",
      desc: "Publish company announcements and updates.",
      badge: null,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      href: "/employee/jobs",
      title: "Job Openings",
      desc: "Post roles and review candidate applications.",
      badge: null,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-14">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#d41f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Internal Operations</span>
            </div>
            <h1 className="text-3xl font-black text-[#0C1B33]">Welcome back, {employee.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Select a section to get started.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="surface p-6 hover:shadow-md transition-all group block relative"
              >
                {s.badge && (
                  <span className="absolute top-4 right-4 bg-[#d41f3d] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-tight">
                    {s.badge}
                  </span>
                )}
                <div className="text-[#d41f3d] mb-3">{s.icon}</div>
                <h2 className="font-black text-[#0C1B33] mb-1 group-hover:text-[#d41f3d] transition-colors">{s.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

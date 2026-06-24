"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type Inquiry = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function InquiriesPage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) { router.push("/employee-login"); return; }
    setEmployee(JSON.parse(saved));
    fetchInquiries();
  }, [router]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/employee/inquiries");
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const markRead = async (id: number, read: boolean) => {
    await fetch("/api/employee/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, read } : i));
  };

  const handleExpand = (id: number) => {
    setExpanded((prev) => prev === id ? null : id);
    const inquiry = inquiries.find((i) => i.id === id);
    if (inquiry && !inquiry.read) markRead(id, true);
  };

  const filtered = filter === "unread" ? inquiries.filter((i) => !i.read) : inquiries;
  const unreadCount = inquiries.filter((i) => !i.read).length;

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-[#d41f3d]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Staff Portal</span>
            </div>
            <h1 className="text-3xl font-black text-[#1a3a52]">Contact Inquiries</h1>
            <p className="mt-1 text-sm text-slate-500">
              {unreadCount > 0 ? (
                <span className="font-semibold text-[#d41f3d]">{unreadCount} unread</span>
              ) : (
                "All caught up"
              )}{" "}
              · {inquiries.length} total
            </p>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setFilter("unread")} className={`px-4 py-2 text-sm font-bold transition-colors ${filter === "unread" ? "bg-[#1a3a52] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                Unread {unreadCount > 0 && <span className="ml-1 bg-[#d41f3d] text-white rounded-full px-1.5 py-0.5 text-[10px]">{unreadCount}</span>}
              </button>
              <button onClick={() => setFilter("all")} className={`px-4 py-2 text-sm font-bold transition-colors ${filter === "all" ? "bg-[#1a3a52] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                All
              </button>
            </div>
            <Link href="/employee" className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/employee/logout", { method: "POST" }).catch(() => {});
                localStorage.removeItem("employee");
                router.push("/");
              }}
              className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-16 text-slate-400 font-semibold uppercase tracking-widest text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 surface">
            <p className="text-slate-400 text-sm">
              {filter === "unread" ? "No unread inquiries." : "No inquiries yet."}
            </p>
            {filter === "unread" && (
              <button onClick={() => setFilter("all")} className="mt-3 text-sm font-bold text-[#1a3a52] hover:underline">
                View all inquiries
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {filtered.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`overflow-hidden transition-all rounded-xl border ${inquiry.read ? "border-slate-200 bg-white" : "border-slate-200 bg-red-50/40"}`}
              >
                <button
                  className="w-full text-left px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                  onClick={() => handleExpand(inquiry.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!inquiry.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-[#d41f3d] shrink-0" />
                      )}
                      <p className="font-bold text-[#1a3a52] truncate">{inquiry.name}</p>
                      {inquiry.company && (
                        <span className="text-xs text-slate-400">· {inquiry.company}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{inquiry.email}</p>
                    <p className="text-xs text-slate-400 mt-1 truncate">{inquiry.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">{new Date(inquiry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <svg className={`w-4 h-4 text-slate-400 mt-2 ml-auto transition-transform ${expanded === inquiry.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expanded === inquiry.id && (
                  <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                    <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm bg-slate-50 rounded-lg p-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Name</p>
                        <p className="font-semibold text-[#1a3a52]">{inquiry.name}</p>
                      </div>
                      {inquiry.company && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</p>
                          <p className="font-semibold text-[#1a3a52]">{inquiry.company}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                        <a href={`mailto:${inquiry.email}`} className="font-semibold text-[#d41f3d] hover:underline break-all">{inquiry.email}</a>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-white border border-slate-100 rounded-lg p-4">{inquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: Your inquiry to PEPPL`}
                        className="inline-flex items-center gap-2 bg-[#1a3a52] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0f1f2e] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Reply via Email
                      </a>
                      <button
                        onClick={() => markRead(inquiry.id, !inquiry.read)}
                        className="text-sm text-slate-500 hover:text-[#1a3a52] font-semibold transition-colors"
                      >
                        {inquiry.read ? "Mark as unread" : "Mark as read"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

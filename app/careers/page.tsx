"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type Job = {
  id: number; title: string; department: string; location: string;
  employmentType: string; experience: string | null; postedAt: string;
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [loc, setLoc] = useState("All");

  useEffect(() => {
    fetch("/api/careers/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.department)))], [jobs]);
  const locations = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.location)))], [jobs]);

  const filtered = jobs.filter((j) => {
    const q = query.toLowerCase();
    return (
      (dept === "All" || j.department === dept) &&
      (loc === "All" || j.location === loc) &&
      (!q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Careers</span>
            <span className="h-px w-6 bg-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52]">Build Critical Infrastructure With Us</h1>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            Join a DAE-approved engineering team working on India&apos;s most demanding nuclear, chemical, and industrial projects. Explore current openings below.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles…"
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]"
          />
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]">
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={loc} onChange={(e) => setLoc(e.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]">
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="surface h-24 skeleton" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center surface p-12">
              <p className="text-slate-500">{jobs.length === 0 ? "No open positions right now. Please check back soon." : "No roles match your filters."}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">{filtered.length} open position{filtered.length !== 1 ? "s" : ""}</p>
              <div className="space-y-3">
                {filtered.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/${job.id}`}
                    className="surface p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:border-[#d41f3d]/40 hover:shadow-md transition-all group"
                  >
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-[#1a3a52] group-hover:text-[#d41f3d] transition-colors">{job.title}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><Dot /> {job.department}</span>
                        <span className="inline-flex items-center gap-1.5"><Pin /> {job.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock /> {job.employmentType}</span>
                        {job.experience && <span className="inline-flex items-center gap-1.5"><Badge /> {job.experience}</span>}
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1a3a52] px-5 py-2.5 text-sm font-bold text-white group-hover:bg-[#d41f3d] transition-colors">
                      View &amp; Apply
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

const Dot = () => <span className="h-1.5 w-1.5 rounded-full bg-[#d41f3d]" />;
const Pin = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const Clock = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Badge = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

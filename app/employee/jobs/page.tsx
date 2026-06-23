"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type Job = {
  id: number; title: string; department: string; location: string;
  employmentType: string; experience: string | null; description: string;
  responsibilities: string | null; requirements: string | null; status: string;
  _count: { applications: number };
};

type Application = {
  id: number; coverLetter: string | null; resumeUrl: string | null; status: string; createdAt: string;
  applicant: { name: string; email: string; phone: string | null };
};

const empty = {
  id: 0, title: "", department: "", location: "Tarapur, Maharashtra", employmentType: "Full-time",
  experience: "", description: "", responsibilities: "", requirements: "", status: "OPEN",
};

export default function EmployeeJobsManager() {
  const router = useRouter();
  const [actorEmail, setActorEmail] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) { router.push("/employee-login"); return; }
    try { setActorEmail(JSON.parse(saved).email); } catch { router.push("/employee-login"); }
  }, [router]);

  const load = useCallback(async () => {
    const res = await fetch("/api/employee/jobs");
    if (res.status === 401) { router.push("/employee-login"); return; }
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { if (actorEmail) load(); }, [actorEmail, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/employee/jobs", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, actorEmail }),
    });
    const data = await res.json();
    if (data.success) { setForm({ ...empty }); setEditing(false); setMsg(editing ? "Job updated." : "Job posted."); load(); }
    else setMsg(data.message || "Failed.");
  };

  const edit = (j: Job) => {
    setForm({
      id: j.id, title: j.title, department: j.department, location: j.location,
      employmentType: j.employmentType, experience: j.experience || "", description: j.description,
      responsibilities: j.responsibilities || "", requirements: j.requirements || "", status: j.status,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this job and all its applications?")) return;
    await fetch("/api/employee/jobs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, actorEmail }) });
    load();
  };

  const toggleStatus = async (j: Job) => {
    await fetch("/api/employee/jobs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: j.id, status: j.status === "OPEN" ? "CLOSED" : "OPEN", actorEmail }) });
    load();
  };

  const viewApps = async (j: Job) => {
    setViewing(j);
    setApps([]);
    const res = await fetch(`/api/employee/jobs/applications?jobId=${j.id}&actorEmail=${encodeURIComponent(actorEmail || "")}`);
    const data = await res.json();
    setApps(data.applications || []);
  };

  const field = "block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]";
  const lbl = "block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1a3a52]">Job Openings</h1>
              <p className="text-sm text-slate-500 mt-1">Post roles and review candidate applications.</p>
            </div>
            <Link href="/employee" className="text-sm font-semibold text-slate-500 hover:text-[#d41f3d]">← Back to portal</Link>
          </div>

          {msg && <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{msg}</div>}

          <form onSubmit={submit} className="surface p-6 mb-10 space-y-4">
            <h2 className="font-bold text-[#1a3a52]">{editing ? "Edit job" : "New job opening"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lbl}>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={field} /></div>
              <div><label className={lbl}>Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required className={field} /></div>
              <div><label className={lbl}>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className={field} /></div>
              <div><label className={lbl}>Experience (e.g. 3–5 years)</label><input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={field} /></div>
              <div>
                <label className={lbl}>Employment Type</label>
                <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className={field}>
                  {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
                  {["OPEN", "CLOSED"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div><label className={lbl}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className={field} /></div>
            <div><label className={lbl}>Responsibilities (one per line)</label><textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} className={field} /></div>
            <div><label className={lbl}>Requirements (one per line)</label><textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} className={field} /></div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-[#d41f3d] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#b01830]">{editing ? "Save changes" : "Post job"}</button>
              {editing && <button type="button" onClick={() => { setForm({ ...empty }); setEditing(false); }} className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-600">Cancel</button>}
            </div>
          </form>

          <h2 className="font-bold text-[#1a3a52] mb-4">All jobs ({jobs.length})</h2>
          {loading ? <p className="text-slate-400">Loading…</p> : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${j.status === "OPEN" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{j.status}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{j.department} · {j.location}</span>
                    </div>
                    <p className="font-bold text-[#1a3a52] truncate mt-1">{j.title}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button onClick={() => viewApps(j)} className="text-xs font-semibold text-[#1a3a52] border border-slate-300 rounded-lg px-3 py-1.5">Applications ({j._count.applications})</button>
                    <button onClick={() => toggleStatus(j)} className="text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5">{j.status === "OPEN" ? "Close" : "Reopen"}</button>
                    <button onClick={() => edit(j)} className="text-xs font-semibold text-[#1a3a52] border border-slate-300 rounded-lg px-3 py-1.5">Edit</button>
                    <button onClick={() => remove(j.id)} className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1.5">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Applications drawer */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={() => setViewing(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a3a52]">Applications · {viewing.title}</h3>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            {apps.length === 0 ? <p className="text-sm text-slate-400">No applications yet.</p> : (
              <div className="space-y-4">
                {apps.map((a) => (
                  <div key={a.id} className="border border-slate-200 rounded-xl p-4">
                    <p className="font-bold text-[#1a3a52]">{a.applicant.name}</p>
                    <p className="text-xs text-slate-500">{a.applicant.email}{a.applicant.phone ? ` · ${a.applicant.phone}` : ""}</p>
                    {a.resumeUrl && <a href={a.resumeUrl.startsWith("http") ? a.resumeUrl : `/api/employee/applications/resume?path=${encodeURIComponent(a.resumeUrl)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-[#d41f3d] hover:underline">View resume →</a>}
                    {a.coverLetter && <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{a.coverLetter}</p>}
                    <p className="mt-2 text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

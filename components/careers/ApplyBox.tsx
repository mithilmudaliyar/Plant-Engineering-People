"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function ApplyBox({ jobId, jobTitle }: { jobId: number; jobTitle: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<"loading" | "guest" | "ready" | "applied">("loading");
  const [name, setName] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/careers/apply?jobId=${jobId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) setState("guest");
        else if (d.applied) setState("applied");
        else { setName(d.name || null); setState("ready"); }
      })
      .catch(() => setState("guest"));
  }, [jobId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let finalResume = resumeUrl.trim();

      // If a file was chosen, upload it first; fall back to the link if storage
      // isn't configured.
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/careers/upload-resume", { method: "POST", body: fd });
        const upData = await up.json();
        if (upData.success) {
          finalResume = upData.path;
        } else if (upData.notConfigured) {
          if (!finalResume) {
            setError("File uploads aren't enabled yet — please paste a resume link instead.");
            setSubmitting(false);
            return;
          }
        } else {
          setError(upData.message || "Resume upload failed.");
          setSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, coverLetter, resumeUrl: finalResume }),
      });
      const data = await res.json();
      if (data.success) setState("applied");
      else setError(data.message || "Could not submit application.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (state === "loading") return <div className="surface p-6 h-24 skeleton" />;

  if (state === "applied") {
    return (
      <div className="surface p-6 flex items-center gap-3 border border-emerald-200 bg-emerald-50">
        <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        <p className="text-sm font-semibold text-emerald-800">Application submitted — thank you! Our team will review it and reach out.</p>
      </div>
    );
  }

  if (state === "guest") {
    const ret = encodeURIComponent(pathname);
    return (
      <div className="surface p-8 text-center">
        <h3 className="text-lg font-bold text-[#1a3a52]">Ready to apply?</h3>
        <p className="mt-2 text-sm text-slate-500">Sign in or create a free candidate account to apply for <strong>{jobTitle}</strong>.</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/login?returnUrl=${ret}`} className="rounded-xl bg-[#d41f3d] px-6 py-3 text-sm font-bold text-white hover:bg-[#b01830]">Sign in</Link>
          <Link href={`/register?returnUrl=${ret}`} className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="surface p-8">
      <h3 className="text-lg font-bold text-[#1a3a52]">Apply for this position</h3>
      {name && <p className="mt-1 text-sm text-slate-500">Applying as <strong className="text-[#1a3a52]">{name}</strong></p>}
      {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Resume (PDF or Word, max 5 MB)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#1a3a52] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#0f1f2e]"
          />
        </div>
        <div className="relative text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 bg-white px-2 relative z-10">or paste a link</span>
          <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Resume link (Google Drive, Dropbox, etc.)</label>
          <input
            value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://…"
            className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Cover note (optional)</label>
          <textarea
            value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5}
            placeholder="Tell us why you're a great fit…"
            className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]"
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="mt-5 w-full rounded-xl bg-[#d41f3d] px-4 py-3 text-sm font-bold text-white hover:bg-[#b01830] disabled:opacity-50">
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

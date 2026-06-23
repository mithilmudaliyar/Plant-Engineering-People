"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type Post = {
  id: number; title: string; slug: string; category: string;
  excerpt: string | null; body: string; imageUrl: string | null;
  published: boolean; createdAt: string;
};

const CATEGORIES = ["Announcement", "Project Win", "Hiring", "Update"];
const empty = { id: 0, title: "", category: "Announcement", excerpt: "", content: "", imageUrl: "", published: false };

export default function EmployeeNewsManager() {
  const router = useRouter();
  const [actorEmail, setActorEmail] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("employee");
    if (!saved) { router.push("/employee-login"); return; }
    try { setActorEmail(JSON.parse(saved).email); } catch { router.push("/employee-login"); }
  }, [router]);

  const load = useCallback(async () => {
    const res = await fetch("/api/employee/news");
    if (res.status === 401) { router.push("/employee-login"); return; }
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { if (actorEmail) load(); }, [actorEmail, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const method = editing ? "PUT" : "POST";
    const res = await fetch("/api/employee/news", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, actorEmail }),
    });
    const data = await res.json();
    if (data.success) {
      setForm({ ...empty }); setEditing(false); setMsg(editing ? "Post updated." : "Post created.");
      load();
    } else {
      setMsg(data.message || "Failed.");
    }
  };

  const edit = (p: Post) => {
    setForm({ id: p.id, title: p.title, category: p.category, excerpt: p.excerpt || "", content: p.body, imageUrl: p.imageUrl || "", published: p.published });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/employee/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, actorEmail }),
    });
    load();
  };

  const togglePublish = async (p: Post) => {
    await fetch("/api/employee/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published, actorEmail }),
    });
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1a3a52]">News Management</h1>
              <p className="text-sm text-slate-500 mt-1">Create and publish company news &amp; announcements.</p>
            </div>
            <Link href="/employee" className="text-sm font-semibold text-slate-500 hover:text-[#d41f3d]">← Back to portal</Link>
          </div>

          {msg && <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{msg}</div>}

          <form onSubmit={submit} className="surface p-6 mb-10 space-y-4">
            <h2 className="font-bold text-[#1a3a52]">{editing ? "Edit post" : "New post"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Image URL (optional)</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Excerpt (short summary)</label>
              <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">Body</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={6} className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-[#d41f3d] focus:ring-[#d41f3d]" />
              Publish immediately
            </label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-[#d41f3d] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#b01830]">{editing ? "Save changes" : "Create post"}</button>
              {editing && <button type="button" onClick={() => { setForm({ ...empty }); setEditing(false); }} className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-600">Cancel</button>}
            </div>
          </form>

          <h2 className="font-bold text-[#1a3a52] mb-4">All posts ({posts.length})</h2>
          {loading ? <p className="text-slate-400">Loading…</p> : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="surface p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{p.published ? "Published" : "Draft"}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{p.category}</span>
                    </div>
                    <p className="font-bold text-[#1a3a52] truncate mt-1">{p.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => togglePublish(p)} className="text-xs font-semibold text-slate-600 hover:text-[#1a3a52] border border-slate-300 rounded-lg px-3 py-1.5">{p.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => edit(p)} className="text-xs font-semibold text-[#1a3a52] border border-slate-300 rounded-lg px-3 py-1.5">Edit</button>
                    <button onClick={() => remove(p.id)} className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1.5">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

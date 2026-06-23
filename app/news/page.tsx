"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  imageUrl: string | null;
  authorName: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  Announcement: "bg-blue-50 text-blue-700 border-blue-200",
  "Project Win": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Hiring: "bg-amber-50 text-amber-700 border-amber-200",
  Update: "bg-slate-100 text-slate-600 border-slate-200",
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Newsroom</span>
            <span className="h-px w-6 bg-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52]">Company News &amp; Updates</h1>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            The latest from Plant Engineering People — new projects, milestones, hiring drives, and company announcements.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface p-6 h-48 skeleton" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="max-w-xl mx-auto text-center surface p-12">
            <p className="text-slate-500">No news yet. Check back soon for updates.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="surface overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col"
              >
                {post.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.imageUrl} alt={post.title} className="h-44 w-full object-cover" />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${CATEGORY_STYLES[post.category] || CATEGORY_STYLES.Update}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1a3a52] leading-snug group-hover:text-[#d41f3d] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">{post.excerpt}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#d41f3d]">
                    Read more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.newsPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <article className="max-w-3xl mx-auto">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#d41f3d] mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Back to News
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#1a3a52] leading-tight">{post.title}</h1>
          {post.authorName && <p className="mt-3 text-sm text-slate-500">By {post.authorName}</p>}

          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt={post.title} className="mt-8 w-full rounded-2xl object-cover" />
          )}

          <div className="mt-8 surface p-8 md:p-10">
            {post.body.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}

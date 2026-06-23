import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { ApplyBox } from "@/components/careers/ApplyBox";

function Section({ title, text }: { title: string; text: string | null }) {
  if (!text) return null;
  return (
    <div className="mt-8">
      <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#d41f3d] mb-3">{title}</h2>
      <div className="text-slate-700 leading-relaxed space-y-2">
        {text.split(/\n+/).filter(Boolean).map((line, i) => (
          <p key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
            <span>{line.replace(/^[-•]\s*/, "")}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = Number(id);
  if (!Number.isInteger(jobId)) notFound();

  const job = await prisma.jobOpening.findUnique({ where: { id: jobId } });
  if (!job) notFound();

  const isOpen = job.status === "OPEN";

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#d41f3d] mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            All openings
          </Link>

          <div className="surface p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">{job.department}</span>
              {!isOpen && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-500">Closed</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1a3a52] leading-tight">{job.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>📍 {job.location}</span>
              <span>🕑 {job.employmentType}</span>
              {job.experience && <span>📈 {job.experience}</span>}
            </div>

            <div className="mt-8 text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</div>

            <Section title="Key Responsibilities" text={job.responsibilities} />
            <Section title="Requirements" text={job.requirements} />
          </div>

          <div className="mt-6">
            {isOpen ? (
              <ApplyBox jobId={job.id} jobTitle={job.title} />
            ) : (
              <div className="surface p-6 text-center text-slate-500">This position is no longer accepting applications.</div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

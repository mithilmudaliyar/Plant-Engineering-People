"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { site } from "@/lib/site";

const projectImages: Record<string, string> = {
  "nuclear-piping": "https://images.unsplash.com/photo-1714504904786-b6732390b206?w=900&q=80",
  "chemical-plant": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
  "utility-pipeline": "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=900&q=80",
  "structural-fab": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80",
};

const sectorColors: Record<string, { badge: string; dot: string }> = {
  Nuclear: { badge: "bg-blue-900/20 text-blue-200 border-blue-700/30", dot: "bg-blue-400" },
  Chemical: { badge: "bg-emerald-900/20 text-emerald-200 border-emerald-700/30", dot: "bg-emerald-400" },
  "Oil & Gas": { badge: "bg-orange-900/20 text-orange-200 border-orange-700/30", dot: "bg-orange-400" },
  Industrial: { badge: "bg-slate-700/30 text-slate-300 border-slate-600/30", dot: "bg-slate-400" },
};

export function ProjectsShowcase() {
  const [featured, ...rest] = site.projects;
  const sideProjects = rest.slice(0, 3);
  const featuredImage = projectImages[featured.id] || projectImages["structural-fab"];
  const featuredColors = sectorColors[featured.sector] || sectorColors.Industrial;

  return (
    <section id="projects" className="bg-slate-50 py-24">
      <Container>
        <ScrollReveal>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="section-label">Portfolio</p>
              <h2 className="mt-3 text-3xl font-black text-[#0C1B33] sm:text-4xl">
                Landmark Projects
              </h2>
              <p className="mt-2 text-base text-slate-500">Representative work across nuclear, chemical, and industrial sectors.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#0C1B33] hover:text-[#d41f3d] transition-colors whitespace-nowrap cursor-pointer">
              View all projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured project */}
          <ScrollReveal direction="left">
          <div className="group relative overflow-hidden rounded-2xl bg-[#0C1B33] min-h-[460px]">
            <Image
              src={featuredImage}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B33] via-[#0C1B33]/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className={`inline-flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm ${featuredColors.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${featuredColors.dot}`} />
                {featured.sector}
              </span>
              <h3 className="mt-3 text-2xl font-black text-white leading-snug">{featured.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{featured.description}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-orange-500/60 to-transparent" />
            </div>
          </div>
          </ScrollReveal>

          {/* Side project list */}
          <StaggerContainer className="flex flex-col gap-4">
            {sideProjects.map((project) => {
              const img = projectImages[project.id] || projectImages["structural-fab"];
              const colors = sectorColors[project.sector] || sectorColors.Industrial;
              return (
                <StaggerItem key={project.id}>
                  <div className="group relative flex overflow-hidden rounded-xl bg-[#0C1B33] h-36">
                    <Image
                      src={img}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0C1B33]/90 via-[#0C1B33]/60 to-transparent" />
                    <div className="relative z-10 flex flex-col justify-center px-6 py-4">
                      <span className={`inline-flex w-fit items-center gap-1.5 rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${colors.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                        {project.sector}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-white leading-snug group-hover:text-orange-300 transition-colors">{project.title}</h3>
                      <p className="mt-1 text-xs text-white/60 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}

            <StaggerItem>
              <Link
                href="/projects"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-5 text-sm font-bold text-slate-500 hover:border-[#0C1B33] hover:text-[#0C1B33] transition-all cursor-pointer"
              >
                View All Projects
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}




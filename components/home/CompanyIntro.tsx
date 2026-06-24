"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { site } from "@/lib/site";

const capabilities = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#d41f3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Nuclear Engineering",
    desc: "Precision piping, structural fabrication, and erection for nuclear facilities.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d41f3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Chemical Processing",
    desc: "Process plant erection and commissioning across chemical sectors.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d41f3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Steel Fabrication",
    desc: "5,000+ MT structural and process piping fabrication capacity.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d41f3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Operations & Maintenance",
    desc: "Shutdown maintenance, inspection, and facility management services.",
  },
];

export function CompanyIntro() {
  return (
    <section id="about" className="bg-white py-24 border-b border-gray-100">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left — text */}
          <ScrollReveal direction="left">
            <div>
              <p className="section-label">About PEPPL</p>
              <h2 className="mt-3 text-4xl font-black text-[#0C1B33] leading-tight sm:text-5xl">
                Engineering<br />
                <span className="text-orange-500">Excellence</span> Since 1999
              </h2>
              <p className="mt-6 text-base text-slate-600 leading-relaxed">
                {site.about.intro}
              </p>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                {site.about.evolution}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d41f3d] animate-pulse" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">Government of India</p>
                  <p className="text-sm font-bold text-red-900">DAE Approved Vendor · Nuclear Fuel Management</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C1B33] px-6 py-3 text-sm font-bold text-white hover:bg-[#08111f] transition-colors cursor-pointer">
                  Learn About Us
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link href="/#contact" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                  Get a Quote
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — capabilities grid + stats */}
          <div>
            <StaggerContainer className="grid grid-cols-2 gap-4">
              {capabilities.map((cap) => (
                <StaggerItem key={cap.title}>
                  <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                    <div className="mb-3 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,31,61,0.1)" }}>
                      {cap.icon}
                    </div>
                    <h3 className="text-sm font-bold text-[#0C1B33]">{cap.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Stat strip */}
            <ScrollReveal delay={0.3}>
              <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                {[
                  { value: "209+", label: "Projects" },
                  { value: "5,000 MT", label: "Steel Fab." },
                  { value: "25 Yrs", label: "Experience" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center bg-white py-4 text-center">
                    <p className="text-xl font-black text-[#d41f3d]">{stat.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

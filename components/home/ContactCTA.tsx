"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0C1B33 0%, #08111f 100%)" }}>
      {/* Accent strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="none" delay={0}>
            <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Partner With Us</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Ready to engineer your next{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #d41f3d, #f06a80)" }}>
                critical infrastructure
              </span>{" "}
              project?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
              From DAE-compliant nuclear fabrication to complete chemical plant erection, our team brings 25+ years of precision engineering to your site.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                Request a Technical Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 cursor-pointer"
              >
                Portal Login
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="mt-8 text-xs text-slate-400 font-medium">
              Strictly adhering to ASME Boiler & Pressure Vessel Codes and IS:2062 standards.
            </p>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}


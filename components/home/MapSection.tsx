"use client";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function MapSection() {
  return (
    <section className="bg-slate-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/8 to-transparent pointer-events-none" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] items-center">
          {/* Text */}
          <ScrollReveal direction="left">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">Global Standards</span>
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl leading-tight">
              Strategically Located in{" "}
              <span className="text-orange-400">Tarapur MIDC</span>
            </h2>
            <p className="mt-6 text-base text-slate-400 leading-relaxed">
              Our 5,000+ MT capacity fabrication facility is situated in the heart of Maharashtra&apos;s premier industrial zone — enabling efficient service to major nuclear and chemical installations across India.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Fabrication Facility</p>
                  <p className="text-xs text-slate-400 mt-1">Plot No: G-52, Tarapur Industrial Area, Boisar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Proximity Advantage</p>
                  <p className="text-xs text-slate-400 mt-1">Direct access to Tarapur Atomic Power Station (TAPS)</p>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal direction="right" delay={0.15}>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800 relative h-[450px]">
            <iframe
              src="https://maps.google.com/maps?q=19.7860274,72.7425389&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.1) opacity(0.9) grayscale(0.2)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PEPPL Location Map"
            />
            {/* Location badge */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-200 shadow-xl flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C1B33] text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Headquarters</p>
                <p className="text-sm font-bold text-[#0C1B33]">Tarapur MIDC</p>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Engineering & Design",
    summary: "From concept to construction-ready drawings - P&ID layout, structural design, seismic qualification, and material selection.",
    bullets: [
      "P&I layout and plant layout design",
      "Structural and support design & drafting",
      "Seismic qualification documentation",
      "Material selection and specification",
      "Third-party testing coordination",
    ],
    tag: "ASME Standards",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Fabrication & Erection",
    summary: "5,000+ MT annual capacity for pressure vessels, piping systems, structural steelwork, and turnkey plant erection across nuclear and chemical sectors.",
    bullets: [
      "Pressure vessels - ASME Section VIII Div. 1",
      "IBR & non-IBR piping in SS, CS, and DI",
      "Industrial structures and support steelwork",
      "Chemical and nuclear plant EPC erection",
    ],
    tag: "5,000+ MT Capacity",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Operations & Support",
    summary: "Long-term plant reliability through shutdown maintenance, facilities management, and safety supervision.",
    bullets: [
      "Planned and emergency shutdown maintenance",
      "Facilities and outsourcing management",
      "Safety supervision and audit support",
      "Inspection services and manpower deployment",
    ],
    tag: "Long-term O&M",
  },
];

export function ServicesSection() {

  return (
    <section id="services" className="bg-white py-24 border-t border-slate-100">
      <Container>
        <ScrollReveal>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="section-label">Capabilities</p>
              <h2 className="mt-3 text-3xl font-black text-[#0C1B33] sm:text-4xl">Our Services</h2>
              <p className="mt-2 text-base text-slate-500 max-w-xl">
                Engineering, fabrication, and plant support across nuclear, chemical, and industrial sectors since 1999.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0C1B33] hover:text-[#d41f3d] transition-colors whitespace-nowrap"
            >
              Full capabilities
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 hover:border-[#d41f3d]/40 hover:shadow-lg transition-all duration-300">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#d41f3d]" style={{ background: "rgba(212,31,61,0.08)" }}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-black text-[#0C1B33]">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{p.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d41f3d]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {p.tag}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-[#0C1B33] hover:text-[#0C1B33] transition-colors"
            >
              More services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d41f3d] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#b01830] transition-colors"
            >
              Request a quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

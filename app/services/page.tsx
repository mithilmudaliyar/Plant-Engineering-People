import { Container } from "@/components/ui/Container";

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Engineering & Design",
    desc: "Complete engineering solutions from concept to construction-ready drawings, including plant layout, P&ID design, and seismic qualification.",
    bullets: [
      "P&I layout and plant layout design",
      "Structural and support design & drafting",
      "Seismic qualification documentation",
      "Material selection and specification",
      "Third-party testing and inspection coordination",
      "Project management services",
    ],
    tag: "ASME Standards",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Heavy Fabrication",
    desc: "Precision MS and SS fabrication for pressure vessels, heat exchangers, storage tanks, and special-purpose process equipment at our 5,000+ MT capacity facility.",
    bullets: [
      "Pressure vessels - ASME Section VIII Div. 1",
      "Shell and tube heat exchangers",
      "Storage tanks (API 650 compliant)",
      "Special-purpose machinery for food and pharma",
      "Columns, reactors, and process equipment",
      "IS:2062 and DAE specification compliance",
    ],
    tag: "5,000+ MT Capacity",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Nuclear Piping",
    desc: "DAE-compliant IBR and non-IBR piping networks for nuclear fuel management and power plant facilities, fabricated and erected under strict AERB protocols.",
    bullets: [
      "Stainless steel and carbon steel piping systems",
      "Ductile iron (DI) material pipework",
      "Cross-country pipeline laying for utilities",
      "AERB-compliant fabrication and erection",
      "Nuclear fuel management facility support",
      "Seismic qualification and documentation",
    ],
    tag: "DAE / AERB Compliant",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Plant Erection & Commissioning",
    desc: "Turnkey mechanical erection and commissioning of chemical process plants, industrial structures, and nuclear facility equipment across the Tarapur belt and beyond.",
    bullets: [
      "Chemical and pharmaceutical process plants",
      "Nuclear facility equipment installation",
      "Industrial structural steelwork and columns",
      "Heavy machinery and reactor installation",
      "Pre-commissioning and commissioning support",
      "EPC project management",
    ],
    tag: "Turnkey EPC",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Quality Assurance & NDT",
    desc: "Comprehensive non-destructive testing and quality assurance ensuring all fabrication and erection meets applicable codes, client specifications, and regulatory requirements.",
    bullets: [
      "Radiographic testing (RT)",
      "Ultrasonic testing (UT)",
      "Magnetic particle inspection (MPT)",
      "Hydrostatic and pneumatic proof testing",
      "Weld procedure qualification (WPS / PQR)",
      "Third-party inspection coordination",
    ],
    tag: "ISNT Certified",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Operations & Maintenance",
    desc: "Reliable long-term plant support through planned shutdown maintenance, facilities management, safety supervision, and general manpower services.",
    bullets: [
      "Planned and emergency shutdown maintenance",
      "Facilities and outsourcing management",
      "Safety supervision and audit support",
      "Construction supervision services",
      "Inspection and testing services",
      "General and specialist manpower deployment",
    ],
    tag: "Long-term O&M",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-[#d41f3d]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52] mb-4">Our Services</h1>
          <p className="text-slate-500 text-base mb-12 max-w-2xl">
            Engineering, fabrication, and plant support across nuclear, chemical, and industrial sectors. DAE-approved, ASME-compliant, and operating since 1999.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="surface p-7 flex flex-col hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#d41f3d]" style={{ background: "rgba(212,31,61,0.08)" }}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-black text-[#1a3a52]">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <ul className="mt-4 space-y-1.5 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d41f3d]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#0C1B33] p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Ready to start?</p>
              <h3 className="text-xl font-black text-white">Discuss your project requirements</h3>
              <p className="mt-1 text-sm text-slate-400">Our team responds within one business day.</p>
            </div>
            <a
              href="/#contact"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#d41f3d] px-6 py-3 text-sm font-bold text-white hover:bg-[#b01830] transition-colors"
            >
              Get a Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

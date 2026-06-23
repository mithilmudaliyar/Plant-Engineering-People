import { Container } from "@/components/ui/Container";

const experience = [
  {
    role: "Managing Director",
    org: "Plant Engineering People Pvt. Ltd.",
    period: "2010 – Present",
    desc: "Promoter director of a company specialising in the design and manufacture of chemical, pharma, textile dye, and nuclear power plant equipment, R&D and process equipment, alongside piping design and installation works.",
  },
  {
    role: "President",
    org: "Tarapur Management Association",
    period: "2019 – Present",
    desc: "Leading the regional management association representing industry across the Tarapur belt.",
  },
  {
    role: "Founder & Chief Executive",
    org: "Plant Engineering People",
    period: "1998 – 2020",
    desc: "Founded the project and plant engineering services firm — designing, constructing, and commissioning three chemical process industries on an EPC basis, and establishing PEP as a reputed engineering partner and system integrator for India's nuclear industry.",
  },
  {
    role: "Chairman",
    org: "Indian Society for Non-Destructive Testing",
    period: "2015 – 2016",
    desc: "Honorary role promoting NDT/NDE practices across industry and academia.",
  },
  {
    role: "Council Member",
    org: "All India Management Association (AIMA)",
    period: "2011 – 2013",
    desc: "Contributed to national management policy and industry initiatives.",
  },
];

const education = [
  {
    school: "Indian Institute of Management, Ahmedabad",
    detail: "EPBF, Business Finance",
    period: "2018 – 2019",
  },
  {
    school: "Vellore Institute of Technology",
    detail: "B.E., Mechanical Engineering — passed with distinction",
    period: "1985 – 1989",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52] mb-8">Engineering Excellence Since 1999</h1>

          <div className="surface p-8 md:p-12 text-slate-700 space-y-6 leading-relaxed">
            <p className="text-lg font-medium text-[#1a3a52]">
              Plant Engineering People Pvt. Ltd. (PEPPL) is a premier fabrication and engineering company specializing in nuclear, chemical, and heavy industrial plant construction.
            </p>
            <p>
              Located strategically in Tarapur MIDC, our 5000+ MT capacity facility is equipped with state-of-the-art machinery and adheres strictly to ASME Boiler &amp; Pressure Vessel Codes, IS:2062, and DAE specifications.
            </p>
            <p>
              With over two decades of precision engineering experience, we have proudly served major public sector undertakings including Bhabha Atomic Research Centre (BARC), Nuclear Power Corporation of India Limited (NPCIL), and numerous private heavy-industry leaders.
            </p>
          </div>

          {/* Leadership */}
          <div className="mt-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Leadership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1a3a52] mb-8">Meet Our Managing Director</h2>

            <div className="surface p-8 md:p-12">
              {/* Header */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-[#1a3a52]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/clients/owner.jpg"
                      alt="Elangovan Mudaliyar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#1a3a52]">Elangovan Mudaliyar</h3>
                    <p className="mt-1 text-sm font-bold text-orange-600">
                      Managing Director · Plant Engineering People Pvt. Ltd.
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      President · Tarapur Management Association
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Thane, Maharashtra, India
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.linkedin.com/in/elangovanmudaliyar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Elangovan Mudaliyar on LinkedIn"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-[#0A66C2] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#08528f] sm:self-auto"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                  LinkedIn
                </a>
              </div>

              {/* Bio */}
              <div className="mt-8 space-y-4 text-slate-700 leading-relaxed">
                <p>
                  An expert in chemical, pharma, oil &amp; gas, and nuclear project engineering, Elangovan brings over three decades of hands-on leadership across plant engineering services for the chemical, nuclear, pharma, and bulk drug industries.
                </p>
                <p>
                  His specialties span chemical and process plant design, engineering, construction, piping, fabrication, and maintenance — including the manufacture of chemical process equipment and special-purpose machinery for food and allied industries.
                </p>
              </div>

              {/* Experience + Education */}
              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a3a52] mb-5">Experience</h4>
                  <ol className="space-y-5">
                    {experience.map((item) => (
                      <li key={item.role + item.org} className="relative border-l-2 border-slate-200 pl-5">
                        <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-orange-500" />
                        <p className="text-sm font-bold text-[#1a3a52]">{item.role}</p>
                        <p className="text-xs font-semibold text-orange-600">{item.org}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.period}</p>
                        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a3a52] mb-5">Education</h4>
                  <ul className="space-y-5">
                    {education.map((item) => (
                      <li key={item.school} className="relative border-l-2 border-slate-200 pl-5">
                        <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#1a3a52]" />
                        <p className="text-sm font-bold text-[#1a3a52]">{item.school}</p>
                        <p className="text-xs text-slate-500">{item.detail}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.period}</p>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a3a52] mt-8 mb-5">Certifications</h4>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-sm font-bold text-[#1a3a52]">Certified Welding Inspector</p>
                    <p className="text-xs text-slate-500">Indian Society for Non-Destructive Testing (ISNT) · 2014</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

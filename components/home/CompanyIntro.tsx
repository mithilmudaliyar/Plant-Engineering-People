import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const capabilities = [
  {
    icon: "⚛️",
    title: "Nuclear Engineering",
    desc: "Precision piping, structural fabrication, and erection for nuclear facilities.",
  },
  {
    icon: "🏭",
    title: "Chemical Processing",
    desc: "Process plant erection and commissioning across chemical sectors.",
  },
  {
    icon: "🔩",
    title: "Steel Fabrication",
    desc: "5000+ MT structural and process piping fabrication capacity.",
  },
  {
    icon: "⚙️",
    title: "Operations & Maintenance",
    desc: "Shutdown maintenance, inspection, and facility management services.",
  },
];

export function CompanyIntro() {
  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left — text */}
          <div>
            <p className="section-label">About PEPL</p>
            <h2 className="mt-3 text-4xl font-black text-[#1a3a52] leading-tight sm:text-5xl">
              Engineering<br />
              <span className="text-[#d41f3d]">Excellence</span> Since 1999
            </h2>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              {site.about.intro}
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {site.about.evolution}
            </p>

            {/* DAE badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Government of India</p>
                <p className="text-sm font-bold text-amber-900">DAE Approved Vendor · Nuclear Fuel Management</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="inline-flex items-center gap-1.5 rounded-md bg-[#1a3a52] px-6 py-3 text-sm font-bold text-white hover:bg-[#0f1f2e] transition-colors">
                Learn About Us →
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Right — capabilities grid + stats */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-[#1a3a52]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="mb-3 text-2xl">{cap.icon}</div>
                  <h3 className="text-sm font-bold text-[#1a3a52]">{cap.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>

            {/* Stat strip */}
            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
              {[
                { value: "209+", label: "Projects" },
                { value: "5000 MT", label: "Steel Fab." },
                { value: "25 Yrs", label: "Experience" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center bg-white py-4 text-center">
                  <p className="text-xl font-black text-[#d41f3d]">{stat.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

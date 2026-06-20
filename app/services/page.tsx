import { Container } from "@/components/ui/Container";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Capabilities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52] mb-8">Our Services</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Heavy Fabrication", desc: "Custom MS and SS fabrication for pressure vessels, storage tanks, and critical structural components." },
              { title: "Nuclear Piping", desc: "Precision IBR and non-IBR piping networks adhering to strict Department of Atomic Energy standards." },
              { title: "Plant Erection", desc: "Turnkey mechanical erection of heavy machinery, columns, and structural steelworks at site." },
              { title: "Quality Testing", desc: "Comprehensive NDT (Non-Destructive Testing), radiography, and hydro-testing capabilities." }
            ].map((s, i) => (
              <div key={i} className="surface p-8 border-t-4 border-[#1a3a52] hover:border-[#d41f3d] transition-colors">
                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

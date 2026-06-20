import { Container } from "@/components/ui/Container";

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
              Plant Engineering People Pvt. Ltd. (PEPL) is a premier fabrication and engineering company specializing in nuclear, chemical, and heavy industrial plant construction.
            </p>
            <p>
              Located strategically in Tarapur MIDC, our 5000+ MT capacity facility is equipped with state-of-the-art machinery and adheres strictly to ASME Boiler & Pressure Vessel Codes, IS:2062, and DAE specifications.
            </p>
            <p>
              With over two decades of precision engineering experience, we have proudly served major public sector undertakings including Bhabha Atomic Research Centre (BARC), Nuclear Power Corporation of India Limited (NPCIL), and numerous private heavy-industry leaders.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

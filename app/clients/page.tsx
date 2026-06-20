import { Container } from "@/components/ui/Container";

export default function ClientsPage() {
  const clients = [
    "Bhabha Atomic Research Centre (BARC)",
    "Nuclear Power Corporation of India Limited (NPCIL)",
    "Heavy Water Board (HWB)",
    "Larsen & Toubro (L&T)",
    "Tata Consulting Engineers (TCE)",
    "Reliance Industries Limited (RIL)",
    "Godrej & Boyce",
    "JSW Steel"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Trust</span>
            <span className="h-px w-6 bg-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52]">Our Esteemed Clients</h1>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            We are proud to be the trusted fabrication partner for India's most critical infrastructure, nuclear, and heavy engineering projects.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {clients.map((client, i) => (
            <div key={i} className="surface flex items-center justify-center p-6 text-center min-h-[120px] hover:shadow-lg transition-shadow border border-gray-100">
              <span className="text-sm font-bold text-[#1a3a52]">{client}</span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function ContactCTA() {
  return (
    <section className="bg-gradient-to-br from-[#1a3a52] to-[#0f1f2e] py-24 relative overflow-hidden">
      {/* Structural pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />
      
      {/* Accent strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d41f3d] via-amber-500 to-[#d41f3d]" />

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#d41f3d] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Partner With Us</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Ready to engineer your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">critical infrastructure</span> project?
          </h2>
          
          <p className="mt-6 text-lg text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            From DAE-compliant nuclear fabrication to complete chemical plant erection, our team brings 25+ years of precision engineering to your site.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#d41f3d] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#b01830] hover:scale-105 shadow-lg shadow-[#d41f3d]/20"
            >
              Request a Technical Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link 
              href="/supplier-login" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Supplier Portal Login
            </Link>
          </div>
          
          <p className="mt-8 text-xs text-slate-400 font-medium">
            Strictly adhering to ASME Boiler & Pressure Vessel Codes and IS:2062 standards.
          </p>
        </div>
      </Container>
    </section>
  );
}

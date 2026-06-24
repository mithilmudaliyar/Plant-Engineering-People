import { Container } from "@/components/ui/Container";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-[#d41f3d]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d41f3d]">Reach Out</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a3a52] mb-12">Contact Us</h1>
          
          <div className="grid md:grid-cols-[1fr_2fr] gap-8">
            <div className="space-y-6">
              <div className="surface p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Head Office & Works</h3>
                <p className="text-[#1a3a52] font-semibold">Plant Engineering People Pvt. Ltd.</p>
                <p className="text-sm text-slate-600 mt-1">Plot No: G-52, Tarapur Industrial Area,<br/>MIDC, Boisar, Palghar<br/>Maharashtra 401506</p>
              </div>
              
              <div className="surface p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Details</h3>
                <p className="text-[#1a3a52] font-semibold text-sm">Email: <a href="mailto:pep.tarapur@gmail.com" className="text-[#d41f3d] hover:underline">pep.tarapur@gmail.com</a></p>
                <p className="text-[#1a3a52] font-semibold text-sm mt-2">Phone: +91 98765 43210</p>
              </div>
            </div>

            <div className="surface p-8">
              <h2 className="text-2xl font-black text-[#1a3a52] mb-6">Send an Inquiry</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name</label>
                    <input type="text" className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-1 focus:ring-[#1a3a52] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company</label>
                    <input type="text" className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-1 focus:ring-[#1a3a52] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input type="email" className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-1 focus:ring-[#1a3a52] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                  <textarea rows={4} className="w-full rounded border border-gray-300 p-2.5 text-sm focus:border-[#1a3a52] focus:ring-1 focus:ring-[#1a3a52] outline-none"></textarea>
                </div>
                <button type="button" className="bg-[#d41f3d] text-white px-6 py-3 rounded text-sm font-bold hover:bg-[#b01830] transition-colors">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

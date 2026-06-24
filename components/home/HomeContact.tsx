"use client";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { site } from "@/lib/site";

export function HomeContact() {
  return (
    <section id="contact" className="bg-slate-50 py-24 border-t border-slate-100">
      <Container>
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="mb-10">
              <p className="section-label">Get in Touch</p>
              <h2 className="mt-3 text-3xl font-black text-[#0C1B33] sm:text-4xl">Contact Us</h2>
              <p className="mt-2 text-base text-slate-500">
                Send us an inquiry or call directly — we respond within one business day.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            {/* Contact details */}
            <ScrollReveal direction="left">
              <div className="space-y-5">
                <div className="surface p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Head Office & Works</h3>
                  <p className="text-sm font-bold text-[#0C1B33]">Plant Engineering People Pvt. Ltd.</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {site.contact.address.line1},<br />
                    {site.contact.address.line2},<br />
                    {site.contact.address.state} — {site.contact.address.pin}
                  </p>
                </div>

                <div className="surface p-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h3>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-[#d41f3d] transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#d41f3d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {site.contact.email}
                  </a>
                  <a
                    href={`tel:${site.contact.inquiryPhone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-[#d41f3d] transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#d41f3d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {site.contact.inquiryPhone}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal direction="right">
              <div className="surface p-8">
                <h3 className="text-xl font-black text-[#0C1B33] mb-6">Send an Inquiry</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Name</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-1 focus:ring-[#d41f3d] outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Company</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-1 focus:ring-[#d41f3d] outline-none transition-colors"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-1 focus:ring-[#d41f3d] outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-1 focus:ring-[#d41f3d] outline-none transition-colors resize-none"
                      placeholder="Describe your project or requirement…"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d41f3d] px-6 py-3 text-sm font-bold text-white hover:bg-[#b01830] transition-colors cursor-pointer"
                  >
                    Submit Inquiry
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

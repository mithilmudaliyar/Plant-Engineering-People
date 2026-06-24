"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/employee")) return null;
  const { contact } = site;
  const fullAddress = `${contact.address.line1}, ${contact.address.line2}, ${contact.address.state} ${contact.address.pin}`;

  return (
    <footer className="bg-[#0C1B33] text-white border-t-4 border-orange-500">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 shrink-0">
                <Image src="/logo.png" alt={`${site.company.name} Logo`} width={48} height={48} className="object-contain" />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight">Plant Engineering People Pvt. Ltd.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{site.company.shortName}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{site.company.tagline}</p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-orange-500/30 px-3 py-2" style={{ background: "rgba(212,31,61,0.1)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400">DAE Approved Vendor</span>
            </div>

            <div className="mt-5 flex items-center">
              <a
                href="https://www.linkedin.com/company/plant-engineering-people"
                target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-3"
                aria-label="LinkedIn"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-400 group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5] transition-all">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-[#0077b5] transition-colors">Follow on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-slate-600" /> Quick Links
            </p>
            <ul className="space-y-2.5">
              {site.navigation.map((item) => (
                <li key={item.href} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-orange-500/50 shrink-0" />
                  <Link href={item.href} className="text-sm text-slate-300 hover:text-orange-400 transition-colors cursor-pointer">{item.label}</Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span className="h-px w-3 bg-orange-500/50 shrink-0" />
                <Link href="/login" className="text-sm text-slate-300 hover:text-orange-400 transition-colors cursor-pointer">Login / Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-slate-600" /> Our Services
            </p>
            <ul className="space-y-2.5">
              {site.services.map((service) => (
                <li key={service.id} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-orange-500/50 shrink-0" />
                  <Link href="/services" className="text-sm text-slate-300 hover:text-orange-400 transition-colors cursor-pointer">{service.shortTitle}</Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span className="h-px w-3 bg-orange-500/50 shrink-0" />
                <Link href="/services" className="text-sm text-slate-300 hover:text-orange-400 transition-colors cursor-pointer">Cross-Country Pipelines</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-2">
              <span className="h-px w-4 bg-slate-600" /> Contact Us
            </p>
            <address className="space-y-3 text-sm not-italic text-slate-400">
              <p className="text-xs leading-relaxed">{fullAddress}</p>
              <div className="space-y-2 pt-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inquiries</p>
                  <a href={`tel:${contact.inquiryPhone.replace(/\s/g, "")}`} className="text-sm text-slate-300 hover:text-orange-400 transition-colors">{contact.inquiryPhone}</a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quote Line</p>
                  <a href={`tel:${contact.quotePhone.replace(/\s/g, "")}`} className="text-sm text-slate-300 hover:text-orange-400 transition-colors">{contact.quotePhone}</a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm text-slate-300 hover:text-orange-400 transition-colors break-all">{contact.email}</a>
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} {site.company.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-600">ISO Certified · ASME Compliant · DAE Vendor</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

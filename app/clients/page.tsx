"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

const clients = [
  {
    name: "Bhabha Atomic Research Centre",
    short: "BARC",
    logo: "/clients/barc.png",
  },
  {
    name: "Nuclear Power Corporation of India",
    short: "NPCIL",
    logo: "/clients/npcil.png",
  },
  {
    name: "Heavy Water Board",
    short: "HWB",
    logo: "/clients/hwb.png",
  },
  {
    name: "Larsen & Toubro",
    short: "L&T",
    logo: "/clients/lt.png",
  },
  {
    name: "Tata Consulting Engineers",
    short: "TCE",
    logo: "/clients/tce.avif",
  },
  {
    name: "Reliance Industries Limited",
    short: "RIL",
    logo: "/clients/ril.jpg",
  },
  {
    name: "Godrej & Boyce",
    short: "Godrej",
    logo: "/clients/godrej.png",
  },
  {
    name: "JSW Steel",
    short: "JSW",
    logo: "/clients/jsw.png",
  },
];

function ClientCard({ client }: { client: typeof clients[0] }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="bg-white flex flex-col items-center justify-center gap-4 p-6 text-center min-h-[140px] rounded-xl border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-200">
      {!imgFailed ? (
        <div className="flex h-12 w-20 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.logo}
            alt={client.name}
            className="max-h-12 max-w-20 object-contain"
            loading="lazy"
            onError={() => setImgFailed(true)}
            suppressHydrationWarning
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#0C1B33] flex items-center justify-center">
          <span className="text-xs font-black text-white">{client.short.slice(0, 3)}</span>
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-[#1a3a52] leading-snug">{client.name}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{client.short}</p>
      </div>
    </div>
  );
}

export default function ClientsPage() {
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
            We are proud to be the trusted fabrication partner for India&apos;s most critical infrastructure, nuclear, and heavy engineering projects.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {clients.map((client) => (
            <ClientCard key={client.short} client={client} />
          ))}
        </div>
      </Container>
    </div>
  );
}

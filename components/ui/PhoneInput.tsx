"use client";

import { useState } from "react";

type Country = { code: string; dial: string; flag: string; name: string };

// Common codes for PEPPL's markets; India default first.
const COUNTRIES: Country[] = [
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "QA", dial: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "OM", dial: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "KW", dial: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "CN", dial: "+86", flag: "🇨🇳", name: "China" },
];

type Props = {
  /** Called with the full phone string, e.g. "+91 9876543210" (empty when no number). */
  onChange: (fullPhone: string) => void;
  placeholder?: string;
  label?: string;
};

export function PhoneInput({ onChange, placeholder = "98765 43210", label = "Phone (optional)" }: Props) {
  const [countryIdx, setCountryIdx] = useState(0);
  const [number, setNumber] = useState("");

  const emit = (idx: number, num: string) => {
    const clean = num.trim();
    onChange(clean ? `${COUNTRIES[idx].dial} ${clean}` : "");
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-1.5">{label}</label>
      <div className="flex">
        <select
          aria-label="Country code"
          value={countryIdx}
          onChange={(e) => { const i = Number(e.target.value); setCountryIdx(i); emit(i, number); }}
          className="rounded-l-md border border-r-0 border-gray-300 bg-slate-50 px-2 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d] focus:z-10"
        >
          {COUNTRIES.map((c, i) => (
            <option key={c.code} value={i}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          value={number}
          placeholder={placeholder}
          onChange={(e) => { const v = e.target.value; setNumber(v); emit(countryIdx, v); }}
          autoComplete="tel-national"
          className="block w-full rounded-r-md border border-gray-300 p-2.5 text-sm focus:border-[#d41f3d] focus:ring-[#d41f3d]"
        />
      </div>
    </div>
  );
}

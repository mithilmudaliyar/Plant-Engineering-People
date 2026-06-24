"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
    tag: "Nuclear & Chemical",
    location: "Tarapur, Maharashtra",
    title: "Engineering Critical\nInfrastructure Since 1999",
    subtitle: "DAE-approved vendor for nuclear fuel management, chemical process plants, and industrial fabrication.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    tag: "Fabrication & Erection",
    location: "Tarapur Industrial Area",
    title: "5000+ MT Steel\nFabricated with Precision",
    subtitle: “Stainless steel, carbon steel, and ductile iron systems — fabricated and erected across critical sectors.”,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=1600&q=80",
    tag: "Operations & Support",
    location: "Nuclear & Energy Sector",
    title: "End-to-End Plant\nEngineering Solutions",
    subtitle: "From engineering design and P&I layout through erection, commissioning, and ongoing plant support.",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[90vh] min-h-[560px] overflow-hidden bg-[#0C1B33]">
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto transition-all duration-500"
        style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(10px)" : "translateY(0)" }}
      >
        {/* Caption badge */}
        <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">{slide.tag}</p>
            <p className="text-xs text-white/60 font-medium">{slide.location}</p>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed font-light">
          {slide.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#d41f3d] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#b01830] hover:scale-105 shadow-lg shadow-black/30"
          >
            Our Capabilities
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/8 backdrop-blur-sm px-6 py-3.5 text-sm font-medium text-white/85 transition-all hover:bg-white/15"
          >
            Get a Quote
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`cursor-pointer rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-[#d41f3d]" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <div className="h-px flex-1 max-w-20 bg-white/20" />
          <span className="text-xs font-bold text-white/40 tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white transition hover:bg-black/50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white transition hover:bg-black/50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom brand strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-6 border-t border-white/10 bg-black/30 backdrop-blur-sm px-6 sm:px-12 lg:px-20 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Plant Engineering People Pvt. Ltd.</span>
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/80">DAE Approved Vendor · Est. 1999</span>
      </div>
    </section>
  );
}




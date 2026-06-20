import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { MapSection } from "@/components/home/MapSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CompanyIntro />
      <ProjectsShowcase />
      <MapSection />
      <ContactCTA />
    </>
  );
}

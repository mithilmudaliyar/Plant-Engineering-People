import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { MapSection } from "@/components/home/MapSection";
import { HomeContact } from "@/components/home/HomeContact";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CompanyIntro />
      <ServicesSection />
      <ProjectsShowcase />
      <MapSection />
      <HomeContact />
      <ContactCTA />
    </>
  );
}

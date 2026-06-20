import { Container } from "@/components/ui/Container";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="pt-12 bg-[#1a3a52] pb-24">
        <Container>
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-px w-6 bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">Featured Projects</h1>
        </Container>
      </div>
      
      <div className="-mt-16 relative z-10 pb-20">
        <ProjectsShowcase />
      </div>
    </div>
  );
}

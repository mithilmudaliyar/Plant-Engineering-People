import { Skeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-3 mb-12">
          <Skeleton className="h-3 w-28 mx-auto" />
          <Skeleton className="h-10 w-80 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="surface overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-4/5" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <Skeleton className="h-3 w-24 mx-auto" />
          <Skeleton className="h-10 w-72 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

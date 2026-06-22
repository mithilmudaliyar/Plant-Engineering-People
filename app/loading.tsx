import { SkeletonHero } from "@/components/ui/Skeleton";
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <main>
      {/* Hero Skeleton */}
      <SkeletonHero />

      {/* Company Intro Skeleton */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-10 w-56" />
            <SkeletonText lines={4} className="mt-6" />
            <div className="flex gap-3 mt-8">
              <Skeleton className="h-11 w-36 rounded-md" />
              <Skeleton className="h-11 w-32 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="surface p-5 space-y-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-28" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Skeleton */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <Skeleton className="h-3 w-28 mx-auto" />
            <Skeleton className="h-9 w-80 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Skeleton */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <Skeleton className="h-3 w-32 mx-auto" />
            <Skeleton className="h-9 w-72 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="surface overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-4/5" />
                  <SkeletonText lines={2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Skeleton */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-12 lg:grid-cols-[1fr_2fr] items-center">
          <div className="space-y-4">
            <div className="skeleton-dark h-3 w-24" />
            <div className="skeleton-dark h-8 w-64" />
            <div className="skeleton-dark h-8 w-48" />
            <div className="space-y-2 mt-6">
              <div className="skeleton-dark h-3 w-full" />
              <div className="skeleton-dark h-3 w-full" />
              <div className="skeleton-dark h-3 w-3/4" />
            </div>
          </div>
          <div className="skeleton-dark h-[450px] rounded-2xl" />
        </div>
      </section>
    </main>
  );
}

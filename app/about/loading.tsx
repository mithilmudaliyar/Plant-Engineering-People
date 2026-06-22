import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-64" />
        <SkeletonText lines={6} className="mt-8" />
        <SkeletonText lines={4} className="mt-6" />
        <SkeletonText lines={5} className="mt-6" />
      </div>
    </div>
  );
}

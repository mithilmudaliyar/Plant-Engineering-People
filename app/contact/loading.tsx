import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <Skeleton className="h-3 w-20 mx-auto" />
          <Skeleton className="h-10 w-56 mx-auto" />
        </div>
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Contact Info Side */}
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="surface p-5 flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
          {/* Form Side */}
          <div className="surface p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

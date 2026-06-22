import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function EmployeeLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="surface p-6 border-l-4 border-l-slate-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <div className="bg-slate-50 p-4 rounded border border-gray-100 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-72 space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-24" />
                    <Skeleton className="h-9 w-full rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-28" />
                    <Skeleton className="h-20 w-full rounded" />
                  </div>
                  <Skeleton className="h-9 w-full rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

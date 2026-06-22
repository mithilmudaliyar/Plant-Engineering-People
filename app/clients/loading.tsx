import { Skeleton } from "@/components/ui/Skeleton";

export default function ClientsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <Skeleton className="h-3 w-24 mx-auto" />
          <Skeleton className="h-10 w-56 mx-auto" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto mt-4" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i} className="surface p-5 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

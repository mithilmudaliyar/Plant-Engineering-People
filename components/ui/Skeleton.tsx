export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton ${className}`} />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3.5 rounded ${i === lines - 1 ? "w-3/5" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`surface p-6 space-y-4 ${className}`}>
      <div className="skeleton h-5 w-2/5 rounded" />
      <SkeletonText lines={3} />
      <div className="skeleton h-9 w-28 rounded" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[600px] bg-slate-800 overflow-hidden">
      <div className="skeleton-dark absolute inset-0" />
      <div className="absolute bottom-16 left-8 md:left-16 space-y-4 z-10 max-w-xl">
        <div className="skeleton-dark h-4 w-32 rounded" />
        <div className="skeleton-dark h-10 w-96 max-w-[80vw] rounded" />
        <div className="skeleton-dark h-10 w-72 max-w-[60vw] rounded" />
        <div className="skeleton-dark h-4 w-80 max-w-[70vw] rounded mt-4" />
        <div className="flex gap-3 mt-6">
          <div className="skeleton-dark h-12 w-36 rounded-md" />
          <div className="skeleton-dark h-12 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}

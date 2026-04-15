export default function StoriesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-32 bg-border rounded animate-pulse" />
        <div className="h-4 w-48 bg-border rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[16/9] bg-border animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-border rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-border rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

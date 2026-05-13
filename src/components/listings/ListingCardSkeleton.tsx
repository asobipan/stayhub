export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="rounded-xl mb-3"
        style={{ aspectRatio: "4/3", background: "#F0EDE6" }}
      />
      <div className="space-y-2">
        <div className="h-4 rounded" style={{ background: "#F0EDE6", width: "75%" }} />
        <div className="h-3 rounded" style={{ background: "#F5F4F0", width: "50%" }} />
        <div className="flex justify-between">
          <div className="h-3 rounded" style={{ background: "#F5F4F0", width: "40%" }} />
          <div className="h-3 rounded" style={{ background: "#F0EDE6", width: "25%" }} />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

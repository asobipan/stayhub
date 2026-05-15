export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero skeleton */}
      <div className="mb-10">
        <div
          className="h-8 w-48 rounded-lg mb-4"
          style={{ background: "#E7E5E0", animation: "pulse 1.5s ease-in-out infinite" }}
        />
        <div
          className="h-5 w-72 rounded-lg"
          style={{ background: "#E7E5E0", animation: "pulse 1.5s ease-in-out infinite", animationDelay: "0.1s" }}
        />
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
            <div
              className="w-full h-52"
              style={{
                background: "#E7E5E0",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.05}s`,
              }}
            />
            <div className="p-4 space-y-3">
              <div
                className="h-4 w-3/4 rounded"
                style={{ background: "#E7E5E0", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.05 + 0.1}s` }}
              />
              <div
                className="h-3 w-1/2 rounded"
                style={{ background: "#E7E5E0", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.05 + 0.2}s` }}
              />
              <div
                className="h-4 w-1/3 rounded"
                style={{ background: "#E7E5E0", animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.05 + 0.3}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

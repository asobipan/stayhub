const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  parking: "🅿️",
  pool: "🏊",
  gym: "🏋️",
  kitchen: "🍳",
  ac: "❄️",
  heating: "🔥",
  tv: "📺",
  washer: "🫧",
  dryer: "🌀",
  workspace: "💼",
  balcony: "🏡",
  pets: "🐾",
  bbq: "🔥",
  beach: "🏖️",
  mountain: "⛰️",
};

interface AmenitiesListProps {
  amenities: string[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (amenities.length === 0) return null;

  return (
    <div>
      <h2
        className="text-xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
      >
        Зручності
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((amenity) => {
          const key = amenity.toLowerCase().replace(/\s+/g, "");
          const icon = AMENITY_ICONS[key] ?? "✓";
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ borderColor: "#E7E5E0", background: "#FAFAF8" }}
            >
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-sm font-medium capitalize" style={{ color: "#44403C" }}>
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

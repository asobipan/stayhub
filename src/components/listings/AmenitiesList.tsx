const AMENITY_LABELS: Record<string, { label: string; icon: string }> = {
  wifi:      { label: "Wi-Fi",           icon: "📶" },
  parking:   { label: "Парковка",        icon: "🅿️" },
  pool:      { label: "Басейн",          icon: "🏊" },
  gym:       { label: "Спортзал",        icon: "🏋️" },
  kitchen:   { label: "Кухня",           icon: "🍳" },
  ac:        { label: "Кондиціонер",     icon: "❄️" },
  heating:   { label: "Опалення",        icon: "🔥" },
  tv:        { label: "Телевізор",       icon: "📺" },
  washer:    { label: "Пральна машина",  icon: "🫧" },
  dryer:     { label: "Сушарка",         icon: "🌀" },
  workspace: { label: "Робоче місце",    icon: "💼" },
  balcony:   { label: "Балкон",          icon: "🏡" },
  pets:      { label: "Домашні тварини", icon: "🐾" },
  bbq:       { label: "Мангал",          icon: "🍖" },
  beach:     { label: "Пляж поруч",      icon: "🏖️" },
  mountain:  { label: "Гори поруч",      icon: "⛰️" },
};

interface AmenitiesListProps {
  amenities: string[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (amenities.length === 0) return null;

  return (
    <div>
      <h3 className="sh-block-title">Що пропонує житло</h3>
      <div className="sh-amen-list">
        {amenities.map((amenity) => {
          const key = amenity.toLowerCase().replace(/\s+/g, "");
          const entry = AMENITY_LABELS[key];
          return (
            <div key={amenity} className="sh-amen-item">
              <span style={{ fontSize: 16, lineHeight: 1 }}>{entry?.icon ?? "✓"}</span>
              <span>{entry?.label ?? amenity}</span>
            </div>
          );
        })}
      </div>
      <button className="sh-btn sh-btn-outline">
        Показати всі зручності
      </button>
    </div>
  );
}

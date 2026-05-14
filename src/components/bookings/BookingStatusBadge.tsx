const STATUS_MAP = {
  PENDING:   { label: "Очікує",     bg: "rgba(245,158,11,0.1)",  color: "#D97706" },
  CONFIRMED: { label: "Підтвердж.", bg: "rgba(16,185,129,0.1)",  color: "#059669" },
  CANCELLED: { label: "Скасовано",  bg: "rgba(220,38,38,0.08)",  color: "#DC2626" },
  COMPLETED: { label: "Завершено",  bg: "rgba(99,102,241,0.1)",  color: "#4F46E5" },
};

export function BookingStatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return (
    <span
      className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

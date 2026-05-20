// Centralized SVG icon components for StayHub.
// Usage: import { BedIcon, HeartIcon } from "@/components/ui/icons"

interface IconProps {
  size?: number;
  className?: string;
}

function base(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24" as const,
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

// ─── Navigation / UI ──────────────────────────────────────────

export const MenuIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const GlobeIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>
);

export const SearchIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);

export const PlusIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowURIcon = ({ size = 12, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const ChevDownIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ExitIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const SlidersIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14" />
    <circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="19" cy="18" r="2" />
  </svg>
);

// ─── User / Account ───────────────────────────────────────────

export const UserIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export const ShieldIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 2L4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const MedalIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="15" r="5" /><path d="M9 10L7 3h10l-2 7M9 15l1.5 1.5L13 14" />
  </svg>
);

// ─── Listings / Travel ────────────────────────────────────────

export const HeartIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" />
  </svg>
);

export const HeartFillIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z" />
  </svg>
);

export const StarFillIcon = ({ size = 11, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 2l3 6.5 7 1-5 4.5 1.5 7L12 17l-6.5 4 1.5-7-5-4.5 7-1L12 2z" />
  </svg>
);

export const PinIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 22s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const BedIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 19v-9a2 2 0 012-2h10a4 4 0 014 4v7" /><path d="M3 14h18M7 14v-2a2 2 0 012-2h2v4" />
  </svg>
);

export const CalIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const PeopleIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5M14 20c0-2 1.5-3.5 3.5-3.5S21 18 21 20" />
  </svg>
);

// ─── Dashboard ────────────────────────────────────────────────

export const HomeIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-7h6v7M9 11h6" />
  </svg>
);

// ─── Category icons (22px default) ───────────────────────────

export const GridIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const AptIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-7h6v7M9 11h6" />
  </svg>
);

export const VillaIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M3 21V11l9-6 9 6v10" /><path d="M8 21v-6h8v6" />
  </svg>
);

export const LoftIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M3 21V9l9-6 9 6v12" /><path d="M3 14h18M9 14V9M15 14V9" />
  </svg>
);

export const CabinIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M3 21l9-14 9 14M6 21V11M18 21V11M9 21v-6h6v6" />
  </svg>
);

export const StudioIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M9 9v12" />
  </svg>
);

export const PentIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M3 21V12l9-7 9 7v9" /><path d="M3 16h18M8 21V12M16 21v-9" />
  </svg>
);

export const BoutiqueIcon = ({ size = 22, className }: IconProps) => (
  <svg {...base(size, className)} strokeWidth={1.4}>
    <path d="M3 21V8h18v13" /><path d="M3 8l3-5h12l3 5M9 21v-7h6v7M9 11h6" />
  </svg>
);

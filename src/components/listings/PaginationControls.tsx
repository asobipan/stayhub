"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  pages: number;
}

export function PaginationControls({ page, pages }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/listings?${params.toString()}`);
  }

  const visible = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  const withEllipsis: (number | "...")[] = [];
  for (let i = 0; i < visible.length; i++) {
    if (i > 0 && visible[i] - visible[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(visible[i]);
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <NavButton onClick={() => navigate(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="w-4 h-4" />
      </NavButton>

      {withEllipsis.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-2 text-sm" style={{ color: "#A8A29E" }}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => navigate(p as number)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: p === page ? "#1E1B4B" : "transparent",
              color: p === page ? "#fff" : "#44403C",
            }}
          >
            {p}
          </button>
        )
      )}

      <NavButton onClick={() => navigate(page + 1)} disabled={page >= pages}>
        <ChevronRight className="w-4 h-4" />
      </NavButton>
    </div>
  );
}

function NavButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F5F4F0]"
      style={{ color: disabled ? "#C4BFBA" : "#44403C" }}
    >
      {children}
    </button>
  );
}

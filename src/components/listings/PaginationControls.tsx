"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
      <NavBtn onClick={() => navigate(page - 1)} disabled={page <= 1}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6"/>
        </svg>
      </NavBtn>

      {withEllipsis.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-2 text-[13px] text-[var(--sh-muted)]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => navigate(p as number)}
            className={[
              "w-9 h-9 rounded-lg text-[13px] font-medium transition-colors",
              p === page
                ? "bg-[var(--ink)] text-[var(--background)]"
                : "text-[var(--ink-2)] hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]",
            ].join(" ")}
          >
            {p}
          </button>
        )
      )}

      <NavBtn onClick={() => navigate(page + 1)} disabled={page >= pages}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6"/>
        </svg>
      </NavBtn>
    </div>
  );
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-alt)] disabled:opacity-30 disabled:pointer-events-none text-[var(--ink-2)]"
    >
      {children}
    </button>
  );
}

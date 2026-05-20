import { Suspense } from "react";
import { getListings, type ListingsQuery } from "@/lib/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingGridSkeleton } from "@/components/listings/ListingCardSkeleton";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { PaginationControls } from "@/components/listings/PaginationControls";
import { CategoryTabs } from "@/components/listings/CategoryTabs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function ListingsResult({ searchParams }: { searchParams: ListingsQuery }) {
  const [{ listings, total, pages, page }, session] = await Promise.all([
    getListings(searchParams),
    auth(),
  ]);

  const savedIds = session?.user?.id
    ? new Set(
        (await db.savedListing.findMany({
          where: { userId: session.user.id },
          select: { listingId: true },
        })).map((s) => s.listingId)
      )
    : new Set<string>();

  const countWord =
    total === 1 ? "оголошення" :
    total < 5  ? "оголошення" : "оголошень";

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--line)] mb-6">
        <p className="text-[14px] text-[var(--ink-2)]">
          {total > 0 ? (
            <>
              <strong className="text-[var(--ink)] font-semibold">{total}</strong>{" "}
              {countWord} знайдено
              {searchParams.city && (
                <> в <em className="italic text-[var(--sh-accent)]">«{searchParams.city}»</em></>
              )}
            </>
          ) : (
            <span className="text-[var(--sh-muted)]">Нічого не знайдено</span>
          )}
        </p>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <label className="flex items-center gap-2 px-3 py-1.5 border border-[var(--line)] rounded-lg text-[13px] cursor-pointer">
            <span className="text-[var(--sh-muted)]">Сортувати:</span>
            <select
              name="sort"
              className="bg-transparent text-[var(--ink)] font-medium outline-none cursor-pointer appearance-none"
            >
              <option value="recommended">Рекомендовано</option>
              <option value="price-asc">Спочатку дешевше</option>
              <option value="price-desc">Спочатку дорожче</option>
              <option value="rating">За рейтингом</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </label>

          {/* View toggle */}
          <div className="flex border border-[var(--line)] rounded-lg overflow-hidden">
            <button className="px-3 py-1.5 bg-[var(--ink)] text-[var(--background)]" title="Сітка">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button className="px-3 py-1.5 text-[var(--sh-muted)] hover:bg-[var(--bg-alt)] hover:text-[var(--ink)]" title="Список">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".5"/><circle cx="3.5" cy="12" r=".5"/><circle cx="3.5" cy="18" r=".5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {listings.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-alt)] flex items-center justify-center mb-4 text-[var(--sh-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
          </div>
          <h3 className="font-serif text-[28px] text-[var(--ink)] mb-2">Нічого не знайшли</h3>
          <p className="text-[13.5px] text-[var(--sh-muted)]">Спробуйте змінити параметри пошуку або скинути фільтри</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} {...listing} index={i} initialSaved={savedIds.has(listing.id)} />
          ))}
        </div>
      )}

      {/* Footer note */}
      {listings.length > 0 && (
        <p className="mt-10 pt-6 border-t border-[var(--line)] text-[12.5px] text-[var(--sh-muted)]">
          Показано {listings.length} з {total}. Кожне оголошення проходить перевірку стандартів StayHub.
        </p>
      )}

      {pages > 1 && (
        <div className="mt-8">
          <PaginationControls page={page} pages={pages} />
        </div>
      )}
    </>
  );
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<ListingsQuery>;
}) {
  const params = await searchParams;

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Sticky sub-header: category tabs */}
      <div className="sticky top-[65px] z-40 bg-[var(--background)]">
        <CategoryTabs />

        {/* Search bar */}
        <div className="border-b border-[var(--line)] bg-[var(--background)]">
          <div className="max-w-[1320px] mx-auto px-8 py-3">
            <SearchFilters />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-8 py-8">
        <Suspense fallback={<ListingGridSkeleton />}>
          <ListingsResult searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

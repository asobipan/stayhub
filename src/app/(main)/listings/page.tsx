import { Suspense } from "react";
import { getListings, type ListingsQuery } from "@/lib/listings";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingGridSkeleton } from "@/components/listings/ListingCardSkeleton";
import { SearchFilters } from "@/components/listings/SearchFilters";
import { PaginationControls } from "@/components/listings/PaginationControls";

async function ListingsResult({ searchParams }: { searchParams: ListingsQuery }) {
  const { listings, total, pages, page } = await getListings(searchParams);

  return (
    <>
      <div className="mb-4 text-sm" style={{ color: "#78716C" }}>
        {total > 0 ? (
          <>
            <span className="font-semibold" style={{ color: "#1C1917" }}>
              {total}
            </span>{" "}
            {total === 1 ? "оголошення" : total < 5 ? "оголошення" : "оголошень"}
            {searchParams.city && (
              <span> в «{searchParams.city}»</span>
            )}
          </>
        ) : null}
      </div>

      <ListingGrid listings={listings} />

      {pages > 1 && (
        <div className="mt-10">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1
          className="text-3xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Оголошення
        </h1>
        <p className="text-sm" style={{ color: "#78716C" }}>
          Знаходьте унікальні місця для проживання по всьому світу
        </p>
      </div>

      <SearchFilters />

      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingsResult searchParams={params} />
      </Suspense>
    </div>
  );
}

import { ListingCard } from "./ListingCard";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  avgRating: number;
  reviewCount: number;
}

interface ListingGridProps {
  listings: Listing[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#F5F4F0" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7"
            fill="none"
            stroke="#C4BFBA"
            strokeWidth="1.5"
          >
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
        </div>
        <p
          className="text-base font-medium mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Нічого не знайдено
        </p>
        <p className="text-sm" style={{ color: "#A8A29E" }}>
          Спробуйте змінити параметри пошуку
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} {...listing} />
      ))}
    </div>
  );
}

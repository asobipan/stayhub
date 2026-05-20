import { ListingCard } from "./ListingCard";
import { SearchIcon } from "@/components/ui/icons";

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
        <div className="w-16 h-16 rounded-full bg-[var(--bg-alt)] flex items-center justify-center mb-4 text-[var(--sh-muted)]">
          <SearchIcon size={28} />
        </div>
        <p className="font-serif text-[28px] text-[var(--ink)] mb-2">Нічого не знайдено</p>
        <p className="text-[13.5px] text-[var(--sh-muted)]">Спробуйте змінити параметри пошуку</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing, i) => (
        <ListingCard key={listing.id} {...listing} index={i} />
      ))}
    </div>
  );
}

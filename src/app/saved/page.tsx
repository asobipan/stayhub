import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SavedClient } from "@/components/saved/SavedClient";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const saved = await db.savedListing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          price: true,
          images: true,
          bedrooms: true,
          bathrooms: true,
          maxGuests: true,
          avgRating: true,
          reviewCount: true,
        },
      },
    },
  });

  const listings = saved.map((s) => s.listing);
  const cities = new Set(listings.map((l) => l.city)).size;

  return (
    <SavedClient
      initialListings={listings}
      cityCount={cities}
    />
  );
}

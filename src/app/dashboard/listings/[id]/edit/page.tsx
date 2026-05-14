import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListingForm } from "@/components/dashboard/ListingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const listing = await db.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      address: true,
      city: true,
      country: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      maxGuests: true,
      amenities: true,
      images: true,
      hostId: true,
    },
  });

  if (!listing) notFound();
  if (listing.hostId !== session.user.id && session.user.role !== "ADMIN") redirect("/dashboard/listings");

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Редагування оголошення
        </h1>
        <p className="text-sm" style={{ color: "#78716C" }}>
          {listing.title}
        </p>
      </div>
      <ListingForm
        mode="edit"
        listingId={listing.id}
        initial={{
          title: listing.title,
          description: listing.description,
          address: listing.address,
          city: listing.city,
          country: listing.country,
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          maxGuests: listing.maxGuests,
          amenities: listing.amenities,
          images: listing.images,
        }}
      />
    </div>
  );
}

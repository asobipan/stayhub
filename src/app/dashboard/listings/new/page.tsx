import { ListingForm } from "@/components/dashboard/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "#1C1917" }}
        >
          Нове оголошення
        </h1>
        <p className="text-sm" style={{ color: "#78716C" }}>
          Заповніть інформацію про ваше помешкання
        </p>
      </div>
      <ListingForm mode="new" />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewForm } from "./ReviewForm";

interface Props {
  bookingId: string;
  listingTitle: string;
}

export function LeaveReviewButton({ bookingId, listingTitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        style={{
          background: "#1E1B4B",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(30,27,75,0.2)",
        }}
      >
        <Star className="w-4 h-4" style={{ fill: "#F59E0B", color: "#F59E0B" }} />
        Залишити відгук
      </button>

      {open && (
        <ReviewForm
          bookingId={bookingId}
          listingTitle={listingTitle}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

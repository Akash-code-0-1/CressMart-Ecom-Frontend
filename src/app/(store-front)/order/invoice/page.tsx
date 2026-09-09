"use client";

import { Suspense } from "react";
import ThankYouContent from "@/components/store-front/thank_you/ThankYouContent"; // Adjust path as needed

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Invoice...</div>}>
      <ThankYouContent showThankYou={false} />
    </Suspense>
  );
}
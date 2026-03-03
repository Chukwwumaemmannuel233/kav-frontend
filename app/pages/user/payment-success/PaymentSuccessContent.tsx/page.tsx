"use client";

import { Suspense } from "react";
import PaymentSuccessPage from "../page";

export default function PaymentSuccessContent() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Loading...</p>
    </div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
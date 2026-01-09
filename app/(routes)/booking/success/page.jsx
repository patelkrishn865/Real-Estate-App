// app/booking/success/page.jsx

export const dynamic = 'force-dynamic'; // ← Yeh top pe hona chahiye
export const revalidate = 0; // Optional: extra safety

'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!bookingId) {
      setStatus("error");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (data.status === "paid") {
          setStatus("paid");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          {status === "paid" ? "🎉 Booking Confirmed!" : "⏳ Confirming Payment…"}
        </h1>

        <p className="text-gray-600 mb-6">
          {status === "paid"
            ? "Your booking has been successfully confirmed."
            : "Please wait while we verify your payment. This may take a few seconds."}
        </p>

        {bookingId && (
          <p className="text-sm text-gray-400 font-mono bg-gray-100 px-4 py-2 rounded mb-6">
            Booking ID: {bookingId}
          </p>
        )}

        <Link href="/">
          <Button size="lg" className="w-full">
            Go to Home
          </Button>
        </Link>

        {status === "pending" && (
          <p className="text-xs text-gray-500 mt-6">
            Do not refresh or close this page.
          </p>
        )}
      </div>
    </div>
  );
}
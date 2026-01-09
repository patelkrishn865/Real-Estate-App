"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!bookingId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();

      if (data.status === "paid") {
        setStatus("paid");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 border rounded-lg text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {status === "paid" ? "Booking Confirmed 🎉" : "Confirming Payment…"}
        </h1>

        <p className="text-gray-600">
          {status === "paid"
            ? "Your booking is confirmed."
            : "Please wait while we verify your payment."}
        </p>

        <p className="text-xs text-gray-400 font-mono">
          Booking ID: {bookingId}
        </p>

        <Link href='/'>
        <Button className='cursor-pointer'>
            Go to Home
        </Button>
        </Link>
      </div>
    </div>
  );
}

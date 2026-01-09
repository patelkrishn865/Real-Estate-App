"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 border rounded-lg text-center space-y-4 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600">
          Your booking payment has been completed successfully.
        </p>

        <p className="text-xs text-gray-400">
          Booking confirmation has been handled securely.
        </p>

        <Link href="/">
          <Button className="w-full cursor-pointer">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

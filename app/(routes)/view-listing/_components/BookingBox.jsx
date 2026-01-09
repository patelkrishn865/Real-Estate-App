'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import React from 'react'

function BookingBox({ listing }) {

    const { user } = useUser();

    const isLoggedIn = !!user
    const isOwner = user?.primaryEmailAddress?.emailAddress === listing?.createdBy
    const isRent = listing.type
    const bookingAmount =  5000

    if(isOwner || listing?.type === "Rent") return null;

    
const handleBooking = async () => {
    const check = await fetch("/api/bookings/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
    
      const { available } = await check.json();
    
      if (!available) {
        alert("This property is already booked.");
        return;
      }
    
  
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        listingId: listing.id,
        amount: bookingAmount,
        address: listing.address,
        userId: user.id, 
      }),
    });
  
    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      return;
    }
  
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className='bg-white border p-5 rounded-lg border-gray-200 space-y-4'>
        <h2 className='text-lg font-bold'>Book This Property</h2>

        <p className='text-sm text-gray-600'>
            Pay a refundable booking amount to confirm your interest and schedule a visit.
        </p>

        <div className='flex items-center justify-between'>
            <span className='text-lg font-semibold text-primary'>
                ₹5,000
            </span>
            <span className='text-xs text-gray-500'>
                Fully refundable*
            </span>
        </div>

        <Button disabled={!isLoggedIn} onClick={handleBooking} className='w-full text-white py-3 rounded-md font-semibold hover:opacity-90'>
            {isLoggedIn ? 'Book Now' : 'Login to Book'}
        </Button>

        <p className='text-xs text-gray-500'>
            *This is not a property sell payment.
        </p>
    </div>
  )
}

export default BookingBox
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { listingId, amount, address, userId } = body;

    if (!listingId || !amount || !address || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        listing_id: listingId,
        user_id: userId,
        amount,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?bookingId=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel?bookingId=${booking.id}`,
      metadata: {
        bookingId: booking.id,
        listingId,
        userId,
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Booking – ${address}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
    });

    await supabaseAdmin
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

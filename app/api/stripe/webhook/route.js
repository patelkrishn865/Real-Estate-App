import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed", err.message)
        return new NextResponse("Invalid Signature", { status: 400 })
    }

    try{
        if(event.type === "checkout.session.completed") {
            const session = event.data.object;

            const bookingId = session.metadata?.bookingId;

            if(!bookingId) {
                throw new Error("Missing bookingId in metadata")
            }

            const { error } = await supabaseAdmin
               .from('bookings')
               .update({
                status: 'paid',
               })
               .eq('id', bookingId)
               .eq('status', 'pending');

               if(error) {
                console.error("Failed to update booking", error);
                throw error;
               }

               console.log("Booking Marked as PAID:", bookingId);
        }

        return NextResponse.json({ received: true})
    } catch (err) {
        console.error("Webhook processing error", err);
        return new NextResponse("Webhook handler failed", { status: 500 })
    }
}
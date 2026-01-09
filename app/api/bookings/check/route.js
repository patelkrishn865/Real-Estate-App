import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req) {
  const { listingId } = await req.json();

  const { data } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("listing_id", listingId)
    .eq("status", "paid")
    .limit(1);

  return NextResponse.json({
    available: data.length === 0,
  });
}

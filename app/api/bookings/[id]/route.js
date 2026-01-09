import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function GET(req, { params }) {
    const para = await params
  const bookingId = para.id;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: data.status });
}

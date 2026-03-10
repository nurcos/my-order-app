import { NextResponse } from "next/server";
import { getClosingTime, isOpen } from "../../../lib/utils"
import { pb } from "@/lib/pb";

const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN || "";
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";

export async function POST(req: Request) {
  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  var price = 0;

  try {
    const body = await req.json();
    const restaurant = body.restaurant;

    // we need to make sure restaurant is open
    if (!isOpen(restaurant)) {
      return NextResponse.json({ error: "Restaurant is closed" }, { status: 400 });
    }

    
    // we need to create the payment intent
    // once payment created we need to confirm the order (emails) and orders in db
  } catch (error) {
    console.error("Error completing order:", error);
    return NextResponse.json({ error: "Failed to complete order" }, { status: 500 });
  }

  return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}
import { NextResponse } from "next/server";
import { isOpen } from "../../../lib/utils";
import Stripe from "stripe";

const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN || "";
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

const stripe = new Stripe(STRIPE_SECRET);

function toPence(amount: number) {
  return Math.round(amount * 100);
}

async function fetchOrder(orderId: string) {
  const res = await fetch(
    `${BASE_URL}/api/collections/orders/records/${encodeURIComponent(orderId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-App-Secret": ADMIN_TOKEN,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch order (${res.status})`);
  return res.json();
}

async function fetchRestaurant(restaurantId: string) {
  const res = await fetch(
    `${BASE_URL}/api/collections/stores/records/${encodeURIComponent(restaurantId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-App-Secret": ADMIN_TOKEN,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch restaurant (${res.status})`);
  return res.json();
}

async function updateOrder(orderId: string, data: Record<string, any>) {
  const res = await fetch(
    `${BASE_URL}/api/collections/orders/records/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-App-Secret": ADMIN_TOKEN,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Failed to update order (${res.status})`);
  return res.json();
}

export async function POST(req: Request) {
  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { order_id, restaurant_id, cart_items } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    if (!restaurant_id) {
      return NextResponse.json({ error: "Missing restaurant ID" }, { status: 400 });
    }

    if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
      return NextResponse.json({ error: "Missing cart items" }, { status: 400 });
    }

    const restaurant = await fetchRestaurant(restaurant_id);

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // 2) fetch order from PocketBase (await — not .then)
    const order = await fetchOrder(order_id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3) compute total server-side (never trust client subtotal)
    const subtotal = Number(order.subtotal ?? 0);
    const deliveryPrice = Number(order.delivery_price ?? 0);
    const tax = Number(order.tax ?? 0);
    const total = Math.round((subtotal + deliveryPrice + tax) * 100) / 100;

    if (total <= 0) {
      return NextResponse.json({ error: "Order total is invalid" }, { status: 422 });
    }

    const delivery_info = order.delivery_info;

    // 4) create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toPence(total),
      currency: "gbp",
      description: `Order ${order.id} at ${restaurant?.name ?? "restaurant"}`,
      receipt_email: delivery_info?.email ?? undefined,
      shipping: {
        name: delivery_info?.firstName + ' ' + delivery_info?.lastName,
        address: {
          line1: delivery_info?.address ?? undefined,
          postal_code: delivery_info?.postCode ?? undefined,
          city: delivery_info?.city ?? undefined,
        },
      },
      metadata: {
        order_id: order.id,
        restaurant_id: restaurant?.id ?? "",
      },
    });
    
    // 5) save paymentIntentId back to order record
    await updateOrder(order.id, {
      payment_id: paymentIntent.id,
    });

    const emailRes = await fetch(`${SITE_URL}/api/confirmEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order,
        restaurant,
        cart_items
      }),
    });

    console.log(emailRes)

    if (!emailRes.ok) {
      console.error('Error sending confirmation email:', await emailRes.text());
    }

    // 6) return client secret to frontend so it can confirm payment
    return NextResponse.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      subtotal,
      deliveryPrice,
      tax,
      total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Failed to complete order" }, { status: 500 });
  }
}
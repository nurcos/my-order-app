import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN!;

const pb = new PocketBase(BASE_URL);

function auth() {
  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  pb.beforeSend = function (url, options) {
    options.headers = {
      ...(options.headers || {}),
      "X-App-Secret": ADMIN_TOKEN,
    };
    return { url, options };
  };
}

export async function GET(request: Request) {
  auth();

  // Get query params from the request URL
  const { searchParams } = new URL(request.url);
  const collectionName = searchParams.get("collection");
  const expandParams = searchParams.get("expand");

  if (!collectionName) {
    return NextResponse.json(
      { error: "Collection name is required" },
      { status: 400 },
    );
  }

  const data = await pb.collection(collectionName).getFullList({
    ...(expandParams ? { expand: expandParams } : {}),
  });

  return NextResponse.json(data, { status: data ? 200 : 404 });
}

export async function POST(request: Request) {
  auth();

  const { collectionName, data } = await request.json();

  if (!collectionName) {
    return NextResponse.json(
      { error: "Collection is required" },
      { status: 400 },
    );
  }

  const created = await pb.collection(collectionName).create(data);

  return NextResponse.json(created, { status: created ? 201 : 404 });
}

export async function PATCH(request: Request) {
  auth();

  const { collection, id, data } = await request.json();

  if (!collection || !id || !data) {
    return NextResponse.json(
      { error: "Collection, id, and data are required" },
      { status: 400 },
    );
  }

  // if updating orders with item_ids, recompute subtotal server-side
  if (collection === "orders" && data.item_ids) {
    const order = await pb.collection(collection).getOne(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const itemIds: string[] = JSON.parse(data.item_ids);

    // count how many times each id appears (this IS the quantity)
    const idCountMap: Record<string, number> = {};
    for (const itemId of itemIds) {
      idCountMap[itemId] = (idCountMap[itemId] ?? 0) + 1;
    }

    console.log("idCountMap (id -> quantity)", idCountMap);

    // fetch each unique id once
    const uniqueIds = Object.keys(idCountMap);
    const items = await Promise.all(
      uniqueIds.map((uid) =>
        pb
          .collection("menu_item_variants")
          .getOne(uid)
          .catch(() => {
            console.warn(`could not fetch menu_item_variant ${uid}`);
            return null;
          }),
      ),
    );

    console.log("fetched items", items);

    // compute subtotal: price * quantity
    let newSubtotal = 0;
    for (const item of items) {
      if (!item) continue;
      const qty = idCountMap[item.id] ?? 1;
      const price = Number(item.base_price ?? 0);
      console.log(
        `item ${item.id} price=${price} qty=${qty} line=${price * qty}`,
      );
      newSubtotal += price * qty;
    }

    data.subtotal = Math.round(newSubtotal * 100) / 100;
    console.log("computed subtotal", data.subtotal);
  }

  const updated = await pb.collection(collection).update(id, data);

  return NextResponse.json(updated, { status: updated ? 200 : 404 });
}

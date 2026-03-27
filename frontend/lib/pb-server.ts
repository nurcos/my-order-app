const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN || "";

const headers = {
  "Content-Type": "application/json",
  "X-App-Secret": ADMIN_TOKEN,
};

export async function fetchOrder(orderId: string) {
  const res = await fetch(
    `${BASE_URL}/api/collections/orders/records/${encodeURIComponent(orderId)}`,
    { headers, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to fetch order (${res.status})`);
  return res.json();
}

export async function fetchRestaurant(restaurantId: string) {
  const res = await fetch(
    `${BASE_URL}/api/collections/stores/records/${encodeURIComponent(restaurantId)}`,
    { headers, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to fetch restaurant (${res.status})`);
  return res.json();
}

export async function updateOrder(orderId: string, data: Record<string, any>) {
  const res = await fetch(
    `${BASE_URL}/api/collections/orders/records/${encodeURIComponent(orderId)}`,
    { method: "PATCH", headers, body: JSON.stringify(data), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to update order (${res.status})`);
  return res.json();
}

export async function fetchRecord(collection: string, id: string, expand?: string) {
  const qs = expand ? `?expand=${encodeURIComponent(expand)}` : "";
  const res = await fetch(
    `${BASE_URL}/api/collections/${encodeURIComponent(collection)}/records/${encodeURIComponent(id)}${qs}`,
    { headers, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to fetch ${collection} record (${res.status})`);
  return res.json();
}

export async function createRecord(collection: string, data: Record<string, any>) {
  const res = await fetch(
    `${BASE_URL}/api/collections/${encodeURIComponent(collection)}/records`,
    { method: "POST", headers, body: JSON.stringify(data), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to create ${collection} record (${res.status})`);
  return res.json();
}
import { NextResponse } from "next/server";

function toRad(v: number) {
  return (v * Math.PI) / 180;
}
function haversineKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function geocodePostcode(pc: string) {
  const clean = encodeURIComponent(pc.trim());
  // try postcodes.io (UK)
  try {
    const r = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
    if (r.ok) {
      const j = await r.json();
      if (j?.status === 200 && j?.result?.latitude != null) {
        return { lat: Number(j.result.latitude), lon: Number(j.result.longitude), source: "postcodes.io" };
      }
    }
  } catch (e) {
    // ignore and fallback
  }

  // fallback: Nominatim (global)
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${clean}&format=json&limit=1`,
      { headers: { "User-Agent": "my-order-app/1.0 (contact@example.com)" } }
    );
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j) && j.length) {
        return { lat: Number(j[0].lat), lon: Number(j[0].lon), source: "nominatim" };
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerPostcode = (body?.customerPostcode ?? "").trim();
    const restaurantPostcode = (body?.restaurantPostcode ?? "").trim();

    if (!customerPostcode || !restaurantPostcode) {
      return NextResponse.json({ error: "customerPostcode and restaurantPostcode required" }, { status: 400 });
    }

    const [custGeo, restGeo] = await Promise.all([
      geocodePostcode(customerPostcode),
      geocodePostcode(restaurantPostcode),
    ]);

    if (!custGeo || !restGeo) {
      return NextResponse.json({ error: "failed to geocode one or both postcodes" }, { status: 422 });
    }

    // compute distance in miles (convert from km)
    const distanceMiles = haversineKm([restGeo.lat, restGeo.lon], [custGeo.lat, custGeo.lon]) * 0.621371;

    // simple cost formula (adjust as needed)
    const base = 1.5; // GBP
    const perMile = 0.2; // GBP per mile
    const raw = base + perMile * distanceMiles;
    const cost = Math.round(raw * 100) / 100;

    console.log(`Distance: ${distanceMiles.toFixed(2)} miles, Cost: £${cost.toFixed(2)}`);

    return NextResponse.json({
      distanceMiles,
      deliveryCost: cost,
      geo: { customer: custGeo, restaurant: restGeo },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
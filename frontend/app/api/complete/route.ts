import { NextResponse } from "next/server";

const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN!;

export async function POST() {
	if (!ADMIN_TOKEN) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const res = await fetch(`${BASE_URL}/api/collections/stores/records`, {
		headers: {
			"Content-Type": "application/json",
			"X-App-Secret": `${ADMIN_TOKEN}`,
		},
		cache: "no-store",
	});
	const data = await res.json();
	
	return NextResponse.json(data, { status: res.ok ? 200 : res.status });
	
}
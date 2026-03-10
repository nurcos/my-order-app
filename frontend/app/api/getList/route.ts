import { NextResponse } from "next/server";
import PocketBase from 'pocketbase';

const BASE_URL = process.env.POCKETBASE_URL || "http://localhost:8090";
const ADMIN_TOKEN = process.env.POCKETBASE_ADMIN_TOKEN!;

const pb = new PocketBase(BASE_URL);

export async function GET(request: Request) {
	if (!ADMIN_TOKEN) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	pb.beforeSend = function(url, options) {
		options.headers = {
			...(options.headers || {}),
			"X-App-Secret": ADMIN_TOKEN,
		};
		return { url, options };
	};

	// Get query params from the request URL
	const { searchParams } = new URL(request.url);
	const collectionName = searchParams.get("collection");
	const expandParams = searchParams.get("expand");

	if (!collectionName) {
		return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
	}

	const data = await pb.collection(collectionName).getFullList({
		...expandParams ? { 'expand': expandParams } : {},
	});


	return NextResponse.json(data, { status: data ? 200 : 404 });
}

export async function POST(request: Request) {
	if (!ADMIN_TOKEN) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	pb.beforeSend = function(url, options) {
		options.headers = {
			...(options.headers || {}),
			"X-App-Secret": ADMIN_TOKEN,
		};
		return { url, options };
	};

	const { collection, data } = await request.json();

	if (!collection || !data) {
		return NextResponse.json({ error: "Collection and data are required" }, { status: 400 });
	}

	const created = await pb.collection(collection).create(data);

	return NextResponse.json(created, { status: created ? 201 : 404 });
}

export async function PATCH(request: Request) {
	if (!ADMIN_TOKEN) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	pb.beforeSend = function(url, options) {
		options.headers = {
			...(options.headers || {}),
			"X-App-Secret": ADMIN_TOKEN,
		};
		return { url, options };
	};

	const { collection, id, data } = await request.json();

	if (!collection || !id || !data) {
		return NextResponse.json({ error: "Collection, id, and data are required" }, { status: 400 });
	}

	const updated = await pb.collection(collection).update(id, data);

	return NextResponse.json(updated, { status: updated ? 200 : 404 });
}

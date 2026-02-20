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

	console.log(expandParams, 'this is expandParams')

	const data = await pb.collection(collectionName).getFullList({
		...expandParams ? { 'expand': expandParams } : {},
	});


	return NextResponse.json(data, { status: data ? 200 : 404 });
}
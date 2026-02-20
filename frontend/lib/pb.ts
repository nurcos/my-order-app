export const pb = {
	async get(collectionName: string, expandParams?: string) {
		const res = await fetch(`/api/pb?collection=${encodeURIComponent(collectionName)}${expandParams ? '&expand=' + expandParams : ''}`, { cache: "no-store" });
		if (!res.ok) throw new Error(`Failed (${res.status})`);
		const data = await res.json();
		return data;
	}
}
export const pb = {
	async get(collectionName: string, expandParams?: string) {
		const res = await fetch(`/api/pb?collection=${encodeURIComponent(collectionName)}${expandParams ? '&expand=' + expandParams : ''}`, { cache: "no-store" });
		if (!res.ok) throw new Error(`Failed (${res.status})`);
		const data = await res.json();
		return data;
	}
}

export const api = {
	async checkPostCode(postCode1: string, postCode2: string): Promise<any | null> {
		const res = await fetch(`/api/address?postCode1=${postCode1}&postCode2=${postCode2}`);
		if (!res.ok) throw new Error(`Failed (${res.status})`);
		const data = await res.json();
		return data;
	}
}
export const pb = {
  async get(collectionName: string, id?: string, expandParams?: string) {
    const qs = `collection=${encodeURIComponent(collectionName)}${id ? `&id=${encodeURIComponent(id)}` : ""}${expandParams ? "&expand=" + encodeURIComponent(expandParams) : ""}`;
    const res = await fetch(`/api/pb?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    return res.json();
  },

  async post(collectionName: string, body?: Record<string, any>) {
    const res = await fetch(`/api/pb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionName, data: body ?? {} }),
    });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    return res.json();
  },

  async update(collectionName: string, id: string, body: Record<string, any>) {
    const res: any = await fetch(`/api/pb`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: collectionName, id, data: body }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error ?? err?.message ?? `Failed (${res.status})`);
    }
    return res.json();
  },

  async delete(collectionName: string, id: string) {
    const res = await fetch(`/api/pb`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: collectionName, id }),
    });
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    return res.json();
  },
};

export const api = {
	async checkPostCode(postCode1: string, postCode2: string): Promise<any | null> {
		const res = await fetch(`/api/address?postCode1=${postCode1}&postCode2=${postCode2}`);
		if (!res.ok) throw new Error(`Failed (${res.status})`);
		const data = await res.json();
		return data;
	}
}
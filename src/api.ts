import type { BeatRequest, BeatResponse } from "./contracts";

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  "https://characterarc-backend-production.up.railway.app";

export async function requestBeat(payload: BeatRequest): Promise<BeatResponse> {
  const res = await fetch(`${API_BASE}/api/beat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error("Beat request failed: " + msg);
  }
  return res.json();
}

import type { BeatRequest, BeatResponse } from "./contracts";

export async function requestBeat(payload: BeatRequest): Promise<BeatResponse> {
  const res = await fetch("/api/beat", {
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
      // Ignore JSON parse errors
    }
    throw new Error("Beat request failed: " + msg);
  }
  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function HealthCheck() {
  const [status, setStatus] = useState<string>("idle");

  const check = async () => {
    try {
      const res = await fetch("/health");
      const data = await res.json();
      setStatus(JSON.stringify(data));
    } catch (e: any) {
      setStatus("error: " + e?.message);
    }
  };

  return (
    <div className="text-sm">
      <button className="underline" onClick={check}>
        Check API health
      </button>
      <div className="mt-2 text-gray-600 break-all">{status}</div>
    </div>
  );
}

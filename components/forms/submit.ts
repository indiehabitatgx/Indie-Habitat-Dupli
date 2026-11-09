import type { FormResponse } from "@/types/enquiry";

export async function postJson(url: string, body: unknown): Promise<FormResponse> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => null)) as FormResponse | null;
    if (data && typeof data.ok === "boolean") return data;
    return { ok: false, message: "Something went wrong. Please try again or call us." };
  } catch {
    return { ok: false, message: "Network error — check your connection and try again." };
  }
}

import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";

// TEMPORARY: diagnose Netlify Blobs on the deployed site. Remove once fixed.
async function attempt(label: string, fn: () => Promise<unknown>) {
  const start = Date.now();
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout 8s")), 8000)),
    ]);
    return { label, ok: true, ms: Date.now() - start, result };
  } catch (e) {
    return { label, ok: false, ms: Date.now() - start, error: String(e) };
  }
}

export async function GET() {
  const ctx = process.env.NETLIFY_BLOBS_CONTEXT;
  let decoded: Record<string, unknown> | null = null;
  try {
    decoded = ctx ? JSON.parse(Buffer.from(ctx, "base64").toString()) : null;
  } catch {}
  const context = decoded
    ? Object.fromEntries(Object.entries(decoded).map(([k, v]) => [k, k === "token" ? "(hidden)" : v]))
    : null;
  const globalCtx = (globalThis as Record<string, unknown>).netlifyBlobsContext ? "present" : "absent";

  const results = [
    await attempt("fetch example.com", async () => (await fetch("https://example.com", { cache: "no-store" })).status),
    await attempt("fetch blobs edge (no auth)", async () =>
      (await fetch("https://edge.netlifyblobs.com/", { cache: "no-store" })).status
    ),
    await attempt("eventual get", () => getStore("data").get("settings", { type: "json" })),
    await attempt("strong get", () =>
      getStore({ name: "data", consistency: "strong" }).get("settings", { type: "json" })
    ),
  ];
  return Response.json({ hasEnvContext: !!ctx, context, globalCtx, results });
}

import { getFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

const SAFE_SEGMENT = /^[a-zA-Z0-9_.-]+$/;
const TYPES_BY_EXT: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Serves images uploaded from the admin (stored in Netlify Blobs, or ./data/uploads locally). */
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (!path.every((segment) => SAFE_SEGMENT.test(segment) && segment !== "..")) {
    return new Response("Not found", { status: 404 });
  }

  const file = await getFile(path.join("/"));
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.data, {
    headers: {
      "Content-Type": file.contentType ?? TYPES_BY_EXT[path.at(-1)!.split(".").pop()!] ?? "application/octet-stream",
      // File names include a timestamp, so their content never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

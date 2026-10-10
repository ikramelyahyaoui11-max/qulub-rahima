import fs from "fs/promises";
import path from "path";
import { getStore, type Store } from "@netlify/blobs";

/**
 * Persistent key/value storage.
 * - On Netlify: Netlify Blobs (free, survives redeploys).
 * - Locally (`npm run dev`): plain files under ./data, as before.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function blobStore(name: string): Store | null {
  try {
    return getStore({ name, consistency: "strong" });
  } catch {
    // No Netlify Blobs environment (local dev) — fall back to the filesystem.
    return null;
  }
}

function localPath(storeName: string, key: string): string {
  // JSON data keeps its historical location (data/<key>.json) so existing local files still load.
  return storeName === "data"
    ? path.join(DATA_DIR, `${key}.json`)
    : path.join(DATA_DIR, storeName, key);
}

export async function readJSON<T>(key: string, seed: T): Promise<T> {
  const store = blobStore("data");
  if (store) {
    const value = await store.get(key, { type: "json" });
    return value === null ? seed : (value as T);
  }
  try {
    return JSON.parse(await fs.readFile(localPath("data", key), "utf-8")) as T;
  } catch {
    return seed;
  }
}

export async function writeJSON<T>(key: string, data: T): Promise<void> {
  const store = blobStore("data");
  if (store) {
    await store.setJSON(key, data);
    return;
  }
  const file = localPath("data", key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Read-modify-write that retries if another request changed the value in between,
 * so concurrent orders can't overwrite each other or reuse an order number.
 */
export async function updateJSON<T>(
  key: string,
  seed: T,
  update: (current: T) => T
): Promise<T> {
  const store = blobStore("data");
  if (!store) {
    const next = update(await readJSON(key, seed));
    await writeJSON(key, next);
    return next;
  }
  for (let attempt = 0; attempt < 10; attempt++) {
    const existing = await store.getWithMetadata(key, { type: "json" });
    const next = update(existing ? (existing.data as T) : seed);
    const result = existing?.etag
      ? await store.setJSON(key, next, { onlyIfMatch: existing.etag })
      : await store.setJSON(key, next, { onlyIfNew: true });
    if (result.modified) return next;
  }
  throw new Error(`Could not update "${key}" after several attempts`);
}

export async function putFile(key: string, data: ArrayBuffer, contentType: string): Promise<void> {
  const store = blobStore("uploads");
  if (store) {
    await store.set(key, data, { metadata: { contentType } });
    return;
  }
  const file = localPath("uploads", key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, Buffer.from(data));
}

export async function getFile(
  key: string
): Promise<{ data: ArrayBuffer; contentType?: string } | null> {
  const store = blobStore("uploads");
  if (store) {
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) return null;
    return { data: result.data, contentType: result.metadata.contentType as string | undefined };
  }
  try {
    const buffer = await fs.readFile(localPath("uploads", key));
    return { data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer };
  } catch {
    return null;
  }
}

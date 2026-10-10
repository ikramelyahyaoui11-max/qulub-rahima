import crypto from "crypto";
import type { Order } from "./store";

/**
 * Live sync of orders to a Google Sheet using a service account — no extra
 * npm dependency, just a hand-rolled JWT (Node's crypto) exchanged for an
 * OAuth access token, then a plain REST call to the Sheets API.
 *
 * Setup (see .env.example):
 * 1. Create a Google Cloud service account, enable the Sheets API for it.
 * 2. Create a JSON key for it — use its "client_email" and "private_key".
 * 3. Share the target spreadsheet with that client_email (Editor access).
 * 4. Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY and
 *    GOOGLE_SHEETS_SPREADSHEET_ID in .env.local (or the host's env vars).
 */

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEET_RANGE = "Orders!A:I";

type Credentials = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
};

function getCredentials(): Credentials | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!clientEmail || !privateKeyRaw || !spreadsheetId) return null;
  // .env values can't hold real newlines, so the key is stored with literal "\n" escapes.
  return { clientEmail, privateKey: privateKeyRaw.replace(/\\n/g, "\n"), spreadsheetId };
}

/** Whether GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_SPREADSHEET_ID are all set. */
export function isGoogleSheetsConfigured(): boolean {
  return getCredentials() !== null;
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const signingInput = `${header}.${claims}`;
  const signature = base64url(crypto.createSign("RSA-SHA256").update(signingInput).sign(privateKey));
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`تعذر تسجيل الدخول إلى Google (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function orderRow(order: Order): string[] {
  const items = order.items
    .map((item) => {
      const details: string[] = [];
      if (item.addon) details.push(item.addon);
      if (item.intention) details.push(item.intention);
      if (item.dedicationName) details.push(item.dedicationName);
      const detailStr = details.length ? ` (${details.join(" - ")})` : "";
      return `${item.name}${detailStr} × ${item.quantity}`;
    })
    .join(" | ");

  return [
    order.orderNumber ?? "",
    order.createdAt,
    order.name,
    order.phone,
    order.whatsappNumber ?? "",
    items,
    order.totalDisplay,
    order.currencySymbol,
    order.contacted ? "نعم" : "لا",
  ];
}

async function appendRows(creds: Credentials, rows: string[][]): Promise<void> {
  const accessToken = await getAccessToken(creds.clientEmail, creds.privateKey);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${creds.spreadsheetId}/values/${encodeURIComponent(
    SHEET_RANGE
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows }),
  });
  if (!res.ok) {
    throw new Error(`تعذرت مزامنة Google Sheets (${res.status}): ${await res.text()}`);
  }
}

/**
 * Appends one order as a new row. Silently does nothing if sync isn't
 * configured — callers treat this as best-effort and shouldn't let a
 * Sheets hiccup block saving the order itself.
 */
export async function appendOrderToSheet(order: Order): Promise<void> {
  const creds = getCredentials();
  if (!creds) return;
  await appendRows(creds, [orderRow(order)]);
}

/** Re-syncs a full list of orders in one call — used for the admin "sync now" backfill. */
export async function syncAllOrdersToSheet(orders: Order[]): Promise<{ synced: number }> {
  const creds = getCredentials();
  if (!creds) {
    throw new Error(
      "Synchronisation Google Sheets non configurée. Ajoutez GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY et GOOGLE_SHEETS_SPREADSHEET_ID dans .env.local pour l'activer (voir .env.example)."
    );
  }
  if (orders.length === 0) return { synced: 0 };
  await appendRows(creds, orders.map(orderRow));
  return { synced: orders.length };
}

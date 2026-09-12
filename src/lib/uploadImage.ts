import fs from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

/** Saves an uploaded image under public/<targetDir>/ and returns its public path, or null if no file was provided. */
export async function saveUploadedImage(
  file: File | null,
  targetDir: string,
  baseName: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new Error("صيغة الصورة غير مدعومة (استخدم JPG أو PNG أو WEBP)");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("حجم الصورة كبير جدًا (الحد الأقصى 8 ميجابايت)");
  }

  const safeBase = baseName.replace(/[^a-zA-Z0-9_-]/g, "") || "image";
  const fileName = `${safeBase}-${Date.now()}.${ext}`;
  const absDir = path.join(process.cwd(), "public", targetDir);
  await fs.mkdir(absDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(absDir, fileName), buffer);

  return `/${targetDir}/${fileName}`;
}

import { promises as fs } from "node:fs";

export async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function atomicWrite(filePath, data) {
  const tempFile = filePath + ".tmp";
  await fs.writeFile(tempFile, data, "utf8");
  await fs.rename(tempFile, filePath);
}

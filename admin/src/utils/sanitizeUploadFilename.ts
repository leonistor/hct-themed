export const sanitizeUploadFilename = (filename: string): string => {
  const extensionIndex = filename.lastIndexOf(".");
  const extension = extensionIndex > 0 ? filename.slice(extensionIndex).toLowerCase() : "";
  const basename = extensionIndex > 0 ? filename.slice(0, extensionIndex) : filename;
  const safeBasename = basename
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeBasename || "upload"}${extension}`;
};

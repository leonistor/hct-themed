import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { flattenLinks, dedupe, type MenuNode } from "./menuLinks";

/**
 * Generates `tests/ci-links.json` — the list of internal links the CI link-check
 * suite (`tests/ci-links.spec.ts`) will render and audit for console errors.
 *
 * Link sources:
 *  - the homepage itself (`/`)
 *  - the romanian top navigation + footer links (from `web/src/config/menu.ro.json`)
 *  - the english homepage (`/en`)
 *  - a deterministic spread sample of 20 product detail pages from `/products`
 *
 * The menu is read statically (no browser needed) so generation stays fast and
 * does not depend on a running server. Product codes are discovered by fetching
 * the live `/products` listing, which server-renders `/product/<code>` anchors.
 *
 * Run: `bun utils/generate-ci-links.ts` (or `bun run generate:ci-links` from e2e).
 * Defaults to the local dev server; override with `BASE_URL=https://example.com bun ...`.
 */

const here = dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.BASE_URL ?? "http://localhost:4321";
const PRODUCT_SAMPLE_SIZE = 20;

function loadMenuLinks(): string[] {
  const menuPath = join(here, "../../web/src/config/menu.ro.json");
  const menu = JSON.parse(readFileSync(menuPath, "utf-8")) as {
    headerPrimary?: MenuNode[];
    footerPrimary?: MenuNode[];
    footerSecondary?: MenuNode[];
  };
  const urls = [
    ...flattenLinks(menu.headerPrimary ?? []),
    ...flattenLinks(menu.footerPrimary ?? []),
    ...flattenLinks(menu.footerSecondary ?? []),
  ];
  return dedupe(urls);
}

async function loadProductLinks(): Promise<string[]> {
  const res = await fetch(`${baseURL}/products?limit=100`, {
    headers: { accept: "text/html" },
  });
  if (!res.ok) {
    throw new Error(`/products request failed with status ${res.status}`);
  }
  const html = await res.text();
  const hrefs = html.match(/href="(\/product\/[^"]+)"/g) ?? [];
  const links = hrefs.map((h) => h.replace(/^href="/, "").replace(/"$/, ""));
  return dedupe(links);
}

/** Deterministic, evenly-spread sample so CI results are reproducible. */
function sample(list: string[], size: number): string[] {
  const sorted = [...list].sort();
  if (sorted.length <= size) return sorted;
  const stride = Math.ceil(sorted.length / size);
  const out: string[] = [];
  for (let i = 0; i < sorted.length && out.length < size; i += stride) {
    const item = sorted[i];
    if (item !== undefined) out.push(item);
  }
  return out;
}

async function main() {
  const navLinks = loadMenuLinks();
  const productLinks = sample(await loadProductLinks(), PRODUCT_SAMPLE_SIZE);

  const links = dedupe(["/", ...navLinks, "/en", ...productLinks]).sort();

  const payload = {
    generatedAt: new Date().toISOString(),
    baseURL,
    count: links.length,
    links,
  };

  const outPath = join(here, "../tests/ci-links.json");
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

  console.log(
    `Wrote ${links.length} links to ${outPath} (nav=${navLinks.length}, products=${productLinks.length})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

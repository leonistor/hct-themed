import type { Page } from "@playwright/test";

export type MenuNode = {
	enable?: boolean;
	url?: string;
	name?: string;
	children?: MenuNode[];
	menus?: { children?: MenuNode[] }[];
};

export function flattenLinks(items: MenuNode[]): string[] {
	const urls: string[] = [];
	for (const item of items) {
		if (item.enable === false) continue;
		if (item.url) urls.push(item.url);
		if (item.children?.length) urls.push(...flattenLinks(item.children));
		for (const menu of item.menus ?? []) {
			if (menu.children?.length) urls.push(...flattenLinks(menu.children));
		}
	}
	return urls;
}

export function dedupe(urls: string[]): string[] {
	return [...new Set(urls)];
}

export async function collectHomepageLinks(page: Page): Promise<string[]> {
	const hrefs = await page
		.locator("a[href]")
		.evaluateAll((anchors) =>
			anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
		);
	return dedupe(
		hrefs.filter(
			(h) =>
				h.startsWith("/") &&
				!h.startsWith("//") &&
				h !== "/" &&
				!h.includes("#"),
		),
	);
}

import { expect } from "@playwright/test";
import { test } from "../fixtures";
import { collectHomepageLinks } from "../utils/menuLinks";

test("homepage links respond", async ({ page }) => {
	await page.goto("/");
	const links = await collectHomepageLinks(page);
	expect(links.length).toBeGreaterThan(0);

	for (const href of links) {
		const response = await page.request.get(
			new URL(href, page.url()).toString(),
		);
		expect(response.status(), `homepage link ${href}`).toBeLessThan(400);
	}
});

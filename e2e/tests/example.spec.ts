import { expect } from "@playwright/test";
import menu_ro from "../../web/src/config/menu.ro.json" with { type: "json" };
import { test } from "../fixtures";

test("has title", async ({ page }) => {
	await page.goto("/");
});

test("visit homepage", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/Trading/);
});

test("visit menu items", async ({ page }) => {
	await page.goto("/");
	for (const url of getMenuItems()) {
		test.slow();
		await page.goto(url);
	}
});

function getMenuItems() {
	const result = [];
	for (const item of menu_ro.headerPrimary) {
		if (item.children) {
			for (const child of item.children) {
				if (child.children) {
					for (const grandchild of child.children) {
						result.push(grandchild.url);
					}
				} else {
					result.push(child.url);
				}
			}
		} else if (item.menus) {
			for (const menu of item.menus) {
				for (const submenu of menu.children) {
					result.push(submenu.url);
				}
			}
		} else {
			result.push(item.url);
		}
	}

	return result;
}

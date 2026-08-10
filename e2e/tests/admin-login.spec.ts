import { expect, test } from "@playwright/test";

test("test user can log in and reach the products page", async ({ page }) => {
	await page.goto("/admin/login");
	await expect(page).toHaveTitle(/Sign in/);

	await page.fill("#email", "test@test.com");
	await page.fill("#password", "test1234");
	await page.click("#login-submit");

	await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
	await expect(
		page.getByRole("heading", { name: "Products" }),
	).toBeVisible();
	await expect(page.getByText("test@test.com")).toBeVisible();
});
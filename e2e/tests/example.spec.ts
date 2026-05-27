import { test } from '../fixtures'
import { expect } from '@playwright/test';

import menu_ro from "../../web/src/config/menu.ro.json" with { type: "json" };

test('has title', async ({ page }) => {
    await page.goto('/');

});

test('visit homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Trading/);
});


test('visit menu items', async ({ page }) => {
  await page.goto('/');
  for (let url of getMenuItems()) {
    test.slow()
    await page.goto(url);
  }
});

function getMenuItems() {
  let result = [];
  for (let item of menu_ro.headerPrimary) {
    if (item.children) {
      for (let child of item.children) {
        if (child.children) {
          for (let grandchild of child.children) {
            result.push(grandchild.url);
          }
        } else {
          result.push(child.url);
        }
      }
    } else if (item.menus) {
      for (let menu of item.menus) {
        for (let submenu of menu.children) {
          result.push(submenu.url);
        }
      }
    } else {
      result.push(item.url);
    }
  }

  return result;
}

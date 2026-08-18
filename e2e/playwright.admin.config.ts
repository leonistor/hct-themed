import { defineConfig, devices } from "@playwright/test";
import { stdout } from "bun";
import dotenv from "dotenv";
import path from "path";

// Load the monorepo root .env (E2E_BASE_URL)
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const E2E_BASE_URL = process.env.E2E_BASE_URL || "http://localhost:4321";

/**
 * Admin interface tests (web/src/pages/admin/), run against the local dev
 * servers booted by `bun run dev` at the repo root (web on 4321, admin on 3000).
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /admin.*\.spec\.ts/,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    cwd: "..",
    url: `${E2E_BASE_URL}/admin/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: "pipe",
    wait: {
      stdout: /watching for file changes/,
    },
  },
});

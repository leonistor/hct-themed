import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { log, error as logError } from "shared/logger";

// ---------- Cross-platform root ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// Load the monorepo root .env so BASE_URL can override config.toml's baseUrl
dotenv.config({ path: path.resolve(PROJECT_ROOT, "..", ".env") });

import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { Forminit } from "forminit";

const FORMINIT_API_KEY = process.env.FORMINIT_API_KEY!;
const FORM_ID = process.env.FORM_ID!;
log(`FORMINIT_API_KEY: ${FORMINIT_API_KEY}`);
log(`FORM_ID: ${FORM_ID}`);

const forminit = new Forminit({ apiKey: FORMINIT_API_KEY });

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.email(),
      message: z.string().min(1),
    }),
    handler: async ({ firstName, lastName, email, message }) => {
      const { data, redirectUrl, error } = await forminit.submit(FORM_ID, {
        blocks: [
          { type: "sender", properties: { firstName, lastName, email } },
          { type: "text", name: "message", value: message },
        ],
      });

      if (error) {
        logError(`✖ Form submission failed: ${error.message}`);
        // throw new Error(error.message);
      }
      log(`✓ Form submission succeeded: ${redirectUrl}`);
      return { hashId: data!.hashId, redirectUrl };
    },
  }),
};

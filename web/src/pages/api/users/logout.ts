export const prerender = false;

import type { APIRoute } from "astro";
import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
import { clearAuthCookie, tokenCookieName } from "@/utils/adminAuth";

export const POST: APIRoute = async () => {
  const payload = await getPayload({ config: payloadConfig });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearAuthCookie(
        tokenCookieName(payload),
        import.meta.env.PROD,
      ),
    },
  });
};
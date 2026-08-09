export const prerender = false;

import type { APIRoute } from "astro";
import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
import { getAdminUser } from "@/utils/adminAuth";

export const GET: APIRoute = async ({ request }) => {
  try {
    const payload = await getPayload({ config: payloadConfig });
    const user = await getAdminUser(payload, request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: { email: user.email } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
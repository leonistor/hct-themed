export const prerender = false;

import type { APIRoute } from "astro";
import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
import { setAuthCookie, tokenCookieName } from "@/utils/adminAuth";

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const payload = await getPayload({ config: payloadConfig });
    const result = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (!result.token || !result.exp) {
      return new Response(JSON.stringify({ error: "Login failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cookie = setAuthCookie(
      tokenCookieName(payload),
      result.token,
      result.exp,
      import.meta.env.PROD,
    );

    return new Response(
      JSON.stringify({ user: { email: result.user?.email } }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
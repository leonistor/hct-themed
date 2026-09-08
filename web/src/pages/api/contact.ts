export const prerender = false; // Ensure it runs on the server
import type { APIRoute } from "astro";

import { JUSTEMAILS_API_KEY, CONTACT_RECIPIENT } from "astro:env/server";

const JUSTEMAILS_FROM = "noreply@h-ct.ro";

export const POST: APIRoute = async ({ request }) => {
  if (!JUSTEMAILS_API_KEY || !CONTACT_RECIPIENT) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing JUSTEMAILS_API_KEY / CONTACT_RECIPIENT env vars",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Client sends JSON (FormHandle.ts:formSubmit) — support both JSON and formData
    let name: FormDataEntryValue | string | null = null;
    let email: FormDataEntryValue | string | null = null;
    let message: FormDataEntryValue | string | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await request.json();
      // Accept both Romanian field names (form) and generic fallbacks
      name = json.Nume ?? json.name ?? json.firstName ?? null;
      email = json.Email ?? json.email ?? null;
      message = json.Message ?? json.message ?? null;
    } else {
      const data = await request.formData();
      name = data.get("Nume") ?? data.get("name");
      email = data.get("Email") ?? data.get("email");
      message = data.get("Message") ?? data.get("message");
    }

    const res = await fetch("https://justemails.app/api/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JUSTEMAILS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: JUSTEMAILS_FROM,
        to: [CONTACT_RECIPIENT],
        replyTo: email ? String(email) : undefined,
        subject: "New message from HCT contact form",
        html:
          `<p><strong>Name:</strong> ${name}</p>` +
          `<p><strong>Email:</strong> ${email}</p>` +
          `<p><strong>Message:</strong> ${message}</p>`,
        idempotencyKey: crypto.randomUUID(),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detail =
        err && typeof err === "object" && "error" in err
          ? (err as { error?: { message?: string } }).error?.message
          : undefined;
      throw new Error(`Send failed: ${detail ?? res.statusText}`);
    }

    const { data } = await res.json();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

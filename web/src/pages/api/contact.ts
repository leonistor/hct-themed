export const prerender = false; // Ensure it runs on the server
import type { APIRoute } from "astro";

import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  // Read env vars per-request so they work regardless of when they're set in
  // the process lifecycle (module-level capture would freeze undefined values).
  const yahooEmail = process.env.YAHOO_EMAIL;
  const yahooPass = process.env.YAHOO_APP_PASSWORD;

  console.log("POST /api/contact");
  console.log(`YAHOO_EMAIL: ${yahooEmail}`);
  console.log(`YAHOO_APP_PASSWORD: ${yahooPass ? "***set***" : "NOT SET"}`);

  if (!yahooEmail || !yahooPass) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing YAHOO_EMAIL / YAHOO_APP_PASSWORD env vars",
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
      console.log("Body (json):", json);
    } else {
      const data = await request.formData();
      name = data.get("Nume") ?? data.get("name");
      email = data.get("Email") ?? data.get("email");
      message = data.get("Message") ?? data.get("message");
      console.log("Body (formData):", Object.fromEntries(data.entries()));
    }

    console.log(`name: ${name}`);
    console.log(`email: ${email}`);
    console.log(`message: ${message}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, // SSL
      auth: { user: yahooEmail, pass: yahooPass },
    });

    await transporter.sendMail({
      from: yahooEmail,
      to: yahooEmail, // Send to yourself
      subject: `New mesage from HCT contact form`,
      text: String(message),
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

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

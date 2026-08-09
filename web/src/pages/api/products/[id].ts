export const prerender = false;

import type { APIRoute } from "astro";
import { getPayload } from "payload";
import { config as payloadConfig } from "admin";

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await getPayload({ config: payloadConfig });
    const product = await payload.findByID({
      collection: "products",
      id,
      depth: 0,
      select: { folder: false, images: false },
    });

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { code, name, description } = body as {
    code?: string;
    name?: string;
    description?: string;
  };

  const data: Record<string, string> = {};
  if (code !== undefined) data.code = code;
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;

  if (Object.keys(data).length === 0) {
    return new Response(JSON.stringify({ error: "No fields to update" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await getPayload({ config: payloadConfig });
    const updated = await payload.update({
      collection: "products",
      id,
      data,
      depth: 0,
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const prerender = false;

import type { APIRoute } from "astro";
import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
import { getAdminUser } from "@/utils/adminAuth";

const unauthorized = () =>
  new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await getPayload({ config: payloadConfig });
    const user = await getAdminUser(payload, request);
    if (!user) return unauthorized();
    const product = await payload.findByID({
      collection: "products",
      id,
      depth: 2,
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

  try {
    const payload = await getPayload({ config: payloadConfig });
    const user = await getAdminUser(payload, request);
    if (!user) return unauthorized();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
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

  const { name, description, published, promoted, category, materials } =
    body as {
      name?: string;
      description?: string;
      published?: boolean;
      promoted?: boolean;
      category?: number | string | null;
      materials?: (number | string)[];
    };

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (published !== undefined) data.published = Boolean(published);
  if (promoted !== undefined) data.promoted = Boolean(promoted);
  if (category !== undefined && category !== null) {
    data.category = Number(category);
  } else if (category !== undefined) {
    data.category = null;
  }
  if (materials !== undefined) {
    data.materials = materials.map((m) => Number(m));
  }

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
      depth: 2,
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

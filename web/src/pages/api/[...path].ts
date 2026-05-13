export const prerender = false;

import { createProxyHandler } from "@astroscope/proxy";

export const ALL = createProxyHandler({
  upstream: "http://localhost:3000",
});

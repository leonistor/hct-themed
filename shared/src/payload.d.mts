import type { Config, Payload, SanitizedConfig } from "payload";

export async function getPayloadClient(
  config: Config | Promise<SanitizedConfig>,
): Promise<Payload>;

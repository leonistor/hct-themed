import { getPayload } from "payload";

export async function getPayloadClient(config) {
  return getPayload({ config });
}

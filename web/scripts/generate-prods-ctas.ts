import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
const payload = await getPayload({ config: payloadConfig });

let result: Record<string, any>[] = [];

const promos = await payload.find({
  collection: "products",
  depth: 2,
  limit: 100,
  sort: "_order",
  where: { promoted: { equals: true } },
});

for (const [index, promo] of promos.docs.entries()) {
  result.push({
    enable: true,
    name: promo.name,
    description: promo.description,
    url: `/products/${promo.code}`,
    weight: index,
    // @ts-ignore
  });
}

console.log(JSON.stringify(result, null, 2));

process.exit(0);

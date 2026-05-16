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
    eyebrow: promo.name,
    // @ts-ignore
    image: promo.main_image!.sizes!.medium?.filename,
    title: promo.name,
    description: promo.description,
    button: {
      enable: true,
      label: "Detalii",
      url: `/products/${promo.code}`,
      variant: "fill",
      tag: "a",
      hoverEffect: "creative-fill",
      icon: {
        enable: true,
        name: "ArrowUpRight",
        position: "right",
      },
    },
    url: `/products/${promo.code}`,
    weight: index,
  });
}

console.log(JSON.stringify(result, null, 2));

process.exit(0);

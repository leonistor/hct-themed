import { config as payloadConfig } from "admin";
import { getPayloadClient } from "shared/payload";

const payload = await getPayloadClient(payloadConfig);

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
    eyebrow: "Nou!",
    // @ts-ignore
    image: "/payload/products/" + promo.main_image.sizes.medium.filename,
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

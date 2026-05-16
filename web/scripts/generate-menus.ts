import { getPayload } from "payload";
import { config as payloadConfig, type Media } from "admin";
const payload = await getPayload({ config: payloadConfig });

// TODO: use translations

let result: {
  partneri: Record<string, any>[];
  solutii: Record<string, any>[];
  echipamente: Record<string, any>[];
} = {
  partneri: [],
  solutii: [], // materials
  echipamente: [], // categories
};

const partners = await payload.find({
  collection: "partners",
  depth: 2,
  limit: 100,
  sort: "_order",
  where: { published: { equals: true } },
});

for (const [index, partner] of partners.docs.entries()) {
  result["partneri"].push({
    enable: true,
    name: partner.name,
    description: partner.description,
    url: `/partners/${partner.code}`,
    weight: index,
    promoted: partner.promoted,
    // @ts-ignore
    icon: "/api/media/file/" + partner.logo?.filename ?? "",
  });
}
const materials = await payload.find({
  collection: "materials",
  depth: 2,
  limit: 100,
  sort: "_order",
});

for (const [index, material] of materials.docs.entries()) {
  result["solutii"].push({
    enable: true,
    name: material.name,
    description: material.description,
    url: `/solutions/${material.code}`,
    weight: index,
    // @ts-ignore
    icon: "/api/media/file/" + material.illustration?.filename ?? "",
  });
}

const categories = await payload.find({
  collection: "categories",
  depth: 2,
  limit: 100,
  sort: "_order",
});

for (const [index, category] of categories.docs.entries()) {
  result["echipamente"].push({
    enable: true,
    name: category.name,
    description: category.description,
    url: `/categories/${category.code}`,
    weight: index,
    // @ts-ignore
    icon: "/api/media/file/" + category.illustration?.filename ?? "",
  });
}

console.log(JSON.stringify(result, null, 2));

process.exit(0);

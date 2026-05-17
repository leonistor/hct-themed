import { getPayload } from "payload";
import { config as payloadConfig } from "admin";
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
    icon: "/payload/" + partner.logo.sizes.thumbnail.filename,
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
    icon: "/payload/" + material.illustration.sizes.medium.filename,
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
    icon: "/payload/" + category.illustration.sizes.medium.filename,
  });
}

console.log(JSON.stringify(result, null, 2));

process.exit(0);

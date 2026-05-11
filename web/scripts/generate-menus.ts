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
    icon: "Monitor",
    url: `/partners/${partner.code}`,
    weight: index,
    // logo: partner.logo,
  });
}

console.log(JSON.stringify(result, null, 2));

process.exit(0);

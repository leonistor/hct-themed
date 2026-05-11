
TODO: etichete nou la parteneri, produse
TODO: adjust colors
TODO: api endpoint for payload
TODO: sync menu, lang

## pagini

/about - despre
/team - echipa
/contact - contact
/services - servicii {instalare, montaj, reconditionare}
/solutions - materiale
/equipments - categorii
/credits - credite photo
/legal - legale
/partners - parteneri
/customers - clienti
/projects - proiecte


```json
[
  {
    label: "Companie",
    items: [
      {
        href: "/despre",
        label: "Despre noi",
      },
      {
        href: "/parteneri",
        label: "Parteneri",
      },
      {
        href: "/clienti",
        label: "Clienți",
      },
      {
        href: "/echipa",
        label: "Echipa",
      },
    ],
  },
  {
    label: "Produse",
    items: [
      {
        href: "/categorii",
        label: "Categorii",
        description:
          "Echipamente pentru tăiere, dezmembrare tocare, mărunțire și granulare. Prese de balotat și compactoare. Dezmembrare vehicule și motoare. Recuperare, stocare și analiză fluide. Sisteme de sortare",
      },
      {
        href: "/materiale",
        label: "Materiale",
        description:
          "Reciclarea metalelor, aluminiului, cablurilor. Vehicule scoase din uz, Motoare, DEEE, Hidrapulper. Deșeuri solide urbane. Conserve. Metale mixte.",
      },
      {
        href: "/produse",
        label: "Toate produsele",
        description: "Selecție produse după partener, categorie, materiale.",
      },
    ],
  },
  {
    label: "Servicii",
    items: [
      { label: "Instalare și montaj", href: "/servicii-instalare" },
      { label: "Recondiționare", href: "/servicii-reconditionare" },
      { label: "Accesorii și consumabile", href: "/consumabile" },
    ],
  },
  { href: "/noutati", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

```

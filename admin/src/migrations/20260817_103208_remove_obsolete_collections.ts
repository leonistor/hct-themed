import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const relationshipColumns = (await db.all(
    sql`PRAGMA table_info("payload_locked_documents_rels")`,
  )) as Array<{ name: string }>

  // SQLite cannot drop a referenced table while this legacy relationship table
  // still contains foreign keys for the removed collections.
  if (relationshipColumns.some(({ name }) => name === 'projects_id' || name === 'pages_id')) {
    await db.run(sql`CREATE TABLE "payload_locked_documents_rels_new" (
      "id" integer PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" text NOT NULL,
      "users_id" integer,
      "media_id" integer,
      "partners_id" integer,
      "categories_id" integer,
      "customers_id" integer,
      "materials_id" integer,
      "products_id" integer,
      "product_images_id" integer,
      "payload_folders_id" integer,
      FOREIGN KEY ("parent_id") REFERENCES "payload_locked_documents"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("users_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("media_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("customers_id") REFERENCES "customers"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("materials_id") REFERENCES "materials"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("products_id") REFERENCES "products"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("payload_folders_id") REFERENCES "payload_folders"("id") ON UPDATE no action ON DELETE set null
    )`)
    await db.run(sql`INSERT INTO "payload_locked_documents_rels_new" (
      "id", "order", "parent_id", "path", "users_id", "media_id",
      "partners_id", "categories_id", "customers_id", "materials_id",
      "products_id", "product_images_id", "payload_folders_id"
    ) SELECT
      "id", "order", "parent_id", "path", "users_id", "media_id",
      "partners_id", "categories_id", "customers_id", "materials_id",
      "products_id", "product_images_id", "payload_folders_id"
    FROM "payload_locked_documents_rels"`)
    await db.run(sql`DROP TABLE "payload_locked_documents_rels"`)
    await db.run(sql`ALTER TABLE "payload_locked_documents_rels_new" RENAME TO "payload_locked_documents_rels"`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" ("order")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" ("parent_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" ("path")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" ("users_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" ("media_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" ("partners_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" ("categories_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" ("customers_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_materials_id_idx" ON "payload_locked_documents_rels" ("materials_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" ("products_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_product_images_id_idx" ON "payload_locked_documents_rels" ("product_images_id")`)
    await db.run(sql`CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" ("payload_folders_id")`)
  }

  // These collections were removed before migrations were introduced. IF EXISTS
  // keeps this safe for databases that never contained one of the old tables.
  await db.run(sql`DROP TABLE IF EXISTS "projects"`)
  await db.run(sql`DROP TABLE IF EXISTS "pages"`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The removed collections are intentionally not restored by a rollback.
  // Their content and collection definitions are no longer part of the app.
  void db
}

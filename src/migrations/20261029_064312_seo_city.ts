import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ALTER COLUMN "hero_title" SET DEFAULT 'Диваны и кресла, сшитые под вас {город}';
  ALTER TABLE "site_settings" ALTER COLUMN "meta_title" SET DEFAULT 'Мягкая мебель на заказ {город} — SOFARIO';
  ALTER TABLE "site_settings" ALTER COLUMN "meta_description" SET DEFAULT 'Диваны, кресла и кровати на заказ {город} по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.';
  ALTER TABLE "categories" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "city" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "city_in" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "region" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "title_suffix" varchar DEFAULT 'мягкая мебель на заказ {город} | SOFARIO';`)
  // Тексты, оставшиеся от прежних значений по умолчанию, переводим на шаблон с {город}. Правки из админки не трогаем.
  await db.execute(sql`
   UPDATE "home_page" SET "hero_title" = 'Диваны и кресла, сшитые под вас {город}' WHERE "hero_title" = 'Диваны и кресла, сшитые под вас';
  UPDATE "site_settings" SET "meta_title" = 'Мягкая мебель на заказ {город} — SOFARIO' WHERE "meta_title" = 'SOFARIO — мягкая мебель на заказ';
  UPDATE "site_settings" SET "meta_description" = 'Диваны, кресла и кровати на заказ {город} по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.' WHERE "meta_description" = 'Диваны, кресла и кровати на заказ по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.';
  UPDATE "site_settings" SET "title_suffix" = 'мягкая мебель на заказ {город} | SOFARIO' WHERE "title_suffix" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ALTER COLUMN "hero_title" SET DEFAULT 'Диваны и кресла, сшитые под вас';
  ALTER TABLE "site_settings" ALTER COLUMN "meta_title" SET DEFAULT 'SOFARIO — мягкая мебель на заказ';
  ALTER TABLE "site_settings" ALTER COLUMN "meta_description" SET DEFAULT 'Диваны, кресла и кровати на заказ по вашим размерам. Сотни тканей, собственный цех, перетяжка мебели.';
  ALTER TABLE "categories" DROP COLUMN "seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "city";
  ALTER TABLE "site_settings" DROP COLUMN "city_in";
  ALTER TABLE "site_settings" DROP COLUMN "region";
  ALTER TABLE "site_settings" DROP COLUMN "title_suffix";`)
}

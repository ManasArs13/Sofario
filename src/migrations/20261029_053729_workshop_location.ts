import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "location_lat" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "location_lng" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "location_zoom" numeric DEFAULT 16;
  ALTER TABLE "site_settings" ADD COLUMN "location_show_on_home" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "location_directions" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "location_lat";
  ALTER TABLE "site_settings" DROP COLUMN "location_lng";
  ALTER TABLE "site_settings" DROP COLUMN "location_zoom";
  ALTER TABLE "site_settings" DROP COLUMN "location_show_on_home";
  ALTER TABLE "site_settings" DROP COLUMN "location_directions";`)
}

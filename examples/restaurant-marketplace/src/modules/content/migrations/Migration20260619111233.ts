import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260619111233 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "contact_message" ("id" text not null, "name" text not null, "email" text not null, "message" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_message_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_message_deleted_at" ON "contact_message" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "handle" text not null, "image" text null, "excerpt" text null, "author_name" text null, "author_avatar" text null, "published_at" text null, "content" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "contact_message" cascade;`);

    this.addSql(`drop table if exists "post" cascade;`);
  }

}

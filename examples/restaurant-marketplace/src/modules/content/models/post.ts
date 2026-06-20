import { model } from "@medusajs/framework/utils";

export const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text(),
  image: model.text().nullable(),
  excerpt: model.text().nullable(),
  author_name: model.text().nullable(),
  author_avatar: model.text().nullable(),
  published_at: model.text().nullable(),
  content: model.text().nullable(),
});

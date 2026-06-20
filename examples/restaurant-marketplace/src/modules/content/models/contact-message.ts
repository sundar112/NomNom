import { model } from "@medusajs/framework/utils";

export const ContactMessage = model.define("contact_message", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  message: model.text(),
});

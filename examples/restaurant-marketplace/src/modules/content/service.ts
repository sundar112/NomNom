import { MedusaService } from "@medusajs/framework/utils";
import { Post } from "./models/post";
import { ContactMessage } from "./models/contact-message";

class ContentModuleService extends MedusaService({
  Post,
  ContactMessage,
}) {}

export default ContentModuleService;

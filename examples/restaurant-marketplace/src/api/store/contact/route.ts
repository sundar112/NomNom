import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "@medusajs/framework/zod";
import { CONTENT_MODULE } from "../../../modules/content";
import ContentModuleService from "../../../modules/content/service";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validated = schema.parse(req.body);

  const contentModuleService: ContentModuleService =
    req.scope.resolve(CONTENT_MODULE);

  const message = await contentModuleService.createContactMessages({
    name: validated.name,
    email: validated.email,
    message: validated.message,
  });

  return res.status(200).json({ message });
}

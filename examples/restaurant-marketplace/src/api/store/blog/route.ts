import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { CONTENT_MODULE } from "../../../modules/content";
import ContentModuleService from "../../../modules/content/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const contentModuleService: ContentModuleService =
    req.scope.resolve(CONTENT_MODULE);

  const posts = await contentModuleService.listPosts(
    {},
    {
      order: { published_at: "DESC" },
    }
  );

  return res.status(200).json({ posts });
}

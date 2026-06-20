import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { CONTENT_MODULE } from "../../../../modules/content";
import ContentModuleService from "../../../../modules/content/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const contentModuleService: ContentModuleService =
    req.scope.resolve(CONTENT_MODULE);

  const [post] = await contentModuleService.listPosts({
    handle: req.params.handle,
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(200).json({ post });
}

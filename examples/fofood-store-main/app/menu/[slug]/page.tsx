import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import PopularMenu from "@/components/sections/popular-menu";
import { getMenu } from "@/lib/medusa";

export const revalidate = 60;

export default async function DetailMenu({
	params,
}: {
	params: { slug: string };
}) {
	const menu = await getMenu();
	const item = menu.items.find((i) => i.handle === params.slug);

	if (!item) {
		notFound();
	}

	// Related items: same category first, then others.
	const related = [
		...menu.items.filter(
			(i) => i.category === item.category && i.id !== item.id
		),
		...menu.items.filter((i) => i.category !== item.category),
	];

	return (
		<div className="container">
			<ProductDetail item={item} />
			<PopularMenu items={related} />
		</div>
	);
}

import PageTitle from "@/components/page-title";
import FoodMenu from "@/components/sections/food-menu";
import { getMenu } from "@/lib/medusa";

export const revalidate = 60;

export default async function Menu() {
	const menu = await getMenu();

	return (
		<>
			<PageTitle path="Menu" title="Our Menu" />

			<div className="container">
				<FoodMenu menu={menu} />
			</div>
		</>
	);
}

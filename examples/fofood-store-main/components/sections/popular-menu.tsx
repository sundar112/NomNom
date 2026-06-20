import Link from "next/link";
import { MenuItem } from "@/lib/medusa";
import MenuItemCard from "@/components/menu-item-card";

export default function PopularMenu({ items }: { items: MenuItem[] }) {
	const popular = items.slice(0, 8);

	return (
		<section id="popular-menu">
			<div className="py-10 lg:px-12 lg:py-20">
				<h3 className="text-caption-2 lg:text-caption-1 text-center text-primary-100">
					Popular Menu
				</h3>
				<h2 className="text-heading-4 lg:text-heading-2 mt-2 text-center">
					Most Popular Food
				</h2>
				<div className="mt-10 grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-x-20">
					{popular.map((item) => (
						<MenuItemCard key={item.id} item={item} />
					))}
				</div>
				<div className="mx-auto mt-10 w-fit lg:mt-20">
					<Link href="/menu" className="btn-pink-outline">
						See All Menu
					</Link>
				</div>
			</div>
		</section>
	);
}

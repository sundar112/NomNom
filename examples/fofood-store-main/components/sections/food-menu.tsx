"use client";

import { Fragment } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { BsGridFill } from "react-icons/bs";
import { Menu, MenuCategory } from "@/lib/medusa";
import DiscountBanner from "@/components/discount-banner";
import MenuItemCard from "@/components/menu-item-card";

export default function FoodMenu({ menu }: { menu: Menu }) {
	// Prepend a synthetic "All" category that contains every item.
	const allCategory: MenuCategory = {
		id: "all",
		name: "All",
		count: menu.items.length,
		image: "",
		items: menu.items,
	};
	const categories = [allCategory, ...menu.categories];

	if (!menu.items.length) {
		return (
			<div className="py-20 text-center">
				<h3 className="text-heading-4 text-secondary-100">
					The menu is being prepared
				</h3>
				<p className="text-body-1 mt-2 text-secondary-50">
					Please check back in a moment — our kitchen is loading the menu.
				</p>
			</div>
		);
	}

	return (
		<div className="pb-20 pt-16 lg:pb-36 lg:pt-20">
			<div className="flex flex-col space-y-14 lg:flex-row lg:space-x-20 lg:space-y-0">
				<Tab.Group>
					<div>
						<h5 className="text-heading-5 text-secondary-50">Categories</h5>
						<Tab.List className="mt-6 flex w-[calc(100vw-32px)] flex-row space-x-4 overflow-y-auto pb-5 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-4 lg:pb-0">
							{categories.map((category) => (
								<Tab as={Fragment} key={category.id}>
									{({ selected }) => (
										<button
											className={`${
												selected && "bg-primary-100 outline-0"
											} group flex w-52 shrink-0 space-x-4 rounded-2xl border border-secondary-10 px-3 py-3.5 text-left transition duration-300 hover:bg-primary-100 lg:w-72`}
										>
											{category.name === "All" || !category.image ? (
												<BsGridFill
													className={`${
														selected ? "text-white" : "text-primary-100"
													} ml-2 group-hover:text-white`}
													size="48px"
												/>
											) : (
												<Image
													src={category.image}
													alt={category.name}
													width={56}
													height={56}
													className="h-14 w-14 rounded-lg object-cover"
												/>
											)}
											<div>
												<h5
													className={`${
														selected ? "text-white" : "text-secondary-100"
													} text-heading-5 leading-none group-hover:text-white`}
												>
													{category.name}
												</h5>
												<span
													className={`${
														selected ? "text-white" : "text-primary-100"
													} text-caption-2 group-hover:text-white`}
												>
													{category.count} Menu
												</span>
											</div>
										</button>
									)}
								</Tab>
							))}
						</Tab.List>
						<div className="mt-20 hidden lg:block">
							<DiscountBanner />
						</div>
					</div>

					<div className="lg:grow">
						<Tab.Panels>
							{categories.map((category) => (
								<Tab.Panel key={category.id}>
									<div className="flex items-center justify-between">
										<h3 className="text-heading-4 lg:text-heading-3 text-secondary-100">
											{category.name} Menu
										</h3>
										<span className="text-caption-2 text-primary-100">
											{category.count} Menu
										</span>
									</div>
									<div className="mt-8 grid grid-cols-2 gap-10 lg:grid-cols-3 lg:gap-16">
										{category.items.map((item) => (
											<MenuItemCard key={item.id} item={item} />
										))}
									</div>
								</Tab.Panel>
							))}
						</Tab.Panels>
					</div>
				</Tab.Group>
			</div>
			<div className="mt-20 block lg:hidden">
				<DiscountBanner />
			</div>
		</div>
	);
}

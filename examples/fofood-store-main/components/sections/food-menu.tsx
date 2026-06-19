"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { BsGridFill } from "react-icons/bs";
import { convertNameToSlug } from "@/utils/helper";
import DiscountBanner from "@/components/discount-banner";
import FoodData from "@/public/json/food.json";

export default function FoodMenu() {
	return (
		<div className="pb-20 pt-16 lg:pb-36 lg:pt-20">
			<div className="flex flex-col space-y-14 lg:flex-row lg:space-x-20 lg:space-y-0">
				<Tab.Group>
					<div>
						<h5 className="text-heading-5 text-secondary-50">Categories</h5>
						<Tab.List className="mt-6 flex w-[calc(100vw-32px)] flex-row space-x-4 overflow-y-auto pb-5 lg:w-full lg:flex-col lg:space-x-0 lg:space-y-4 lg:pb-0">
							{FoodData.map((food, index) => (
								<Tab as={Fragment} key={index}>
									{({ selected }) => (
										<button
											className={`${
												selected && "bg-primary-100 outline-0"
											} group flex w-52 shrink-0 space-x-4 rounded-2xl border border-secondary-10 px-3 py-3.5 text-left transition duration-300 hover:bg-primary-100 lg:w-72`}
										>
											{food.category === "All" ? (
												<BsGridFill
													className={`${
														selected ? "text-white" : "text-primary-100"
													} ml-2 group-hover:text-white`}
													size="48px"
												/>
											) : (
												<Image
													src={`/assets/img/${food.image}`}
													alt="Food Menu"
													width={56}
													height={56}
												/>
											)}
											<div>
												<h5
													className={`${
														selected ? "text-white" : "text-secondary-100"
													} text-heading-5 leading-none group-hover:text-white`}
												>
													{food.category}
												</h5>
												<span
													className={`${
														selected ? "text-white" : "text-primary-100"
													} text-caption-2 group-hover:text-white`}
												>
													{food.items.length} Menu
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
							{FoodData.map((food, index) => (
								<Tab.Panel key={index}>
									<div className="flex items-center justify-between">
										<h3 className="text-heading-4 lg:text-heading-3 text-secondary-100">
											{food.category} Menu
										</h3>
										<span className="text-caption-2 text-primary-100">
											{food.items.length} Menu
										</span>
									</div>
									<div className="mt-8 grid grid-cols-2 gap-10 lg:grid-cols-3 lg:gap-16">
										{food.items.map((item, index) => (
											<div key={index} className="text-center">
												<Image
													src={`/assets/img/${item.images[0]}`}
													width={200}
													height={200}
													alt="Food"
													className="mx-auto"
												/>
												<Link
													href={`menu/${convertNameToSlug(item.name)}`}
													className="text-heading-6 lg:text-heading-5 mt-3 text-secondary-100 hover:text-primary-100 hover:underline"
												>
													{item.name}
												</Link>
												<h3 className="text-caption-2 text-primary-100">
													{item.price}
												</h3>
											</div>
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import PageTitle from "@/components/page-title";
import EmptyState from "@/components/empty-state";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";

export default function MyFavorites() {
	const { favorites, remove } = useFavorites();
	const { addItem } = useCart();

	return (
		<>
			<PageTitle path="My Favorites" title="My Favorites" />

			<div className="container">
				<div className="py-20 lg:pb-36 lg:pt-24">
					{favorites.length === 0 ? (
						<EmptyState />
					) : (
						<div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-x-20">
							{favorites.map((food) => (
								<div key={food.id} className="relative text-center">
									<button
										className="group absolute right-16 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary-100 bg-white transition duration-300 hover:bg-primary-100"
										onClick={() => remove(food.id)}
										aria-label="Remove from favorites"
									>
										<AiFillHeart
											size="24px"
											className="text-primary-100 transition duration-300 group-hover:text-white"
										/>
									</button>
									<Link href={`/menu/${food.handle}`}>
										<Image
											src={food.image}
											width={200}
											height={200}
											alt={food.name}
											className="mx-auto h-[200px] w-[200px] rounded-2xl object-cover"
										/>
									</Link>
									<div className="group/food">
										<Link
											href={`/menu/${food.handle}`}
											className="lg:text-heading-5 text-body-1 peer !font-bold hover:text-primary-100 hover:underline"
										>
											{food.name}
										</Link>
										<h3 className="text-caption-2 text-primary-100">
											{food.price}
										</h3>
										<div className="mt-3 flex justify-center space-x-2.5 opacity-0 transition-opacity duration-200 group-hover/food:opacity-100 peer-hover:opacity-100">
											<button
												className="text-body-3-medium rounded-[32px] bg-primary-100 px-5 py-3 text-white shadow-lg shadow-[#AE1339]/30 transition duration-300 hover:bg-additional-yellow hover:text-secondary-100 lg:px-10 lg:py-3"
												onClick={() => food.variantId && addItem(food.variantId)}
											>
												<FiShoppingCart className="lg:hidden" />
												<span className="hidden lg:block">Add to Cart</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}

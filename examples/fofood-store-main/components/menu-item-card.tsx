"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { MenuItem } from "@/lib/medusa";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";

export default function MenuItemCard({ item }: { item: MenuItem }) {
	const { addItem } = useCart();
	const { isFavorite, toggle } = useFavorites();
	const favorited = isFavorite(item.id);

	const handleFavorite = () =>
		toggle({
			id: item.id,
			variantId: item.variantId,
			handle: item.handle,
			name: item.name,
			image: item.image,
			price: item.priceFormatted,
		});

	return (
		<div className="text-center">
			<Link href={`/menu/${item.handle}`}>
				<Image
					src={item.image}
					width={200}
					height={200}
					alt={item.name}
					className="mx-auto h-[200px] w-[200px] rounded-2xl object-cover"
				/>
			</Link>
			<div className="group/food">
				<Link
					href={`/menu/${item.handle}`}
					className="lg:text-heading-5 text-body-1 peer !font-bold hover:text-primary-100 hover:underline"
				>
					{item.name}
				</Link>
				<h3 className="text-caption-2 text-primary-100">
					{item.priceFormatted}
				</h3>
				<div className="mt-3 flex justify-center space-x-2.5 opacity-0 transition-opacity duration-200 group-hover/food:opacity-100 peer-hover:opacity-100">
					<button
						type="button"
						aria-label="Toggle favorite"
						className="group rounded-full border border-primary-100 px-2 py-2 transition duration-300 hover:bg-primary-100"
						onClick={handleFavorite}
					>
						{favorited ? (
							<AiFillHeart size="20px" className="text-primary-100" />
						) : (
							<FiHeart
								size="20px"
								className="text-primary-100 transition duration-300 group-hover:text-white"
							/>
						)}
					</button>
					<button
						type="button"
						className="text-body-3-medium rounded-[32px] bg-primary-100 px-5 py-3 text-white shadow-lg shadow-[#AE1339]/30 transition duration-300 hover:bg-additional-yellow hover:text-secondary-100 lg:px-10 lg:py-3"
						onClick={() => addItem(item.variantId)}
					>
						<FiShoppingCart className="lg:hidden" />
						<span className="hidden lg:block">Add to Cart</span>
					</button>
				</div>
			</div>
		</div>
	);
}

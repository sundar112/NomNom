"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiMinus, BiPlus } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Breadcrumbs from "@/components/breadcrumbs";
import FoodSwiper from "@/components/food-swiper";
import { MenuItem } from "@/lib/medusa";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";

export default function ProductDetail({ item }: { item: MenuItem }) {
	const router = useRouter();
	const { addItem } = useCart();
	const { isFavorite, toggle } = useFavorites();
	const [quantity, setQuantity] = useState(1);
	const [adding, setAdding] = useState(false);

	const favorited = isFavorite(item.id);

	const handleAddToCart = async (goToCart = false) => {
		setAdding(true);
		try {
			await addItem(item.variantId, quantity);
			if (goToCart) router.push("/my-cart");
		} finally {
			setAdding(false);
		}
	};

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
		<div className="pb-10 pt-28 lg:pb-20 lg:pt-36">
			<Breadcrumbs previousPath="Menu" currentPath={item.name} />
			<div className="mt-16 grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
				<div className="w-full">
					<FoodSwiper images={item.images} />
				</div>
				<div>
					<h1 className="text-heading-3 lg:text-heading-1 text-secondary-100">
						{item.name}
					</h1>
					<h5 className="text-heading-5 mt-4 text-secondary-100 lg:mt-8">
						Price
					</h5>
					<span className="text-caption-2 text-primary-100">
						{item.priceFormatted}
					</span>
					<h5 className="text-heading-5 mt-8 text-secondary-100">Description</h5>
					<p className="text-body-2-regular mt-2 text-secondary-50">
						{item.description || "No description"}
					</p>
					<div className="mt-6 flex items-center space-x-3">
						<h5 className="text-heading-5">Quantity:</h5>
						<div className="flex">
							<button
								className="rounded-s-[4px] border border-[#EDECEC] p-3 transition hover:border-primary-100 hover:bg-primary-100 hover:text-white"
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							>
								<BiMinus />
							</button>
							<input
								type="number"
								className="w-14 border border-secondary-10 px-4 text-center"
								value={quantity}
								min={1}
								onChange={(e) =>
									setQuantity(Math.max(1, Number(e.target.value) || 1))
								}
							/>
							<button
								className="rounded-e-[4px] border border-[#EDECEC] p-3 transition hover:border-primary-100 hover:bg-primary-100 hover:text-white"
								onClick={() => setQuantity((q) => q + 1)}
							>
								<BiPlus />
							</button>
						</div>
					</div>
					<div className="mt-6 flex space-x-6">
						<button
							className="btn-pink-solid grow disabled:opacity-60"
							disabled={adding}
							onClick={() => handleAddToCart(false)}
						>
							{adding ? "Adding..." : "Add to Cart"}
						</button>
						<button
							className="btn-pink-outline !p-3"
							aria-label="Toggle favorite"
							onClick={handleFavorite}
						>
							{favorited ? (
								<AiFillHeart size={30} className="text-primary-100" />
							) : (
								<AiOutlineHeart size={30} />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

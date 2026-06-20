"use client";

import Image from "next/image";
import Link from "next/link";
import { RxTrash } from "react-icons/rx";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BiMinus, BiPlus } from "react-icons/bi";
import PageTitle from "@/components/page-title";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/medusa";

function QtyControl({
	quantity,
	onChange,
}: {
	quantity: number;
	onChange: (q: number) => void;
}) {
	return (
		<div className="flex">
			<button
				className="rounded-s-[4px] border border-[#EDECEC] p-3 transition hover:border-primary-100 hover:bg-primary-100 hover:text-white"
				onClick={() => onChange(Math.max(1, quantity - 1))}
			>
				<BiMinus />
			</button>
			<input
				type="number"
				className="w-14 border border-secondary-10 px-4 text-center"
				value={quantity}
				min={1}
				readOnly
			/>
			<button
				className="rounded-e-[4px] border border-[#EDECEC] p-3 transition hover:border-primary-100 hover:bg-primary-100 hover:text-white"
				onClick={() => onChange(quantity + 1)}
			>
				<BiPlus />
			</button>
		</div>
	);
}

export default function MyCart() {
	const { cart, loading, updateItem, removeItem } = useCart();

	const items: any[] = cart?.items ?? [];
	const currency = cart?.currency_code ?? "eur";
	const subtotal = cart?.item_subtotal ?? cart?.subtotal ?? 0;
	const total = cart?.total ?? subtotal;

	if (!loading && items.length === 0) {
		return (
			<>
				<PageTitle bgColor="bg-white" path="My Cart" title="My Cart" />
				<div className="container">
					<div className="flex flex-col items-center py-24 text-center">
						<h3 className="text-heading-4 text-secondary-100">
							Your cart is empty
						</h3>
						<p className="text-body-1 mt-2 text-secondary-50">
							Browse the menu and add some delicious food to your cart.
						</p>
						<Link href="/menu" className="btn-pink-solid mt-8">
							Browse Menu
						</Link>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<PageTitle bgColor="bg-white" path="My Cart" title="My Cart" />

			<div className="container">
				<div className="pb-20 pt-10 lg:py-24">
					{/* Mobile list */}
					<div className="block lg:hidden">
						{items.map((item) => (
							<div key={item.id} className="border-b pb-8 pt-4">
								{item.thumbnail && (
									<Image
										src={item.thumbnail}
										alt={item.product_title || item.title}
										width={150}
										height={150}
										className="h-[150px] w-[150px] rounded-2xl object-cover"
									/>
								)}
								<div className="mt-3 flex items-center justify-between">
									<h5 className="text-heading-5 text-secondary-100">
										{item.product_title || item.title}
									</h5>
									<button
										className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary-10 transition duration-200 hover:bg-primary-100"
										onClick={() => removeItem(item.id)}
									>
										<RxTrash
											size={18}
											className="text-[#FF0A0A] transition duration-200 group-hover:text-white"
										/>
									</button>
								</div>
								<div className="mt-7 grid grid-cols-2">
									<QtyControl
										quantity={item.quantity}
										onChange={(q) => updateItem(item.id, q)}
									/>
									<div className="flex space-x-9">
										<div>
											<h6 className="text-heading-6 text-start text-secondary-100">
												Price
											</h6>
											<span className="text-caption-2 text-primary-100">
												{formatPrice(item.unit_price, currency)}
											</span>
										</div>
										<div>
											<h6 className="text-heading-6 text-start text-secondary-100">
												Total
											</h6>
											<span className="text-caption-2 text-primary-100">
												{formatPrice(item.total ?? item.unit_price * item.quantity, currency)}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Desktop table */}
					<table className="hidden w-full table-auto lg:table">
						<thead>
							<tr>
								<th className="text-heading-6 border-b pb-4 text-start text-secondary-100">
									Product
								</th>
								<th className="text-heading-6 border-b pb-4 text-start text-secondary-100">
									Quantity
								</th>
								<th className="text-heading-6 border-b pb-4 text-start text-secondary-100">
									Price
								</th>
								<th className="text-heading-6 border-b pb-4 text-start text-secondary-100">
									Total
								</th>
								<th className="text-heading-6 border-b pb-4 text-start text-secondary-100"></th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr key={item.id}>
									<td className="border-b py-6">
										<div className="flex items-center space-x-3">
											{item.thumbnail && (
												<Image
													src={item.thumbnail}
													alt={item.product_title || item.title}
													width={100}
													height={100}
													className="h-[100px] w-[100px] rounded-2xl object-cover"
												/>
											)}
											<h5 className="text-heading-5 text-secondary-100">
												{item.product_title || item.title}
											</h5>
										</div>
									</td>
									<td className="border-b py-6">
										<QtyControl
											quantity={item.quantity}
											onChange={(q) => updateItem(item.id, q)}
										/>
									</td>
									<td className="border-b py-6">
										<span className="text-caption-2 text-primary-100">
											{formatPrice(item.unit_price, currency)}
										</span>
									</td>
									<td className="border-b py-6">
										<span className="text-caption-2 text-primary-100">
											{formatPrice(item.total ?? item.unit_price * item.quantity, currency)}
										</span>
									</td>
									<td className="border-b py-6">
										<button
											className="group flex h-[54px] w-[54px] items-center justify-center rounded-full bg-primary-10 transition duration-200 hover:bg-primary-100"
											onClick={() => removeItem(item.id)}
										>
											<RxTrash
												size={24}
												className="text-[#FF0A0A] transition duration-200 group-hover:text-white"
											/>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="mt-12 flex flex-col space-y-10 lg:flex-row lg:justify-between">
						<div>
							<h6 className="text-heading-6 text-secondary-100">Coupon</h6>
							<div className="mt-3 flex flex-col space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
								<input
									type="text"
									className="text-body-2-regular rounded-[100px] bg-primary-10 px-[18px] py-3.5 text-secondary-100 placeholder:text-secondary-50 focus:outline-primary-100"
									placeholder="Coupon code"
								/>
								<button className="btn-pink-solid w-fit">Apply Coupon</button>
							</div>
						</div>
						<div className="lg:w-1/3">
							<div className="flex items-center justify-between">
								<h6 className="text-heading-6 text-secondary-100">Subtotal</h6>
								<span className="text-caption-2 text-primary-100">
									{formatPrice(subtotal, currency)}
								</span>
							</div>
							<div className="mt-10 flex items-center justify-between border-b border-secondary-10 pb-7">
								<h4 className="text-heading-4 text-secondary-100">Total</h4>
								<span className="text-caption-1 text-primary-100">
									{formatPrice(total, currency)}
								</span>
							</div>
							<Link href="/checkout" className="btn-pink-solid mt-8 block w-full text-center">
								Checkout
							</Link>
							<Link
								href="/menu"
								className="text-body-3-medium mt-6 flex space-x-1 text-primary-100"
							>
								<MdKeyboardArrowLeft />{" "}
								<span className="hover:underline">Continue Shopping</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

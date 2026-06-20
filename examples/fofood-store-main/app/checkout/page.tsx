"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTitle from "@/components/page-title";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import {
	formatPrice,
	updateCartContact,
	listCartShippingOptions,
	addShippingMethod,
	createDelivery,
	transferCartToCustomer,
} from "@/lib/medusa";

const COUNTRIES = [
	{ code: "dk", name: "Denmark" },
	{ code: "de", name: "Germany" },
	{ code: "gb", name: "United Kingdom" },
	{ code: "se", name: "Sweden" },
	{ code: "fr", name: "France" },
	{ code: "es", name: "Spain" },
	{ code: "it", name: "Italy" },
];

export default function Checkout() {
	const router = useRouter();
	const { cart, loading, clearCart } = useCart();
	const { customer } = useAuth();

	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		address_1: "",
		city: "",
		postal_code: "",
		country_code: "dk",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Prefill the form with the logged-in customer's details.
	useEffect(() => {
		if (!customer) return;
		setForm((f) => ({
			...f,
			first_name: f.first_name || customer.first_name || "",
			last_name: f.last_name || customer.last_name || "",
			email: f.email || customer.email || "",
			phone: f.phone || customer.phone || "",
		}));
	}, [customer]);

	const items: any[] = cart?.items ?? [];
	const currency = cart?.currency_code ?? "eur";
	const total = cart?.total ?? cart?.item_subtotal ?? 0;

	const update = (key: string, value: string) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cart?.id || items.length === 0) {
			setError("Your cart is empty.");
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			const address = {
				first_name: form.first_name,
				last_name: form.last_name,
				address_1: form.address_1,
				city: form.city,
				postal_code: form.postal_code,
				country_code: form.country_code,
				phone: form.phone,
			};

			// Link the cart to the logged-in customer so the order is tied to
			// their account (best-effort; guest checkout still works).
			if (customer) {
				await transferCartToCustomer(cart.id);
			}

			await updateCartContact(cart.id, form.email, address);

			// Attach a shipping method (the delivery workflow needs one to build
			// the order). Pick the first eligible option.
			const options = await listCartShippingOptions(cart.id);
			if (options.length > 0) {
				await addShippingMethod(cart.id, options[0].id);
			}

			// Hand the cart over to the restaurant's delivery workflow.
			const { delivery } = await createDelivery(cart.id);

			clearCart();
			router.push(`/order/${delivery.id}`);
		} catch (err: any) {
			setError(
				err?.message ||
					"Something went wrong placing your order. Please try again."
			);
			setSubmitting(false);
		}
	};

	if (!loading && items.length === 0) {
		return (
			<>
				<PageTitle bgColor="bg-white" path="Checkout" title="Checkout" />
				<div className="container">
					<div className="flex flex-col items-center py-24 text-center">
						<h3 className="text-heading-4 text-secondary-100">
							Your cart is empty
						</h3>
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
			<PageTitle bgColor="bg-white" path="Checkout" title="Checkout" />

			<div className="container">
				<div className="grid grid-cols-1 gap-16 pb-20 pt-10 lg:grid-cols-2 lg:py-24">
					{/* Delivery details form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						<h3 className="text-heading-4 text-secondary-100">
							Delivery details
						</h3>
						<div className="grid grid-cols-2 gap-4">
							<Field
								label="First name"
								value={form.first_name}
								onChange={(v) => update("first_name", v)}
								required
							/>
							<Field
								label="Last name"
								value={form.last_name}
								onChange={(v) => update("last_name", v)}
								required
							/>
						</div>
						<Field
							label="Email"
							type="email"
							value={form.email}
							onChange={(v) => update("email", v)}
							required
						/>
						<Field
							label="Phone"
							value={form.phone}
							onChange={(v) => update("phone", v)}
						/>
						<Field
							label="Address"
							value={form.address_1}
							onChange={(v) => update("address_1", v)}
							required
						/>
						<div className="grid grid-cols-2 gap-4">
							<Field
								label="City"
								value={form.city}
								onChange={(v) => update("city", v)}
								required
							/>
							<Field
								label="Postal code"
								value={form.postal_code}
								onChange={(v) => update("postal_code", v)}
								required
							/>
						</div>
						<div>
							<label className="text-heading-6 text-secondary-100">
								Country
							</label>
							<select
								className="text-body-2-regular mt-2 w-full rounded-[12px] border border-secondary-10 bg-primary-10 px-[18px] py-3.5 text-secondary-100 focus:outline-primary-100"
								value={form.country_code}
								onChange={(e) => update("country_code", e.target.value)}
							>
								{COUNTRIES.map((c) => (
									<option key={c.code} value={c.code}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						{error && (
							<p className="text-body-2-regular text-[#FF0A0A]">{error}</p>
						)}

						<button
							type="submit"
							disabled={submitting}
							className="btn-pink-solid w-full disabled:opacity-60"
						>
							{submitting ? "Placing order..." : "Place Order"}
						</button>
					</form>

					{/* Order summary */}
					<div className="h-fit rounded-3xl border border-secondary-10 p-8">
						<h3 className="text-heading-4 text-secondary-100">Order summary</h3>
						<div className="mt-6 space-y-4">
							{items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between border-b border-secondary-10 pb-4"
								>
									<span className="text-body-2-medium text-secondary-100">
										{item.product_title || item.title}{" "}
										<span className="text-primary-100">×{item.quantity}</span>
									</span>
									<span className="text-body-2-medium text-secondary-100">
										{formatPrice(
											item.total ?? item.unit_price * item.quantity,
											currency
										)}
									</span>
								</div>
							))}
						</div>
						<div className="mt-6 flex items-center justify-between">
							<h4 className="text-heading-5 text-secondary-100">Total</h4>
							<span className="text-caption-1 text-primary-100">
								{formatPrice(total, currency)}
							</span>
						</div>
						<p className="text-body-3-regular mt-4 text-secondary-50">
							Payment is collected on delivery. Once you place the order the
							restaurant is notified and a driver will be assigned.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

function Field({
	label,
	value,
	onChange,
	type = "text",
	required,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	type?: string;
	required?: boolean;
}) {
	return (
		<div>
			<label className="text-heading-6 text-secondary-100">{label}</label>
			<input
				type={type}
				required={required}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="text-body-2-regular mt-2 w-full rounded-[12px] border border-secondary-10 bg-primary-10 px-[18px] py-3.5 text-secondary-100 placeholder:text-secondary-50 focus:outline-primary-100"
			/>
		</div>
	);
}

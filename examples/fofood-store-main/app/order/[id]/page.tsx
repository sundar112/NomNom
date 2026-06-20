"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import PageTitle from "@/components/page-title";
import { getDelivery, DELIVERY_STATUS_LABELS } from "@/lib/medusa";

const STEPS = [
	{ key: "pending", label: "Order placed" },
	{ key: "restaurant_accepted", label: "Accepted" },
	{ key: "restaurant_preparing", label: "Preparing" },
	{ key: "ready_for_pickup", label: "Ready" },
	{ key: "in_transit", label: "On the way" },
	{ key: "delivered", label: "Delivered" },
];

const STEP_ORDER: Record<string, number> = {
	pending: 0,
	restaurant_accepted: 1,
	pickup_claimed: 1,
	restaurant_preparing: 2,
	ready_for_pickup: 3,
	in_transit: 4,
	delivered: 5,
};

export default function OrderTracking({
	params,
}: {
	params: { id: string };
}) {
	const [delivery, setDelivery] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const poll = async () => {
			try {
				const { delivery } = await getDelivery(params.id);
				if (active) setDelivery(delivery);
			} catch (e: any) {
				if (active) setError(e?.message || "Could not load your order.");
			}
		};

		poll();
		const interval = setInterval(poll, 4000);
		return () => {
			active = false;
			clearInterval(interval);
		};
	}, [params.id]);

	const status: string = delivery?.delivery_status ?? "pending";
	const currentStep = STEP_ORDER[status] ?? 0;
	const declined = status === "restaurant_declined";

	return (
		<>
			<PageTitle bgColor="bg-white" path="Order Status" title="Order Status" />

			<div className="container">
				<div className="mx-auto max-w-2xl py-16 lg:py-24">
					<div className="rounded-3xl border border-secondary-10 p-8 text-center lg:p-12">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-white">
							<FiCheck size={32} />
						</div>
						<h2 className="text-heading-4 mt-6 text-secondary-100">
							Thank you for your order!
						</h2>
						<p className="text-body-1 mt-2 text-secondary-50">
							{error
								? error
								: DELIVERY_STATUS_LABELS[status] || "Tracking your order..."}
						</p>
						<p className="text-body-3-regular mt-2 text-secondary-50">
							Order reference: {params.id}
						</p>

						{!declined && (
							<div className="mt-10">
								<div className="flex items-center justify-between">
									{STEPS.map((step, index) => {
										const done = index <= currentStep;
										return (
											<div
												key={step.key}
												className="flex flex-1 flex-col items-center"
											>
												<div
													className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
														done
															? "bg-primary-100 text-white"
															: "bg-primary-10 text-primary-100"
													}`}
												>
													{done ? <FiCheck /> : index + 1}
												</div>
												<span className="text-body-3-regular mt-2 text-center text-secondary-50">
													{step.label}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{delivery?.eta && (
							<p className="text-body-2-medium mt-8 text-secondary-100">
								Estimated arrival:{" "}
								{new Date(delivery.eta).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						)}

						<div className="mt-10 flex justify-center space-x-4">
							<Link href="/menu" className="btn-pink-solid">
								Order more
							</Link>
							<Link href="/" className="btn-pink-outline">
								Back home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

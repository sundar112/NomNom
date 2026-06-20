"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTitle from "@/components/page-title";
import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
	const router = useRouter();
	const { customer, loading, logout } = useAuth();

	useEffect(() => {
		if (!loading && !customer) {
			router.replace("/login");
		}
	}, [loading, customer, router]);

	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	if (loading || !customer) {
		return (
			<>
				<PageTitle path="Account" title="My Account" />
				<div className="container">
					<div className="py-24 text-center text-secondary-50">Loading...</div>
				</div>
			</>
		);
	}

	return (
		<>
			<PageTitle path="Account" title="My Account" />
			<div className="container">
				<div className="mx-auto max-w-2xl py-16 lg:py-24">
					<div className="rounded-3xl border border-secondary-10 p-8 lg:p-10">
						<h2 className="text-heading-4 text-secondary-100">
							Hello, {customer.first_name || customer.email}
						</h2>
						<div className="mt-8 space-y-4">
							<Detail label="Name" value={`${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() || "—"} />
							<Detail label="Email" value={customer.email} />
							<Detail label="Phone" value={customer.phone || "—"} />
						</div>
						<div className="mt-10 flex flex-col gap-4 sm:flex-row">
							<Link href="/menu" className="btn-pink-solid text-center">
								Order food
							</Link>
							<button
								onClick={handleLogout}
								className="btn-pink-outline"
							>
								Log out
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between border-b border-secondary-10 pb-4">
			<span className="text-heading-6 text-secondary-100">{label}</span>
			<span className="text-body-2-regular text-secondary-50">{value}</span>
		</div>
	);
}

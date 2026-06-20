"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTitle from "@/components/page-title";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
	const router = useRouter();
	const { register } = useAuth();
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const update = (key: string, value: string) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			await register(form);
			router.push("/account");
		} catch (err: any) {
			setError(
				err?.message ||
					"Could not create your account. The email may already be registered."
			);
			setSubmitting(false);
		}
	};

	return (
		<>
			<PageTitle path="Register" title="Create your account" />
			<div className="container">
				<div className="mx-auto max-w-md py-16 lg:py-24">
					<div className="rounded-3xl border border-secondary-10 p-8 lg:p-10">
						<h2 className="text-heading-4 text-secondary-100">Sign up</h2>
						<p className="text-body-2-regular mt-2 text-secondary-50">
							Create an account to save your details and track deliveries.
						</p>
						<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
								label="Password"
								type="password"
								value={form.password}
								onChange={(v) => update("password", v)}
								required
							/>
							{error && (
								<p className="text-body-2-regular text-[#FF0A0A]">{error}</p>
							)}
							<button
								type="submit"
								disabled={submitting}
								className="btn-pink-solid w-full disabled:opacity-60"
							>
								{submitting ? "Creating account..." : "Create account"}
							</button>
						</form>
						<p className="text-body-2-regular mt-6 text-center text-secondary-50">
							Already have an account?{" "}
							<Link href="/login" className="text-primary-100 hover:underline">
								Sign in
							</Link>
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
				className="text-body-2-regular mt-2 w-full rounded-[12px] border border-secondary-10 bg-primary-10 px-[18px] py-3.5 text-secondary-100 focus:outline-primary-100"
			/>
		</div>
	);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTitle from "@/components/page-title";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			await login(email, password);
			router.push("/account");
		} catch {
			setError("Invalid email or password.");
			setSubmitting(false);
		}
	};

	return (
		<>
			<PageTitle path="Login" title="Welcome back" />
			<div className="container">
				<div className="mx-auto max-w-md py-16 lg:py-24">
					<div className="rounded-3xl border border-secondary-10 p-8 lg:p-10">
						<h2 className="text-heading-4 text-secondary-100">Sign in</h2>
						<p className="text-body-2-regular mt-2 text-secondary-50">
							Sign in to track your orders and check out faster.
						</p>
						<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
							<div>
								<label className="text-heading-6 text-secondary-100">Email</label>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="text-body-2-regular mt-2 w-full rounded-[12px] border border-secondary-10 bg-primary-10 px-[18px] py-3.5 text-secondary-100 focus:outline-primary-100"
								/>
							</div>
							<div>
								<label className="text-heading-6 text-secondary-100">
									Password
								</label>
								<input
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="text-body-2-regular mt-2 w-full rounded-[12px] border border-secondary-10 bg-primary-10 px-[18px] py-3.5 text-secondary-100 focus:outline-primary-100"
								/>
							</div>
							{error && (
								<p className="text-body-2-regular text-[#FF0A0A]">{error}</p>
							)}
							<button
								type="submit"
								disabled={submitting}
								className="btn-pink-solid w-full disabled:opacity-60"
							>
								{submitting ? "Signing in..." : "Sign in"}
							</button>
						</form>
						<p className="text-body-2-regular mt-6 text-center text-secondary-50">
							New to FoFood?{" "}
							<Link href="/register" className="text-primary-100 hover:underline">
								Create an account
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

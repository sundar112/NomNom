"use client";

import ProgressBar from "next-nprogress-bar";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			<CartProvider>
				<FavoritesProvider>
					{children}
					<ProgressBar
						height="5px"
						color="#DB6885"
						options={{ showSpinner: false }}
						shallowRouting
						appDirectory
					/>
				</FavoritesProvider>
			</CartProvider>
		</AuthProvider>
	);
};

export default Providers;

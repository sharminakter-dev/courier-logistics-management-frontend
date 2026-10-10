import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Courier & Logistics",
		template: "%s | Courier & Logistics",
	},
	description: "Send, track and manage parcels across cities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

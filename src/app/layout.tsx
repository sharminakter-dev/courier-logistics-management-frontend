import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: {
		default: "Courier & Logistics",
		template: "%s | Courier & Logistics",
	},
	description:
		"Create, pay for and track parcel deliveries across Bangladesh with live status updates.",
	openGraph: {
		title: "Courier & Logistics",
		description: "Create, pay for and track parcel deliveries.",
		type: "website",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="min-h-screen bg-background font-sans antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
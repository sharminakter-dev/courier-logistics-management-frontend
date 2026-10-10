import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { Brand } from "../Brand";

const COLUMNS = [
	{
		title: "Company",
		links: [
			{ label: "About", href: "/about" },
			{ label: "Services", href: "/services" },
			{ label: "Contact", href: "/contact" },
		],
	},
	{
		title: "Customers",
		links: [
			{ label: "Pricing", href: "/pricing" },
			{ label: "Track a parcel", href: "/track" },
			{ label: "Send a parcel", href: "/dashboard/shipments/new" },
		],
	},
	{
		title: "Account",
		links: [
			{ label: "Login", href: "/login" },
			{ label: "Register", href: "/register" },
		],
	},
];

export function Footer() {
	return (
		<footer className="border-t bg-muted/30">
			<div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
				<div className="space-y-3">
					<Brand />
					<p className="text-sm text-muted-foreground">
						Send, pay for and track parcels across Bangladesh, with a live
						timeline for every delivery.
					</p>
				</div>

				{COLUMNS.map((column) => (
					<div key={column.title}>
						<h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
						<ul className="space-y-2">
							{column.links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-t py-4 text-center text-xs text-muted-foreground">
				&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
			</div>
		</footer>
	);
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavLinksProps {
	className?: string;
	vertical?: boolean;
	onNavigate?: () => void;
}

export function NavLinks({ className, vertical = false, onNavigate }: NavLinksProps) {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Main"
			className={cn("flex gap-1", vertical && "flex-col", className)}
		>
			{NAV_LINKS.map((link) => {
				const active =
					link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

				return (
					<Link
						key={link.href}
						href={link.href}
						onClick={onNavigate}
						aria-current={active ? "page" : undefined}
						className={cn(
							"rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
							active ? "text-primary" : "text-muted-foreground",
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
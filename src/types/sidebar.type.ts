import type { LucideIcon } from "lucide-react";

export type NavItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	/** Match only the exact path (used for the section home). */
	exact?: boolean;
};

export type NavGroup = {
	label?: string;
	items: NavItem[];
};

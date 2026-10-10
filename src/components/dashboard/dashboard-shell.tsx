"use client";

import { Menu, Truck, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import { navForRole } from "@/routes";
import type { AuthUser } from "@/types/auth.type";
import { labelize } from "@/utils/format";
import { NotificationBell } from "./notification-bell";

export function DashboardShell({
	user,
	children,
}: {
	user: AuthUser;
	children: ReactNode;
}) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const groups = navForRole(user.role);
	const notificationsHref =
		groups.flatMap((group) => group.items).find((item) => item.href.endsWith("/notifications"))
			?.href ?? "/";

	const nav = (
		<nav className="flex-1 space-y-5 overflow-y-auto p-3">
			{groups.map((group) => (
				<div key={group.label ?? "main"} className="space-y-1">
					{group.label && (
						<p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{group.label}
						</p>
					)}
					{group.items.map((item) => {
						const active = item.exact
							? pathname === item.href
							: pathname === item.href || pathname.startsWith(`${item.href}/`);
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									active
										? "bg-sidebar-accent text-accent-foreground"
										: "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
								)}
							>
								<item.icon className="size-4" />
								{item.title}
							</Link>
						);
					})}
				</div>
			))}
		</nav>
	);

	const sidebar = (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
				<Truck className="size-5 text-primary" /> Courier & Logistics
			</div>
			{nav}
			<div className="space-y-2 border-t p-3">
				<div className="px-3">
					<p className="truncate text-sm font-medium">{user.name}</p>
					<p className="truncate text-xs text-muted-foreground">
						{labelize(user.role)}
					</p>
				</div>
				<LogoutButton />
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen">
			<aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar md:block">
				{sidebar}
			</aside>

			{open && (
				<div className="fixed inset-0 z-40 md:hidden">
					<button
						type="button"
						aria-label="Close menu"
						className="absolute inset-0 bg-black/40"
						onClick={() => setOpen(false)}
					/>
					<aside className="relative h-full w-64 bg-sidebar shadow-xl">
						{sidebar}
					</aside>
				</div>
			)}

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4">
					<button
						type="button"
						aria-label={open ? "Close menu" : "Open menu"}
						className="rounded-lg p-2 hover:bg-accent md:hidden"
						onClick={() => setOpen((value) => !value)}
					>
						{open ? <X className="size-5" /> : <Menu className="size-5" />}
					</button>
					<div className="ml-auto flex items-center gap-1">
						<NotificationBell href={notificationsHref} />
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6">{children}</main>
			</div>
		</div>
	);
}

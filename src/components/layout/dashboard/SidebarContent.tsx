"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/use-logout";
import { formatStatus } from "@/lib/format";
import { NAV_BY_ROLE } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Me } from "@/types/user";
import { Brand } from "../Brand";

interface SidebarContentProps {
	user: Me;
	onNavigate?: () => void;
}

const initials = (name: string) =>
	name
		.split(" ")
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

export function SidebarContent({ user, onNavigate }: SidebarContentProps) {
	const pathname = usePathname();
	const logout = useLogout();

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-16 items-center px-4">
				<Brand />
			</div>
			<Separator />

			<nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto p-3">
				{NAV_BY_ROLE[user.role].map((item) => {
					const active = item.exact
						? pathname === item.href
						: pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavigate}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
								active
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<item.icon className="size-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<Separator />
			<div className="space-y-3 p-4">
				<div className="flex items-center gap-3">
					<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
						{initials(user.name)}
					</span>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium">{user.name}</p>
						<p className="truncate text-xs text-muted-foreground">
							{formatStatus(user.role)}
						</p>
					</div>
				</div>
				<Button
					variant="outline"
					className="w-full"
					disabled={logout.isPending}
					onClick={() => logout.mutate()}
				>
					{logout.isPending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
					Logout
				</Button>
			</div>
		</div>
	);
}
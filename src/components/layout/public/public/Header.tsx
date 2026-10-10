import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROLE_HOME } from "@/lib/constants";
import type { Me } from "@/types/user";
import { Brand } from "../Brand";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header({ user }: { user: Me | null }) {
	const dashboardHref = user ? ROLE_HOME[user.role] : null;

	return (
		<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Brand />

				<NavLinks className="hidden lg:flex" />

				<div className="hidden items-center gap-2 lg:flex">
					{dashboardHref ? (
						<Button render={<Link href={dashboardHref} />} nativeButton={false}>
							Dashboard
						</Button>
					) : (
						<>
							<Button variant="ghost" render={<Link href="/login" />} nativeButton={false}>
								Login
							</Button>
							<Button render={<Link href="/register" />} nativeButton={false}>
								Register
							</Button>
						</>
					)}
				</div>

				<MobileNav dashboardHref={dashboardHref} />
			</div>
		</header>
	);
}
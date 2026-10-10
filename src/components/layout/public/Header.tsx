import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderActions } from "./HeaderActions";
import { NavLinks } from "./NavLinks";
import { Brand } from "./Brand";

export function Header() {
	return (
		<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Brand />
				<NavLinks className="hidden lg:flex" />
				<Suspense fallback={<Skeleton className="h-9 w-24 lg:w-40" />}>
					<HeaderActions />
				</Suspense>
			</div>
		</header>
	);
}
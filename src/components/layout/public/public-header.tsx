import { Truck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function PublicHeader() {
	return (
		<header className="border-b bg-card">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<Truck className="size-5 text-primary" /> Courier & Logistics
				</Link>
				<nav className="flex items-center gap-1 text-sm">
					<Link href="/track" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
						Track
					</Link>
					<Link href="/pricing" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
						Pricing
					</Link>
					<Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
						Sign in
					</Link>
					<Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
						Get started
					</Link>
				</nav>
			</div>
		</header>
	);
}

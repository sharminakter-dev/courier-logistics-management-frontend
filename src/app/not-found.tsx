import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
			<p className="text-6xl font-semibold text-primary">404</p>
			<h1 className="text-xl font-semibold">Page not found</h1>
			<p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
			<Link href="/" className={cn(buttonVariants())}>
				Back to home
			</Link>
		</div>
	);
}

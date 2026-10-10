import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function AccessDenied({ href = "/" }: { href?: string }) {
	return (
		<div className="flex flex-col items-center gap-3 py-24 text-center">
			<ShieldAlert className="size-10 text-destructive" />
			<h1 className="text-xl font-semibold">Access denied</h1>
			<p className="max-w-sm text-sm text-muted-foreground">
				Your account does not have permission to view this page.
			</p>
			<Link href={href} className={cn(buttonVariants({ variant: "outline" }))}>
				Go back
			</Link>
		</div>
	);
}

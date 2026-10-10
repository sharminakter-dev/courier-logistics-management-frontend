import { Truck } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Brand({ href = "/" }: { href?: string }) {
	return (
		<Link href={href} className="flex items-center gap-2 font-semibold">
			<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
				<Truck className="size-4" />
			</span>
			<span>{SITE_NAME}</span>
		</Link>
	);
}
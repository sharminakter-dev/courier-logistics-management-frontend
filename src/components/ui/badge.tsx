import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
	{
		variants: {
			variant: {
				default: "bg-primary/10 text-primary",
				secondary: "bg-secondary text-secondary-foreground",
				success: "bg-green-100 text-green-800",
				warning: "bg-amber-100 text-amber-800",
				destructive: "bg-red-100 text-red-800",
				outline: "border text-foreground",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

export function Badge({
	className,
	variant,
	...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

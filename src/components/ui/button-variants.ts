import { cva } from "class-variance-authority";

/**
 * Lives outside button.tsx on purpose: button.tsx is a client module, and
 * Server Components cannot call functions exported from client modules.
 * Import this file wherever you style a <Link> like a button.
 */
export const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				destructive: "bg-destructive text-white hover:bg-destructive/90",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4",
				sm: "h-8 px-3 text-xs",
				lg: "h-11 px-6 text-base",
				icon: "size-9",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

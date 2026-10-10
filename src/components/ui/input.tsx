"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = Omit<ComponentProps<typeof InputPrimitive>, "className"> & {
	className?: string;
};

export function Input({ className, ...props }: InputProps) {
	return (
		<InputPrimitive
			className={cn(
				"h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

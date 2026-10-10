import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** Turns TanStack Form / Standard Schema errors into one readable line. */
export function errorText(errors: unknown[] | undefined): string | undefined {
	const first = errors?.find(Boolean);
	if (!first) return undefined;
	if (typeof first === "string") return first;
	if (typeof first === "object" && "message" in first) {
		return String((first as { message: unknown }).message);
	}
	return "Invalid value";
}

type FormFieldProps = {
	label: string;
	htmlFor?: string;
	errors?: unknown[];
	hint?: string;
	children: ReactNode;
};

export function FormField({ label, htmlFor, errors, hint, children }: FormFieldProps) {
	const message = errorText(errors);
	return (
		<div className="space-y-1.5">
			<Label htmlFor={htmlFor}>{label}</Label>
			{children}
			{message ? (
				<p className="text-xs text-destructive">{message}</p>
			) : (
				hint && <p className="text-xs text-muted-foreground">{hint}</p>
			)}
		</div>
	);
}

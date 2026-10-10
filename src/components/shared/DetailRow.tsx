import type { ReactNode } from "react";

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
			<dt className="w-40 shrink-0 text-sm text-muted-foreground">{label}</dt>
			<dd className="text-sm font-medium break-words">{children}</dd>
		</div>
	);
}

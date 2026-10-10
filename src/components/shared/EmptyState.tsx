import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-14 text-center">
			<span className="flex size-12 items-center justify-center rounded-full bg-muted">
				<Icon className="size-5 text-muted-foreground" />
			</span>
			<h3 className="font-semibold">{title}</h3>
			{description && (
				<p className="max-w-sm text-sm text-muted-foreground">{description}</p>
			)}
			{action}
		</div>
	);
}
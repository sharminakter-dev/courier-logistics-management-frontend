import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	hint?: string;
}

export function StatCard({ title, value, icon: Icon, hint }: StatCardProps) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between gap-4">
				<div>
					<p className="text-sm text-muted-foreground">{title}</p>
					<p className="mt-1 text-2xl font-bold">{value}</p>
					{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
				</div>
				<span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Icon className="size-5" />
				</span>
			</CardContent>
		</Card>
	);
}
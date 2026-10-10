"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUrlState } from "@/hooks/use-url-state";

const ALL = "__all__";

interface FilterSelectProps {
	paramName: string;
	label: string;
	options: { value: string; label: string }[];
	className?: string;
}

export function FilterSelect({ paramName, label, options, className }: FilterSelectProps) {
	const { get, set } = useUrlState();
	const items = [{ value: ALL, label: `All ${label}` }, ...options];

	return (
		<Select
			items={items}
			value={get(paramName) ?? ALL}
			onValueChange={(value) =>
				set({ [paramName]: !value || value === ALL ? null : value })
			}
		>
			<SelectTrigger className={className ?? "w-full sm:w-52"} aria-label={`Filter by ${label}`}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
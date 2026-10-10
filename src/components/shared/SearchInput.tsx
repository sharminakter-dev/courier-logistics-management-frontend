"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlState } from "@/hooks/use-url-state";

interface SearchInputProps {
	placeholder?: string;
	paramName?: string;
}

export function SearchInput({
	placeholder = "Search...",
	paramName = "searchTerm",
}: SearchInputProps) {
	const { get, set } = useUrlState();
	const [value, setValue] = useState(get(paramName) ?? "");
	const debounced = useDebounce(value, 400);

	useEffect(() => {
		if ((get(paramName) ?? "") !== debounced) {
			set({ [paramName]: debounced || null });
		}
	}, [debounced, paramName, get, set]);

	return (
		<div className="relative w-full sm:max-w-xs">
			<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder={placeholder}
				aria-label={placeholder}
				className="pl-9"
			/>
		</div>
	);
}
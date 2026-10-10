"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackForm({ initial = "" }: { initial?: string }) {
	const router = useRouter();
	const [value, setValue] = useState(initial);

	return (
		<form
			className="flex w-full max-w-xl gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				const trimmed = value.trim();
				if (trimmed) router.push(`/track/${encodeURIComponent(trimmed)}`);
			}}
		>
			<Input
				aria-label="Tracking number"
				placeholder="CLG-20261008-A1B2C3D4"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				className="h-11"
			/>
			<Button type="submit" size="lg">
				<Search /> Track
			</Button>
		</form>
	);
}

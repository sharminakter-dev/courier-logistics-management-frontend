"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
				<TriangleAlert className="size-6 text-destructive" />
			</span>
			<h1 className="text-2xl font-bold">Something went wrong</h1>
			<p className="max-w-md text-muted-foreground">
				{error.message || "An unexpected error occurred. Please try again."}
			</p>
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button variant="outline" onClick={() => window.location.assign("/")}>
					Go home
				</Button>
			</div>
		</div>
	);
}
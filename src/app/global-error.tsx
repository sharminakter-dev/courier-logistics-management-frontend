"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
	return (
		<html lang="en">
			<body className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans">
				<h1 className="text-2xl font-bold">Something went wrong</h1>
				<p>The application hit an unexpected error.</p>
				<button
					type="button"
					onClick={reset}
					className="rounded-md bg-black px-4 py-2 text-white"
				>
					Try again
				</button>
			</body>
		</html>
	);
}
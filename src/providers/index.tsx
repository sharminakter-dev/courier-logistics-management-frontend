import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "./query.provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			{children}
			<Toaster richColors position="top-right" />
		</QueryProvider>
	);
}
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { GoogleProvider } from "./google.provider";
import { QueryProvider } from "./query.provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<GoogleProvider>
			<QueryProvider>
				{children}
				<Toaster richColors position="top-right" />
			</QueryProvider>
		</GoogleProvider>
	);
}
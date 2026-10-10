import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toaster";
import { GoogleAuthProvider } from "./google-auth.provider";
import { QueryProvider } from "./query.provider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<GoogleAuthProvider>
				<ToastProvider>{children}</ToastProvider>
			</GoogleAuthProvider>
		</QueryProvider>
	);
}

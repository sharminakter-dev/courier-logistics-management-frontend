"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export function GoogleProvider({ children }: { children: ReactNode }) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

	// without a client id the rest of the app must still work
	if (!clientId) return <>{children}</>;

	return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
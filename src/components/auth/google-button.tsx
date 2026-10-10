"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { useToast } from "@/components/ui/toaster";
import { toApiError } from "@/lib/api/request";
import { homeForRole } from "@/routes";
import { GOOGLE_CLIENT_ID } from "@/providers/google-auth.provider";

export function GoogleButton() {
	const router = useRouter();
	const toast = useToast();

	if (!GOOGLE_CLIENT_ID) return null;

	return (
		<div className="flex justify-center">
			<GoogleLogin
				onSuccess={async (response) => {
					if (!response.credential) {
						toast.error("Google did not return a credential");
						return;
					}
					try {
						const res = await authApi.google(response.credential);
						router.replace(homeForRole(res.data.user.role));
						router.refresh();
					} catch (error) {
						toast.error(toApiError(error).message);
					}
				}}
				onError={() => toast.error("Google sign-in failed")}
			/>
		</div>
	);
}

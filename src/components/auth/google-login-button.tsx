"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/use-google-login";

export function GoogleLoginButton({ redirectTo }: { redirectTo?: string }) {
	const googleLogin = useGoogleLogin(redirectTo);

	if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

	return (
		<div className="flex justify-center">
			<GoogleLogin
				text="continue_with"
				shape="rectangular"
				onSuccess={(response) => {
					if (!response.credential) {
						toast.error("Google did not return a credential. Please try again.");
						return;
					}
					googleLogin.mutate({ idToken: response.credential });
				}}
				onError={() => toast.error("Google sign-in failed. Please try again.")}
			/>
		</div>
	);
}
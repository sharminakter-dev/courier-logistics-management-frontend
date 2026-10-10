"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/use-google-login";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleLoginButton({ redirectTo }: { redirectTo?: string }) {
	const googleLogin = useGoogleLogin(redirectTo);

	// without a client id the rest of the login page still works
	if (!CLIENT_ID) return null;

	return (
		<GoogleOAuthProvider clientId={CLIENT_ID}>
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
		</GoogleOAuthProvider>
	);
}
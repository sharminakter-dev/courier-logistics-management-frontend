import { apiClient } from "@/lib/apiClient";
import type { AuthUser, LoginResult, RegisterResult } from "@/types/auth.type";

export type RegisterBody = {
	name: string;
	email: string;
	password: string;
	phone?: string;
};

export const authApi = {
	login: (body: { email: string; password: string }) =>
		apiClient<LoginResult>("/auth/login", { method: "POST", body }),
	google: (idToken: string) =>
		apiClient<LoginResult>("/auth/google", {
			method: "POST",
			body: { idToken },
		}),
	register: (body: RegisterBody) =>
		apiClient<RegisterResult>("/auth/register", { method: "POST", body }),
	verifyEmail: (body: { email: string; otp: string }) =>
		apiClient<LoginResult>("/auth/verify-email", { method: "POST", body }),
	logout: () => apiClient<Record<string, never>>("/auth/logout", { method: "POST" }),
	me: () => apiClient<AuthUser>("/auth/me"),
};

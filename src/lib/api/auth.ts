import type { Me, User } from "@/types/user";
import { apiClient } from "./client";

export interface AuthSession {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface RegisterResult {
	email: string;
	expiresInSeconds: number;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
	phone?: string;
}

export const authApi = {
	login: (body: { email: string; password: string }) =>
		apiClient<AuthSession>("/auth/login", { method: "POST", body }),

	register: (body: RegisterPayload) =>
		apiClient<RegisterResult>("/auth/register", { method: "POST", body }),

	verifyEmail: (body: { email: string; otp: string }) =>
		apiClient<AuthSession>("/auth/verify-email", { method: "POST", body }),

	googleLogin: (body: { idToken: string }) =>
		apiClient<AuthSession>("/auth/google", { method: "POST", body }),

	logout: () => apiClient<Record<string, never>>("/auth/logout", { method: "POST" }),

	me: () => apiClient<Me>("/auth/me"),
};
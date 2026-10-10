import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { homeForRole } from "@/routes";
import type { AuthUser, Role } from "@/types/auth.type";
import { apiServer } from "./api/server";
import { ApiError } from "./api/request";

/** Current user from the session cookie, or null when logged out. */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
	try {
		const res = await apiServer<AuthUser>("/auth/me");
		return res.data;
	} catch (error) {
		if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
			return null;
		}
		throw error;
	}
});

export async function requireUser(): Promise<AuthUser> {
	const user = await getCurrentUser();
	if (!user) redirect("/login");
	return user;
}

/** Sends logged-out users to /login and wrong-role users to their own home. */
export async function requireRole(...roles: Role[]): Promise<AuthUser> {
	const user = await requireUser();
	if (!roles.includes(user.role)) redirect(homeForRole(user.role));
	return user;
}

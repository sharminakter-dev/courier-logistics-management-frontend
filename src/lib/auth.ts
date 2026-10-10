import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ApiError } from "@/types/api";
import type { Role } from "@/types/enums";
import type { Me } from "@/types/user";
import { apiServer } from "./api/server";
import { ROLE_HOME } from "./constants";

// cache() means several layouts and pages share one request per render
export const getCurrentUser = cache(async (): Promise<Me | null> => {
	try {
		const res = await apiServer<Me>("/auth/me");
		return res.data;
	} catch (error) {
		// not logged in, token expired or account blocked
		if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
			return null;
		}
		throw error;
	}
});

export const requireRole = async (role: Role): Promise<Me> => {
	const user = await getCurrentUser();

	if (!user) redirect("/login");
	if (user.role !== role) redirect(ROLE_HOME[user.role]);

	return user;
};
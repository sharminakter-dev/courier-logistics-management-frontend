export const ROLES = ["SUPER_ADMIN", "ADMIN", "COURIER", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	role: Role;
	status: string;
	emailVerified: boolean;
	customer: { id: string; userId: string; address: string | null } | null;
	courier: Record<string, unknown> | null;
};

export type LoginResult = {
	accessToken: string;
	refreshToken: string;
	user: Pick<AuthUser, "id" | "name" | "email" | "role" | "status">;
};

export type RegisterResult = { email: string; expiresInSeconds: number };

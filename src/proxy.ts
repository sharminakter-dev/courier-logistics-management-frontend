import { type NextRequest, NextResponse } from "next/server";
import { ROLE_HOME } from "@/lib/constants";
import { ROLES, type Role } from "@/types/enums";

interface TokenPayload {
	role?: unknown;
	exp?: unknown;
}

const decodeToken = (token: string): { role: Role } | null => {
	try {
		const segment = token.split(".")[1];
		if (!segment) return null;

		const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
		const payload = JSON.parse(json) as TokenPayload;

		if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
			return null;
		}

		const role = ROLES.find((r) => r === payload.role);
		return role ? { role } : null;
	} catch {
		return null;
	}
};

const PROTECTED: { prefix: string; role: Role }[] = [
    // { prefix: "/superAdmin", role: "SUPERADMIN" },
	{ prefix: "/admin", role: "ADMIN" },
	{ prefix: "/courier", role: "COURIER" },
	{ prefix: "/dashboard", role: "CUSTOMER" },
];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("accessToken")?.value;
	const session = token ? decodeToken(token) : null;

	const rule = PROTECTED.find(
		(r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
	);

	if (rule) {
		if (!session) {
			const url = new URL("/login", request.url);
			url.searchParams.set("redirect", pathname);
			return NextResponse.redirect(url);
		}

		// logged in, but opening another role's area
		if (session.role !== rule.role) {
			return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
		}
	}

	// already logged in -> no need to see login/register
	if (session && (pathname === "/login" || pathname === "/register")) {
		return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
        // "superAdmin/:path",
		"/admin/:path*",
		"/courier/:path*",
		"/dashboard/:path*",
		"/login",
		"/register",
	],
};
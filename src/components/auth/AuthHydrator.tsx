"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { Me } from "@/types/user";

export function AuthHydrator({ user }: { user: Me }) {
	const setUser = useAuthStore((state) => state.setUser);

	useEffect(() => {
		setUser(user);
	}, [user, setUser]);

	return null;
}
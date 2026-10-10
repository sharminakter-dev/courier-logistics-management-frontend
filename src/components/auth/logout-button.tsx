"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [pending, setPending] = useState(false);

	async function logout() {
		setPending(true);
		try {
			await authApi.logout();
		} finally {
			queryClient.clear();
			router.replace("/login");
			router.refresh();
		}
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="w-full justify-start"
			disabled={pending}
			onClick={logout}
		>
			<LogOut /> Log out
		</Button>
	);
}

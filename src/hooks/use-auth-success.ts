import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AuthSession } from "@/lib/api/auth";
import { ROLE_HOME } from "@/lib/constants";
import { getSafeRedirect } from "@/lib/redirect";

export const useAuthSuccess = (redirectTo?: string | null) => {
	const router = useRouter();

	return (session: AuthSession, message?: string) => {
		toast.success(message ?? `Welcome back, ${session.user.name}!`);
		router.replace(getSafeRedirect(redirectTo) ?? ROLE_HOME[session.user.role]);
		router.refresh();
	};
};
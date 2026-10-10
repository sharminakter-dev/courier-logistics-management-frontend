import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ROLE_HOME } from "@/lib/constants";
import { getSafeRedirect } from "@/lib/redirect";
import { ApiError } from "@/types/api";

export const useLogin = (redirectTo?: string | null) => {
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (res) => {
			const { user } = res.data;

			toast.success(`Welcome back, ${user.name}!`);
			router.replace(getSafeRedirect(redirectTo) ?? ROLE_HOME[user.role]);
			router.refresh();
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError
					? error.message
					: "Login failed. Please try again.",
			);
		},
	});
};
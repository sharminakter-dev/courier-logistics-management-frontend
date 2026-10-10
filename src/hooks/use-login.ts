import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/types/api";
import { useAuthSuccess } from "./use-auth-success";

export const useLogin = (redirectTo?: string | null) => {
	const handleSuccess = useAuthSuccess(redirectTo);

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (res) => handleSuccess(res.data),
		onError: (error) => {
			toast.error(
				error instanceof ApiError ? error.message : "Login failed. Please try again.",
			);
		},
	});
};
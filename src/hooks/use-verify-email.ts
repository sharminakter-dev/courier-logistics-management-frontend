import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/types/api";
import { useAuthSuccess } from "./use-auth-success";

export const useVerifyEmail = () => {
	const handleSuccess = useAuthSuccess();

	return useMutation({
		mutationFn: authApi.verifyEmail,
		onSuccess: (res) =>
			handleSuccess(res.data, "Email verified. Welcome aboard!"),
		onError: (error) => {
			toast.error(
				error instanceof ApiError ? error.message : "Verification failed. Please try again.",
			);
		},
	});
};
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/types/api";

export const useRegister = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: authApi.register,
		onSuccess: (res) => {
			toast.success(res.message);
			router.push(`/account-verify?email=${encodeURIComponent(res.data.email)}`);
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError
					? error.message
					: "Registration failed. Please try again.",
			);
		},
	});
};
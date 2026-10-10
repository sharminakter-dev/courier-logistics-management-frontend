import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth.store";

export const useLogout = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const clear = useAuthStore((state) => state.clear);

	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => toast.success("You have been logged out"),
		// runs even when the API call fails, so the user always ends up logged out locally
		onSettled: () => {
			clear();
			queryClient.clear();
			router.replace("/login");
			router.refresh();
		},
	});
};
export const getOptionalUser = async (): Promise<Me | null> => {
	try {
		return await getCurrentUser();
	} catch {
		return null;
	}
};
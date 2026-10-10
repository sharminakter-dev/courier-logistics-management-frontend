export type Meta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type ApiSuccess<T> = {
	success: true;
	message: string;
	data: T;
	meta?: Meta;
};

export type ApiFieldError = { path: string; message: string };

export type ApiErrorBody = {
	success: false;
	message: string;
	errors?: ApiFieldError[];
};

export type PageQuery = { page?: number; limit?: number };

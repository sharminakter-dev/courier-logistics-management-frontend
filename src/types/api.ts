export interface ApiMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ApiSuccess<T> {
	success: true;
	message: string;
	data: T;
	meta?: ApiMeta;
}

export interface ApiFieldError {
	path: string;
	message: string;
}

export interface ApiErrorBody {
	success: false;
	message: string;
	errors: ApiFieldError[];
}

export class ApiError extends Error {
	readonly status: number;
	readonly errors: ApiFieldError[];

	constructor(status: number, message: string, errors: ApiFieldError[] = []) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.errors = errors;
	}
}
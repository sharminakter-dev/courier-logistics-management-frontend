import { z } from "zod";

const email = z.email("Please provide a valid email address");

export const passwordSchema = z
	.string("Password is required")
	.min(8, "Password must be at least 8 characters")
	.max(64, "Password must be at most 64 characters")
	.regex(/[a-z]/, "Password must contain a lowercase letter")
	.regex(/[A-Z]/, "Password must contain an uppercase letter")
	.regex(/[0-9]/, "Password must contain a number");

// empty is allowed (the field is optional)
export const phoneSchema = z
	.string()
	.trim()
	.refine(
		(value) => value === "" || /^\+?[0-9]{7,15}$/.test(value),
		"Please provide a valid phone number",
	);

export const loginSchema = z.object({
	email,
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.max(100, "Name must be at most 100 characters"),
		email,
		phone: phoneSchema,
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const verifyEmailSchema = z.object({
	email,
	otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
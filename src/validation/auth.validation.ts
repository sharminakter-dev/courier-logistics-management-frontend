import { z } from "zod";

const password = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(64, "Password must be at most 64 characters")
	.regex(/[a-z]/, "Add a lowercase letter")
	.regex(/[A-Z]/, "Add an uppercase letter")
	.regex(/\d/, "Add a number");

const phone = z.string().regex(/^\+?\d{7,15}$/, "Enter a valid phone number");

export const loginSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	email: z.email("Enter a valid email address"),
	password,
	phone: z.union([phone, z.literal("")]),
});

export const courierRegisterSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	email: z.email("Enter a valid email address"),
	password,
	phone,
	vehicleType: z.enum(["BICYCLE", "MOTORBIKE", "VAN", "TRUCK"]),
});

export const adminCourierSchema = courierRegisterSchema.extend({
	hubId: z.string(),
});

export const otpSchema = z.object({
	otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CourierRegisterValues = z.infer<typeof courierRegisterSchema>;

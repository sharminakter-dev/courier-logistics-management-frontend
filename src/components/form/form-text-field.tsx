"use client";

import type { ComponentProps } from "react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";

type FieldErrors = Array<{ message?: string } | undefined>;

interface FormTextFieldProps
	extends Omit<ComponentProps<typeof Input>, "value" | "onChange" | "id"> {
	label: string;
	name: string;
	value: string;
	onValueChange: (value: string) => void;
	errors: FieldErrors;
	showError: boolean;
	description?: string;
	isPassword?: boolean;
}

export function FormTextField({
	label,
	name,
	value,
	onValueChange,
	errors,
	showError,
	description,
	isPassword = false,
	...props
}: FormTextFieldProps) {
	const control = {
		...props,
		id: name,
		name,
		value,
		onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
			onValueChange(event.target.value),
		"aria-invalid": showError,
	};

	return (
		<Field data-invalid={showError}>
			<FieldLabel htmlFor={name}>{label}</FieldLabel>
			{isPassword ? <PasswordInput {...control} /> : <Input {...control} />}
			{description && !showError && (
				<FieldDescription>{description}</FieldDescription>
			)}
			{showError && <FieldError errors={errors} />}
		</Field>
	);
}
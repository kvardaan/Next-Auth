import { twMerge } from "tailwind-merge";
import { compare, hash } from "bcryptjs";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const hashPassword = async (password: string) => {
	const hashedPassword = await hash(password, 12);
	return hashedPassword;
};

export const comparePassword = async (password: string, hashedPassword: string) => {
	return await compare(password, hashedPassword);
};

"use server";

import * as z from "zod";

import { SignUpSchema } from "@/schemas";
import { hashPassword } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/mail";
import { sendVerificationMessage } from "@/lib/phone";
import { generatePhoneNumberVerificationToken, generateVerificationToken } from "@/lib/tokens";
import { createUser, getUserByEmail } from "@/lib/data/user";

export const register = async (values: z.infer<typeof SignUpSchema>) => {
	const validatedFields = SignUpSchema.safeParse(values);

	if (!validatedFields.success) return { error: "Invalid fields!" };

	const { email, phoneNumber, password } = validatedFields.data;
	const hashedPassword = await hashPassword(password);

	const existingUser = await getUserByEmail(email);
	if (existingUser) return { error: "Email already exists" };

	await createUser({ ...validatedFields.data, password: hashedPassword });

	// verifies Email
	const emailVerificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(emailVerificationToken.email as string, emailVerificationToken.token);

	// verifies Phone Number
	const phoneNumberVerificationToken = await generatePhoneNumberVerificationToken(phoneNumber);
	await sendVerificationMessage(phoneNumberVerificationToken.phoneNumber as string, phoneNumberVerificationToken.token);

	return { success: "Confirmation sent!" };
};

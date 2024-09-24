"use server";

import * as z from "zod";

import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { comparePassword, hashPassword } from "@/lib/utils";
import { getUserByEmail, getUserById, getUserByPhoneNumber } from "@/lib/data/user";
import { sendVerificationMessage } from "@/lib/phone";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: "Unauthorized!" };
	}

	const dbUser = await getUserById(user.id as string);

	if (!dbUser) {
		return { error: "Unauthorized!" };
	}

	if (user.isOAuth) {
		values.email = undefined;
		values.phoneNumber = undefined;
		values.password = undefined;
		values.newPassword = undefined;
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) return { error: "Email already in use!" };

		const verificationToken = await generateVerificationToken(values.email);

		await sendVerificationEmail(verificationToken.email as string, verificationToken.token);

		return { success: "Verification email sent!" };
	}

	if (values.phoneNumber && values.phoneNumber !== user.phoneNumber) {
		const existingUser = await getUserByPhoneNumber(values.phoneNumber);

		if (existingUser && existingUser.id !== user.id) return { error: "Phone Number in use!" };

		const verificationToken = await generateVerificationToken(values.phoneNumber);

		await sendVerificationMessage(verificationToken.phoneNumber as string, verificationToken.token);

		return { success: "Verification message sent!" };
	}

	if (values.newPassword && values.password && dbUser.password) {
		const passwordsMatch = await comparePassword(values.password, dbUser.password);

		if (!passwordsMatch) {
			return { error: "Incorrect password!" };
		}

		const hashedPassword = await hashPassword(values.newPassword);

		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	await prisma.user.update({
		where: { id: dbUser.id },
		data: { ...values },
	});

	return { success: "Settings Updated!" };
};

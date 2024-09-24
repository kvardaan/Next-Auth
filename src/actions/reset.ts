"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFiels = ResetSchema.safeParse(values);

	if (!validatedFiels.success) return { error: "Invalid email!" };

	const { email } = validatedFiels.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: "Email not found!" };
	}

	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

	return { success: "Reset email send!" };
};

"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/data/user";
import { getVerificationTokenByToken } from "@/lib/data/verification-token";

export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) return { error: "Token does not exist!" };

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) return { error: "Token has expired!" };

	const existingUser = await getUserByEmail(existingToken.email as string);

	if (!existingUser) return { error: "Email does not exist!" };

	try {
		await prisma.$transaction(async (transaction) => {
			await transaction.user.update({
				where: {
					id: existingUser.id,
				},
				data: {
					emailVerified: new Date(),
					email: existingToken.email as string,
				},
			});

			await transaction.verificationToken.delete({
				where: {
					id: existingToken.id,
				},
			});
		});

		return { success: "Email verified!" };
	} catch (error) {
		return { error: "Unknown error!" };
	}
};

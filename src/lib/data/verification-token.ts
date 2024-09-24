import { prisma } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { email },
		});

		return verificationToken;
	} catch {
		return null;
	}
};

export const getVerificationTokenByPhoneNumber = async (phoneNumber: string) => {
	try {
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { phoneNumber },
		});

		return verificationToken;
	} catch {
		return null;
	}
};

export const getVerificationTokenByToken = async (token: string) => {
	try {
		const verificationToken = await prisma.verificationToken.findUnique({
			where: { token },
		});

		return verificationToken;
	} catch (error) {
		return null;
	}
};

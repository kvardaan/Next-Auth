import { prisma } from "@/lib/db";

/**
 * Finds the user from the DB using Id
 */
export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Finds the user from the DB using Email
 */
export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Finds the user from the DB using Phone Number
 */
export const getUserByPhoneNumber = async (phoneNumber: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { phoneNumber },
		});

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Creates a new user.
 * Requires an email and hashed password
 */
export const createUser = async ({
	name,
	email,
	phoneNumber,
	password,
}: {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}) => {
	await prisma.user.create({
		data: {
			name,
			email,
			phoneNumber,
			password,
		},
	});
};

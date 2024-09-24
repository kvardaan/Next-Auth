import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/lib/data/user";
import { getAccountByUserId } from "./lib/data/account";

export const { handlers, signIn, signOut, auth } = NextAuth({
	pages: {
		signIn: "/login",
		error: "/error",
	},
	events: {
		async linkAccount({ user }) {
			await prisma.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id as string);

			if (!existingUser?.emailVerified) return false;

			return true;
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.phoneNumber = token.phoneNumber as string;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.phoneNumber = existingUser.phoneNumber;
			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	...authConfig,
});

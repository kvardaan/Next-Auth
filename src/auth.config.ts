import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import { SignInSchema } from "@/schemas";
import { comparePassword } from "@/lib/utils";
import { getUserByEmail } from "@/lib/data/user";

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				const validCredentials = SignInSchema.safeParse(credentials);

				if (!validCredentials.success) return null;
				const { email, password } = validCredentials.data;

				const user = await getUserByEmail(email);
				if (!user || !user.password) return null;

				const doPasswordsMatch = await comparePassword(password, user.password);

				return doPasswordsMatch
					? { id: user.id.toString(), email: user.email, name: user.name, phoneNumber: user.phoneNumber }
					: null;
			},
		}),
	],
} satisfies NextAuthConfig;

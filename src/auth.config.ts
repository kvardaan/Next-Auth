import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { LoginSchema } from '@/schemas'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { getUserByEmail } from '@/lib/data/user'

export default {
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials)

				if (!validatedFields.success) return null

				const { email, password } = validatedFields.data
				const user = await getUserByEmail(email)

				if (!user || !user.password) return null

				const doPasswordsMatch = await bcrypt.compare(password, user.password)

				return doPasswordsMatch ? user : null
			},
		}),
	],
} satisfies NextAuthConfig

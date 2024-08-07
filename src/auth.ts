import NextAuth from 'next-auth'
import { UserRole } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/lib/db'
import authConfig from '@/auth.config'
import { getUserById } from '@/lib/data/user'
import { getTwoFacorConfirmationByUserId } from './lib/data/two-factor-confirmation'

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			})
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// OAuth: allow without email verification
			if (account?.provider !== 'credentials') return true

			const existingUser = await getUserById(user.id as string)

			if (!existingUser?.emailVerified) return false

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFacorConfirmationByUserId(existingUser.id)

				if (!twoFactorConfirmation) return false

				/**
				 * Delete two factor confirmation for next sign in
				 * Or add a field in the model to expire it
				 */
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				})
			}

			return true
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole
			}

			return session
		},

		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserById(token.sub)

			if (!existingUser) return token

			token.role = existingUser.role
			return token
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
})

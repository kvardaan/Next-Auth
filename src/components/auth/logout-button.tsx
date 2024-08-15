'use client'

import { useRouter } from 'next/navigation'

// import { logout } from '@/actions/logout'
import { signOut } from 'next-auth/react'

interface LogoutButtonProps {
	children: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const router = useRouter()

	const onClick = () => {
		signOut()
	}

	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	)
}

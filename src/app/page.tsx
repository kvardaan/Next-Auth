import { cn } from '@/lib/utils'
import { poppins } from '@/lib/fonts'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'

export default function Home() {
	return (
		<main className="flex flex-col h-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
			<div className="space-y-6 text-center">
				<h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', poppins.className)}>
					🔐 Auth
				</h1>
				<p className="text-white text-lg">A simple authentication service</p>
				<div>
					<LoginButton>
						<Button variant="secondary" size="lg">
							Sign in
						</Button>
					</LoginButton>
				</div>
			</div>
		</main>
	)
}

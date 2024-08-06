import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'

const SettingsPage = async () => {
	const session = await auth()

	return (
		<div>
			<p>{JSON.stringify(session?.user)}</p>
			<p>{JSON.stringify(session?.expires)}</p>
			<form
				action={async () => {
					'use server'

					await signOut()
				}}
			>
				<Button type="submit" variant="outline">
					Sign out
				</Button>
			</form>
		</div>
	)
}

export default SettingsPage

import { NavBar } from '@/app/(protected)/_components/navbar'

interface ProtectedLayoutProps {
	children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full w-full gap-y-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
			<NavBar />
			{children}
		</div>
	)
}

export default ProtectedLayout

interface ModernNotification {
	label?: string;
}

export const ModernNotification = ({ label }: ModernNotification) => {
	return (
		<p className="w-full text-center text-white text-md mb-2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
			{label}
		</p>
	);
};

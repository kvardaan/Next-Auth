"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const NavBar = () => {
	const pathname = usePathname();

	return (
		<nav className="flex justify-between items-center bg-secondary p-4 rounded-xl shadow-sm w-[600px]">
			<div className="flex gap-x-2">
				<Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
					<Link href="/settings">Settings</Link>
				</Button>
			</div>
			<UserButton />
		</nav>
	);
};

"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormField, FormControl, FormMessage } from "@/components/ui/form";

const SettingsPage = () => {
	const user = useCurrentUser();
	const { update } = useSession();
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			phoneNumber: user?.phoneNumber || undefined,
			password: undefined,
			newPassword: undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((response) => {
					if (response.error) setError(response.error);
					else {
						update();
						setSuccess(response.success);
					}
				})
				.catch(() => setError("Something went wrong!"));
		});
	};

	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">⚙️ Settings</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4">
							{/* Name */}
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} placeholder="John Doe" disabled={isPending} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<>
									{/* Email */}
									<FormField
										name="email"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} placeholder="johndoe@example.com" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Phone Number */}
									<FormField
										name="phoneNumber"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input {...field} placeholder="+91 0000000000" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Password */}
									<FormField
										name="password"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="******" type="password" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* New-Password */}
									<FormField
										name="newPassword"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input {...field} placeholder="******" type="password" disabled={isPending} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button type="submit" disabled={isPending}>
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;

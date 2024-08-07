'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { LoginSchema } from '@/schemas'
import { login } from '@/actions/login'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '@/components/auth/card-wrapper'
import Link from 'next/link'

export const LoginForm = () => {
	const searchParams = useSearchParams()
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with different provider!'
			: ''

	const [showTwoFactor, setShowTwoFactor] = useState(false)
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: '',
		},
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('')
		setSuccess('')

		startTransition(async () => {
			try {
				const response = await login(values)
				if (response?.error) {
					form.reset()
					setError(response?.error)
				} else if (response?.success) {
					form.reset()
					setSuccess(response?.success)
				} else if (response?.twoFactor) {
					setShowTwoFactor(true)
				}
			} catch {
				setError('Something went wrong!')
			}
		})
	}

	return (
		<CardWrapper
			headerLabel="Welcome back"
			backButtonLabel="Don't have an account"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{showTwoFactor && (
							<FormField
								name="code"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Facor Code</FormLabel>
										<FormControl>
											<Input {...field} disabled={isPending} placeholder="123456" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!showTwoFactor && (
							<>
								{/* Email */}
								<FormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													disabled={isPending}
													type="email"
													placeholder="john.doe@example.com"
												/>
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
												<Input
													{...field}
													disabled={isPending}
													type="password"
													placeholder="******"
												/>
											</FormControl>
											<Button size="sm" variant="link" asChild className="px-0 font-normal">
												<Link href="/auth/reset">Forgot Password</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button type="submit" className="w-full" disabled={isPending}>
						{showTwoFactor ? 'Confirm' : 'Login'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

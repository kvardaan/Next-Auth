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
import { Input } from '@/components/ui/input'
import { NewPasswordSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { newPassword } from '@/actions/new-password'

export const NewPasswordForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError('')
		setSuccess('')

		startTransition(async () => {
			const response = await newPassword(values, token)
			setError(response?.error)
			setSuccess(response?.success)
		})
	}

	return (
		<CardWrapper
			headerLabel="Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{/* Password */}
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} type="password" placeholder="******" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button type="submit" className="w-full" disabled={isPending}>
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

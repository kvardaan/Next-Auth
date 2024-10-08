'use client'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { newVerification } from '@/actions/new-verification'

const NewVerificationForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()

	const onSubmit = useCallback(async () => {
		if (success || error) return

		if (!token) {
			setError('Missing token')
			return
		}
		try {
			const data = await newVerification(token)

			setSuccess(data.success)
			setError(data.error)
		} catch {
			setError('Something went wrong!')
		}
	}, [token, success, error])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<div className="flex items-center w-full justify-center">
				{!success && !error && <BeatLoader color="#7f7f7f" />}
				{!success && <FormError message={error} />}
				<FormSuccess message={success} />
			</div>
		</CardWrapper>
	)
}

export default NewVerificationForm

import { Resend } from "resend";

import { EmailVerification, PasswordReset } from "@/components/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const verifyLink = `${process.env.ROUTE}/new-verification?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "Confirm your email",
		react: EmailVerification({ verifyLink }),
	});
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${process.env.ROUTE}/new-password?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "Reset your password",
		react: PasswordReset({ resetLink }),
	});
};

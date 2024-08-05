"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegsiterSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/utils";

export const register = async (values: z.infer<typeof RegsiterSchema>) => {
  const validatedFields = RegsiterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "Email already in use!" };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return { success: "Registered Successfully!" };
};

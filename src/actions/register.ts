"use server";

import * as z from "zod";

import { RegsiterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegsiterSchema>) => {
  const validatedFields = RegsiterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Registered Successfully!" };
};

"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Ім'я має бути не менше 2 символів"),
  email: z.string().email("Невірний формат email"),
  password: z.string().min(8, "Пароль має бути не менше 8 символів"),
});

type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Користувач з таким email вже існує" };
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  return { success: true };
}

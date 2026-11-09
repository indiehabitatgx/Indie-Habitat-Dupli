"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

// Used to keep timing similar when the email doesn't exist.
const DUMMY_HASH = "$2b$12$3eZ5/VaKEgGdDF7IX04fS.qoZ3jboI9y0WjQhTQjtk8xqqiAfUo26";

export async function login(_: unknown, formData: FormData) {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000).ok) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };

  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { error: "Incorrect email or password." };

  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

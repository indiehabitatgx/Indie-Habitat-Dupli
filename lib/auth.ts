import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "habitat_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type Session = { sub: string; email: string; name: string; role: "ADMIN" | "EDITOR" };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(s);
}

export async function createSession(user: Session) {
  const token = await new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function verifyToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "ADMIN" ? "ADMIN" : "EDITOR",
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifyToken(token);
  if (!session) return null;
  // Confirm the user still exists (revocation by deleting the account).
  const user = await db.adminUser.findUnique({ where: { id: session.sub }, select: { id: true, role: true } });
  if (!user) return null;
  return { ...session, role: user.role };
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(role?: "ADMIN") {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (role === "ADMIN" && session.role !== "ADMIN") redirect("/admin?error=forbidden");
  return session;
}

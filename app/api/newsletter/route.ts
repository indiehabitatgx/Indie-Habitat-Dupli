import { db } from "@/lib/db";
import { handleForm } from "@/lib/api";
import { newsletterSchema } from "@/lib/validations";

export async function POST(req: Request) {
  return handleForm(
    req,
    "newsletter",
    newsletterSchema,
    async (d) => {
      const email = d.email.toLowerCase();
      // Same response whether or not the address already exists (no enumeration).
      await db.newsletterSubscriber.upsert({
        where: { email },
        update: { unsubscribedAt: null },
        create: { email },
      });
      return { ok: true, message: "You're on the list. See you at the next show." };
    },
    { limit: 5, windowMs: 10 * 60_000 },
  );
}

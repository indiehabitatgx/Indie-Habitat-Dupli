import { db } from "@/lib/db";
import { handleForm } from "@/lib/api";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  return handleForm(req, "contact", contactSchema, async (d) => {
    await db.contactEnquiry.create({
      data: {
        source: d.source,
        name: d.name,
        email: d.email.toLowerCase(),
        phone: d.phone ?? null,
        purpose: d.purpose,
        guests: d.guests ?? null,
        message: d.message ?? null,
      },
    });
    return { ok: true, message: `Thanks ${d.name.split(" ")[0]} — your message is with the team. We'll reply by email.` };
  });
}

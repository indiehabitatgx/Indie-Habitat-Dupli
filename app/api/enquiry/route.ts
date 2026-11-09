import { db } from "@/lib/db";
import { handleForm } from "@/lib/api";
import { corporateSchema } from "@/lib/validations";

export async function POST(req: Request) {
  return handleForm(req, "enquiry", corporateSchema, async (d) => {
    await db.corporateEnquiry.create({
      data: {
        name: d.name,
        company: d.organisation ?? null,
        email: d.email.toLowerCase(),
        phone: d.phone,
        eventType: d.eventType,
        preferredDate: new Date(`${d.preferredDate}T00:00:00+05:30`),
        attendees: d.attendees,
        duration: d.duration,
        foodBeverage: d.foodBeverage,
        technical: d.technical,
        message: d.message ?? null,
      },
    });
    return { ok: true, message: "Enquiry received. The events team will be in touch about availability." };
  });
}

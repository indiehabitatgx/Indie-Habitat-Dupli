"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CONTACT_PURPOSES, VENUE_GUESTS, contactSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";
import { Field, FormStatus, Honeypot, fieldAria } from "@/components/forms/Field";
import { postJson } from "@/components/forms/submit";

/**
 * General contact form (purposes from the original homepage form) and,
 * with `venueSlug`, the venue booking form used on each venue page.
 */
export function ContactForm({
  venueSlug,
  purposes,
}: {
  venueSlug?: string;
  purposes?: readonly string[];
}) {
  const isVenue = Boolean(venueSlug);
  const options = purposes ?? CONTACT_PURPOSES;
  const prefix = isVenue ? `book-${venueSlug}` : "contact";
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      company: "",
      source: isVenue ? `venue:${venueSlug}` : "contact",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState(null);
    const res = await postJson("/api/contact", values);
    setState(res);
    if (res.ok) reset();
  });

  const id = (n: string) => `${prefix}-${n}`;

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 md:grid-cols-2">
      <Honeypot register={register} />
      <input type="hidden" {...register("source")} />
      <Field id={id("name")} label="Your name" required error={errors.name?.message}>
        <input className="field" autoComplete="name" {...fieldAria(id("name"), errors.name?.message)} {...register("name")} />
      </Field>
      <Field id={id("email")} label="Your email" required error={errors.email?.message}>
        <input
          className="field"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...fieldAria(id("email"), errors.email?.message)}
          {...register("email")}
        />
      </Field>
      <Field id={id("phone")} label="Mobile number" required={false} error={errors.phone?.message}>
        <input
          className="field"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          {...fieldAria(id("phone"), errors.phone?.message)}
          {...register("phone")}
        />
      </Field>
      <Field id={id("purpose")} label="Purpose" required error={errors.purpose?.message}>
        <select className="field" defaultValue="" {...fieldAria(id("purpose"), errors.purpose?.message)} {...register("purpose")}>
          <option value="" disabled>
            Please choose an option
          </option>
          {options.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      {isVenue && (
        <Field id={id("guests")} label="Number of guests" required={false} error={errors.guests?.message} className="md:col-span-2">
          <select
            className="field"
            defaultValue=""
            {...fieldAria(id("guests"), errors.guests?.message)}
            {...register("guests", { setValueAs: (v) => (v === "" ? undefined : v) })}
          >
            <option value="">Not sure yet</option>
            {VENUE_GUESTS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field id={id("message")} label="Your message" required={false} error={errors.message?.message} className="md:col-span-2">
        <textarea className="field min-h-36 resize-y" {...fieldAria(id("message"), errors.message?.message)} {...register("message")} />
      </Field>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">We store your details only to reply to this enquiry. See our privacy policy.</p>
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? <Spinner label="Sending" /> : isVenue ? "Send booking request" : "Send message"}
        </Button>
      </div>
      <div className="md:col-span-2" aria-live="polite">
        <FormStatus state={state} />
      </div>
    </form>
  );
}

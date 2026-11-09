"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CORPORATE_DURATIONS,
  CORPORATE_EVENT_TYPES,
  CORPORATE_FNB,
  CORPORATE_GUESTS,
  CORPORATE_TECH,
  corporateSchema,
} from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";
import { Field, FormStatus, Honeypot, fieldAria } from "@/components/forms/Field";
import { postJson } from "@/components/forms/submit";

const p = (n: string) => `corp-${n}`;

function Options({ items }: { items: readonly string[] }) {
  return (
    <>
      <option value="" disabled>
        Select
      </option>
      {items.map((i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </>
  );
}

export function CorporateEnquiryForm() {
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(corporateSchema),
    defaultValues: { name: "", organisation: "", email: "", phone: "", preferredDate: "", message: "", technical: [], company: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState(null);
    const res = await postJson("/api/enquiry", values);
    setState(res);
    if (res.ok) reset();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 md:grid-cols-2">
      <Honeypot register={register} />
      <Field id={p("name")} label="Your name" required error={errors.name?.message}>
        <input className="field" autoComplete="name" {...fieldAria(p("name"), errors.name?.message)} {...register("name")} />
      </Field>
      <Field id={p("organisation")} label="Company" required={false} error={errors.organisation?.message}>
        <input className="field" autoComplete="organization" {...fieldAria(p("organisation"))} {...register("organisation")} />
      </Field>
      <Field id={p("email")} label="Email" required error={errors.email?.message}>
        <input className="field" type="email" inputMode="email" autoComplete="email" {...fieldAria(p("email"), errors.email?.message)} {...register("email")} />
      </Field>
      <Field id={p("phone")} label="Phone" required error={errors.phone?.message}>
        <input className="field" type="tel" inputMode="tel" autoComplete="tel" {...fieldAria(p("phone"), errors.phone?.message)} {...register("phone")} />
      </Field>
      <Field id={p("eventType")} label="Type of event" required error={errors.eventType?.message}>
        <select className="field" defaultValue="" {...fieldAria(p("eventType"), errors.eventType?.message)} {...register("eventType")}>
          <Options items={CORPORATE_EVENT_TYPES} />
        </select>
      </Field>
      <Field id={p("preferredDate")} label="Preferred date" required error={errors.preferredDate?.message}>
        <input className="field" type="date" min={today} {...fieldAria(p("preferredDate"), errors.preferredDate?.message)} {...register("preferredDate")} />
      </Field>
      <Field id={p("attendees")} label="Expected attendees" required error={errors.attendees?.message}>
        <select className="field" defaultValue="" {...fieldAria(p("attendees"), errors.attendees?.message)} {...register("attendees")}>
          <Options items={CORPORATE_GUESTS} />
        </select>
      </Field>
      <Field id={p("duration")} label="Duration you need the space for" required error={errors.duration?.message}>
        <select className="field" defaultValue="" {...fieldAria(p("duration"), errors.duration?.message)} {...register("duration")}>
          <Options items={CORPORATE_DURATIONS} />
        </select>
      </Field>
      <Field id={p("foodBeverage")} label="Food & beverage" required error={errors.foodBeverage?.message} className="md:col-span-2">
        <select className="field" defaultValue="" {...fieldAria(p("foodBeverage"), errors.foodBeverage?.message)} {...register("foodBeverage")}>
          <Options items={CORPORATE_FNB} />
        </select>
      </Field>
      <fieldset className="md:col-span-2">
        <legend className="mb-3 font-display text-[0.72rem] font-bold uppercase tracking-[0.14em]">
          Technical requirements <span className="font-sans text-[0.75rem] font-normal normal-case tracking-normal text-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {CORPORATE_TECH.map((t) => (
            <label
              key={t}
              className="flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-surface-2 px-4 has-[:checked]:border-amber has-[:checked]:text-amber"
            >
              <input type="checkbox" value={t} className="size-4 accent-[var(--brand-primary)]" {...register("technical")} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <Field
        id={p("message")}
        label="Message"
        required={false}
        hint="Decor plans, timings, anything else. Decor set-up time is also chargeable."
        error={errors.message?.message}
        className="md:col-span-2"
      >
        <textarea
          className="field min-h-36 resize-y"
          {...fieldAria(p("message"), errors.message?.message, "hint")}
          {...register("message")}
        />
      </Field>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">The team will get back to you with availability and a quote.</p>
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full md:w-auto">
          {isSubmitting ? <Spinner label="Sending" /> : "Send enquiry"}
        </Button>
      </div>
      <div className="md:col-span-2" aria-live="polite">
        <FormStatus state={state} />
      </div>
    </form>
  );
}

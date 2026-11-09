"use client";

import { useActionState, useState } from "react";
import { saveEvent, type ActionState } from "@/app/admin/actions";
import { AField, ImageInput, SubmitBar, TitleSlug } from "@/components/admin/ui";
import { DAY_SHORT } from "@/lib/utils";

export type EventFormValues = {
  id: string | null;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  venueId: string;
  recurrence: "WEEKLY" | "ONE_OFF";
  scheduleDays: number[];
  scheduleText: string;
  startDate: string;
  endDate: string;
  startTime: string;
  ticketPrice: string;
  priceNote: string;
  bookingUrl: string;
  bookingProvider: string;
  terms: string;
  bannerImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
};

export function EventForm({
  values,
  categories,
  venues,
  notice,
}: {
  values: EventFormValues;
  categories: { id: string; name: string }[];
  venues: { id: string; name: string }[];
  notice?: string;
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveEvent.bind(null, values.id), notice ? { ok: true, message: notice } : null);
  const [recurrence, setRecurrence] = useState(values.recurrence);
  const e = state?.fieldErrors;

  return (
    <form action={action} className="grid gap-10">
      <section className="grid gap-6 md:grid-cols-2">
        <TitleSlug titleName="title" titleLabel="Title" defaultTitle={values.title} defaultSlug={values.slug} errors={e} />
        <AField name="shortDescription" label="Short description" required errors={e} hint="Shown on cards and in search results (max 300)." className="md:col-span-2">
          <textarea id="shortDescription" name="shortDescription" className="field min-h-20" maxLength={300} defaultValue={values.shortDescription} required />
        </AField>
        <AField name="description" label="Full description" required errors={e} hint="Separate paragraphs with a blank line." className="md:col-span-2">
          <textarea id="description" name="description" className="field min-h-48" defaultValue={values.description} required />
        </AField>
        <AField name="categoryId" label="Category" required errors={e}>
          <select id="categoryId" name="categoryId" className="field" defaultValue={values.categoryId} required>
            <option value="" disabled>
              Select
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </AField>
        <AField name="venueId" label="Room" errors={e} hint="Leave blank if not confirmed.">
          <select id="venueId" name="venueId" className="field" defaultValue={values.venueId}>
            <option value="">Not specified</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </AField>
      </section>

      <fieldset className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-extrabold uppercase">Schedule</legend>
        <AField name="recurrence" label="Type" required errors={e}>
          <select id="recurrence" name="recurrence" className="field" value={recurrence} onChange={(ev) => setRecurrence(ev.target.value as "WEEKLY" | "ONE_OFF")}>
            <option value="WEEKLY">Weekly show</option>
            <option value="ONE_OFF">One-off event</option>
          </select>
        </AField>
        <AField name="startTime" label="Earliest start time" errors={e} hint="Used for sorting (24h).">
          <input id="startTime" name="startTime" type="time" className="field" defaultValue={values.startTime} />
        </AField>
        {recurrence === "WEEKLY" ? (
          <div className="md:col-span-2">
            <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-fg/80">
              Days <span className="text-amber">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {DAY_SHORT.map((d, i) => (
                <label key={d} className="flex min-h-11 cursor-pointer items-center gap-2 border border-line px-4 has-[:checked]:border-amber has-[:checked]:text-amber">
                  <input type="checkbox" name="scheduleDays" value={i} defaultChecked={values.scheduleDays.includes(i)} className="accent-[var(--brand-primary)]" />
                  {d}
                </label>
              ))}
            </div>
            {e?.scheduleDays && <p className="mt-2 text-sm font-semibold text-danger">{e.scheduleDays[0]}</p>}
          </div>
        ) : (
          <>
            <AField name="startDate" label="Start date & time" required errors={e}>
              <input id="startDate" name="startDate" type="datetime-local" className="field" defaultValue={values.startDate} />
            </AField>
            <AField name="endDate" label="End date & time" errors={e}>
              <input id="endDate" name="endDate" type="datetime-local" className="field" defaultValue={values.endDate} />
            </AField>
          </>
        )}
        <AField name="scheduleText" label="Schedule as shown to visitors" required errors={e} hint='e.g. "Thu & Fri · 8:00 PM"' className="md:col-span-2">
          <input id="scheduleText" name="scheduleText" className="field" defaultValue={values.scheduleText} required />
        </AField>
      </fieldset>

      <fieldset className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-extrabold uppercase">Tickets</legend>
        <AField name="ticketPrice" label="Lowest price (₹)" errors={e} hint="Only enter a price the ticketing page confirms.">
          <input id="ticketPrice" name="ticketPrice" type="number" min={0} step={1} className="field" defaultValue={values.ticketPrice} />
        </AField>
        <AField name="priceNote" label="Price details" errors={e} hint='e.g. "Mon–Fri ₹300 · Sat–Sun ₹500"'>
          <input id="priceNote" name="priceNote" className="field" defaultValue={values.priceNote} />
        </AField>
        <AField name="bookingUrl" label="Booking URL" errors={e} hint="The official ticketing page (e.g. BookMyShow).">
          <input id="bookingUrl" name="bookingUrl" type="url" className="field" defaultValue={values.bookingUrl} placeholder="https://in.bookmyshow.com/…" />
        </AField>
        <AField name="bookingProvider" label="Booking provider" errors={e}>
          <input id="bookingProvider" name="bookingProvider" className="field" defaultValue={values.bookingProvider} placeholder="BookMyShow" />
        </AField>
        <AField name="terms" label="Terms / house rules" errors={e} hint="One rule per line." className="md:col-span-2">
          <textarea id="terms" name="terms" className="field min-h-32" defaultValue={values.terms} />
        </AField>
      </fieldset>

      <fieldset className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-extrabold uppercase">Poster &amp; publishing</legend>
        <ImageInput fileName="bannerFile" pathName="bannerImage" label="Poster (portrait works best)" current={values.bannerImage} errors={e} />
        <div className="grid content-start gap-6">
          <AField name="status" label="Status" required errors={e}>
            <select id="status" name="status" className="field" defaultValue={values.status}>
              <option value="DRAFT">Draft — hidden</option>
              <option value="PUBLISHED">Published — live</option>
              <option value="ARCHIVED">Archived — hidden</option>
            </select>
          </AField>
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" name="featured" defaultChecked={values.featured} className="size-4 accent-[var(--brand-primary)]" />
            Feature on the homepage
          </label>
          <AField name="sortOrder" label="Sort order" errors={e} hint="Lower numbers show first.">
            <input id="sortOrder" name="sortOrder" type="number" min={0} className="field" defaultValue={values.sortOrder} />
          </AField>
        </div>
      </fieldset>

      <fieldset className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-extrabold uppercase">SEO</legend>
        <AField name="seoTitle" label="SEO title" errors={e} hint="Max 70 characters. Defaults to the title.">
          <input id="seoTitle" name="seoTitle" className="field" maxLength={70} defaultValue={values.seoTitle} />
        </AField>
        <AField name="seoDescription" label="SEO description" errors={e} hint="Max 170 characters. Defaults to the short description.">
          <textarea id="seoDescription" name="seoDescription" className="field min-h-20" maxLength={170} defaultValue={values.seoDescription} />
        </AField>
      </fieldset>

      <SubmitBar state={state} label={values.id ? "Save changes" : "Create event"} />
    </form>
  );
}

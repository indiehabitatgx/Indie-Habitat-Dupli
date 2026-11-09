"use client";

import { useActionState } from "react";
import { saveArtist, type ActionState } from "@/app/admin/actions";
import { AField, ImageInput, SubmitBar, TitleSlug } from "@/components/admin/ui";

export type ArtistFormValues = {
  id: string | null;
  name: string;
  slug: string;
  biography: string;
  profileImage: string | null;
  instagram: string;
  youtube: string;
  x: string;
  website: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function ArtistForm({ values, notice }: { values: ArtistFormValues; notice?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(saveArtist.bind(null, values.id), notice ? { ok: true, message: notice } : null);
  const e = state?.fieldErrors;
  return (
    <form action={action} className="grid gap-10">
      <section className="grid gap-6 md:grid-cols-2">
        <TitleSlug titleName="name" titleLabel="Name" defaultTitle={values.name} defaultSlug={values.slug} errors={e} />
        <AField name="biography" label="Biography" required errors={e} hint="Use the artist's approved bio. Separate paragraphs with a blank line." className="md:col-span-2">
          <textarea id="biography" name="biography" className="field min-h-48" defaultValue={values.biography} required />
        </AField>
      </section>
      <section className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <ImageInput fileName="profileFile" pathName="profileImage" label="Profile photo (authorised only)" current={values.profileImage} errors={e} />
        <div className="grid content-start gap-6">
          {(["instagram", "youtube", "x", "website"] as const).map((k) => (
            <AField key={k} name={k} label={k === "x" ? "X / Twitter URL" : `${k[0].toUpperCase()}${k.slice(1)} URL`} errors={e}>
              <input id={k} name={k} type="url" className="field" defaultValue={values[k]} placeholder="https://" />
            </AField>
          ))}
        </div>
      </section>
      <section className="grid gap-6 border-t border-line pt-8 md:grid-cols-2">
        <AField name="status" label="Status" required errors={e}>
          <select id="status" name="status" className="field" defaultValue={values.status}>
            <option value="DRAFT">Draft — hidden</option>
            <option value="PUBLISHED">Published — live</option>
            <option value="ARCHIVED">Archived — hidden</option>
          </select>
        </AField>
        <label className="flex min-h-11 items-center gap-3 self-end">
          <input type="checkbox" name="featured" defaultChecked={values.featured} className="size-4 accent-[var(--brand-primary)]" />
          Feature on the homepage
        </label>
      </section>
      <SubmitBar state={state} label={values.id ? "Save changes" : "Create artist"} />
    </form>
  );
}

"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Play, Trash2 } from "lucide-react";
import { addGalleryImage, deleteGalleryImage, updateGalleryImage, type ActionState } from "@/app/admin/actions";
import { AField, ConfirmButton, ImageInput, SubmitBar } from "@/components/admin/ui";
import { GALLERY_CATEGORIES } from "@/lib/validations";

type Item = { id: string; title: string; alt: string; src: string; category: string; sortOrder: number; published: boolean; mediaType: "IMAGE" | "VIDEO" };

export function AddGalleryForm() {
  const [resetKey, setResetKey] = useState(0);
  const [state, action] = useActionState<ActionState, FormData>(async (prev, fd) => {
    const res = await addGalleryImage(prev, fd);
    if (res?.ok) setResetKey((k) => k + 1);
    return res;
  }, null);
  const e = state?.fieldErrors;
  return (
    <form action={action} className="grid gap-6 border border-line p-5 md:grid-cols-2" key={resetKey}>
      <ImageInput fileName="image" pathName="_unused" label="Image" errors={e} aspect="aspect-[4/3]" />
      <div className="grid content-start gap-5">
        <AField name="title" label="Title" required errors={e}>
          <input id="title" name="title" className="field" required />
        </AField>
        <AField name="alt" label="Alt text" required errors={e} hint="Describe what's in the photo for screen-reader users.">
          <textarea id="alt" name="alt" className="field min-h-20" required />
        </AField>
        <div className="grid grid-cols-2 gap-4">
          <AField name="category" label="Category" required errors={e}>
            <select id="category" name="category" className="field" defaultValue="Venue">
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </AField>
          <AField name="sortOrder" label="Sort order" errors={e}>
            <input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={100} className="field" />
          </AField>
        </div>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="published" defaultChecked className="size-4 accent-[var(--brand-primary)]" /> Published
        </label>
      </div>
      <div className="md:col-span-2">
        <SubmitBar state={state} label="Upload to gallery" />
      </div>
    </form>
  );
}

function EditRow({ item, canDelete }: { item: Item; canDelete: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(updateGalleryImage.bind(null, item.id), null);
  const e = state?.fieldErrors;
  return (
    <li className="grid gap-4 border border-line p-4 md:grid-cols-[160px_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Image src={item.src} alt={item.alt} fill sizes="160px" className="object-cover" />
        {item.mediaType === "VIDEO" && (
          <span className="absolute inset-0 grid place-items-center bg-black/40">
            <Play className="size-6 fill-white" aria-label="Video" />
          </span>
        )}
      </div>
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted">
          Title
          <input name="title" defaultValue={item.title} className="field !min-h-10 text-sm normal-case tracking-normal text-fg" aria-invalid={e?.title ? true : undefined} />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted">
          Category
          <select name="category" defaultValue={item.category} className="field !min-h-10 text-sm normal-case tracking-normal text-fg">
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted sm:col-span-2">
          Alt text
          <input name="alt" defaultValue={item.alt} className="field !min-h-10 text-sm normal-case tracking-normal text-fg" aria-invalid={e?.alt ? true : undefined} />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            Order
            <input name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} className="field !min-h-10 w-20 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={item.published} className="size-4 accent-[var(--brand-primary)]" /> Published
          </label>
          <button type="submit" className="min-h-10 border border-line px-4 text-sm font-semibold hover:border-amber">
            Save
          </button>
          {canDelete && (
            <ConfirmButton action={() => deleteGalleryImage(item.id)} message="Remove this item from the gallery?">
              <Trash2 className="size-4" aria-hidden /> Delete
            </ConfirmButton>
          )}
          {state && <span className={state.ok ? "text-sm text-amber" : "text-sm text-danger"}>{state.message}</span>}
        </div>
      </form>
    </li>
  );
}

export function GalleryList({ items, canDelete }: { items: Item[]; canDelete: boolean }) {
  return (
    <ul className="grid gap-4">
      {items.map((i) => (
        <EditRow key={i.id} item={i} canDelete={canDelete} />
      ))}
    </ul>
  );
}

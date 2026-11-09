"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";
import { cn, slugify } from "@/lib/utils";
import type { ActionState } from "@/app/admin/actions";

export function AField({
  name,
  label,
  errors,
  hint,
  required,
  className,
  children,
}: {
  name: string;
  label: string;
  errors?: Record<string, string[]>;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const err = errors?.[name]?.[0];
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-fg/80">
        {label}
        {required && <span className="text-amber"> *</span>}
      </label>
      {children}
      {err ? (
        <p className="text-sm font-semibold text-danger" role="alert">
          {err}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitBar({ state, label = "Save" }: { state: ActionState; label?: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse items-stretch gap-3 border-t border-line bg-bg/95 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
      <p aria-live="polite" className={cn("text-sm font-semibold", state?.ok ? "text-amber" : "text-danger")}>
        {state?.message}
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? <Spinner label="Saving" /> : label}
      </Button>
    </div>
  );
}

/** Title + slug pair: slug follows the title until edited by hand. */
export function TitleSlug({
  titleName,
  titleLabel,
  defaultTitle = "",
  defaultSlug = "",
  errors,
}: {
  titleName: string;
  titleLabel: string;
  defaultTitle?: string;
  defaultSlug?: string;
  errors?: Record<string, string[]>;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [touched, setTouched] = useState(Boolean(defaultSlug));
  return (
    <>
      <AField name={titleName} label={titleLabel} required errors={errors}>
        <input
          id={titleName}
          name={titleName}
          className="field"
          value={title}
          required
          onChange={(e) => {
            setTitle(e.target.value);
            if (!touched) setSlug(slugify(e.target.value));
          }}
        />
      </AField>
      <AField name="slug" label="URL slug" required errors={errors} hint="Lowercase, hyphenated. Changing it changes the public URL.">
        <input
          id="slug"
          name="slug"
          className="field font-mono text-sm"
          value={slug}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          onChange={(e) => {
            setTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
      </AField>
    </>
  );
}

/** File input with instant local preview; keeps the existing path in a hidden field. */
export function ImageInput({
  fileName,
  pathName,
  label,
  current,
  errors,
  aspect = "aspect-[3/4]",
}: {
  fileName: string;
  pathName: string;
  label: string;
  current?: string | null;
  errors?: Record<string, string[]>;
  aspect?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [path, setPath] = useState(current ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? (path || null);
  return (
    <AField name={fileName} label={label} errors={errors} hint="JPEG, PNG, WebP or AVIF, up to 8 MB. Converted to WebP automatically.">
      <input type="hidden" name={pathName} value={path} />
      <div className={cn("relative w-full max-w-xs overflow-hidden border border-dashed border-line bg-surface-2", aspect)}>
        {shown ? (
          preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview of the selected image" className="size-full object-cover" />
          ) : (
            <Image src={shown} alt="Current image" fill sizes="320px" className="object-cover" />
          )
        ) : (
          <span className="grid size-full place-items-center text-sm text-muted">No image</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-line px-4 text-sm font-semibold hover:border-amber">
          <Upload className="size-4" aria-hidden /> Choose image
          <input
            ref={inputRef}
            id={fileName}
            name={fileName}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (preview) URL.revokeObjectURL(preview);
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
        </label>
        {shown && (
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 px-3 text-sm text-danger hover:underline"
            onClick={() => {
              setPreview(null);
              setPath("");
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <Trash2 className="size-4" aria-hidden /> Remove
          </button>
        )}
      </div>
    </AField>
  );
}

export function ConfirmButton({
  action,
  children,
  message = "Are you sure? This cannot be undone.",
  className,
}: {
  action: () => Promise<unknown>;
  children: ReactNode;
  message?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={cn("inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-danger hover:underline disabled:opacity-50", className)}
      onClick={() => {
        if (window.confirm(message)) start(() => void action());
      }}
    >
      {pending ? <Spinner label="Working" /> : children}
    </button>
  );
}

export function StatusSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => Promise<unknown>;
  label: string;
}) {
  const [pending, start] = useTransition();
  const [v, setV] = useState(value);
  return (
    <select
      aria-label={label}
      className="field !min-h-10 !py-1.5 text-sm"
      value={v}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setV(next);
        start(() => void onChange(next));
      }}
    >
      <option value="NEW">New</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="RESOLVED">Resolved</option>
      <option value="SPAM">Spam</option>
    </select>
  );
}

export function FeatureToggle({ checked, onToggle, label }: { checked: boolean; onToggle: (v: boolean) => Promise<unknown>; label: string }) {
  const [pending, start] = useTransition();
  const [on, setOn] = useState(checked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={pending}
      onClick={() => {
        setOn(!on);
        start(() => void onToggle(!on));
      }}
      className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-amber" : "bg-white/15")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-bg transition-all", on ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

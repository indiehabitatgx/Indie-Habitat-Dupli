"use client";

import { useActionState } from "react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import { AField, SubmitBar } from "@/components/admin/ui";

export function SettingsForm({ values }: { values: { announcement: string; announcementEnabled: boolean; aboutStory: string } }) {
  const [state, action] = useActionState<ActionState, FormData>(saveSettings, null);
  const e = state?.fieldErrors;
  return (
    <form action={action} className="grid max-w-3xl gap-8">
      <fieldset className="grid gap-4">
        <legend className="mb-2 font-display text-lg font-extrabold uppercase">Announcement bar</legend>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="announcementEnabled" defaultChecked={values.announcementEnabled} className="size-4 accent-[var(--brand-primary)]" />
          Show the announcement bar on every page
        </label>
        <AField name="announcement" label="Message" errors={e} hint="Max 240 characters. Use it for the venue's current status, schedule changes or offers.">
          <textarea id="announcement" name="announcement" maxLength={240} className="field min-h-20" defaultValue={values.announcement} />
        </AField>
      </fieldset>
      <fieldset className="grid gap-4 border-t border-line pt-8">
        <legend className="mb-2 font-display text-lg font-extrabold uppercase">About page — Our story</legend>
        <AField name="aboutStory" label="Story" errors={e} hint="Shown on /about only when filled in. Separate paragraphs with a blank line. Use client-approved wording.">
          <textarea id="aboutStory" name="aboutStory" maxLength={5000} className="field min-h-56" defaultValue={values.aboutStory} />
        </AField>
      </fieldset>
      <SubmitBar state={state} label="Save settings" />
    </form>
  );
}

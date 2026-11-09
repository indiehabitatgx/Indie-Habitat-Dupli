"use client";

import { useActionState } from "react";
import { RefreshCw, Unplug } from "lucide-react";
import { connectInstagram, disconnectInstagram, syncInstagram, type ActionState } from "@/app/admin/actions";
import { AField, ConfirmButton, SubmitBar } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

type Status = {
  configured: boolean;
  source: "database" | "env" | null;
  username: string | null;
  masked: string;
  refreshedAt: string | null;
  lastSyncAt: string | null;
  lastError: string | null;
};

const fmt = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso)) : "—";

export function InstagramPanel({ status, isAdmin }: { status: Status; isAdmin: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(connectInstagram, null);
  const e = state?.fieldErrors;

  return (
    <section className="grid max-w-3xl gap-6 border-t border-line pt-8">
      <div>
        <h2 className="font-display text-lg font-extrabold uppercase">Instagram feed</h2>
        <p className="mt-1 text-sm text-muted">
          Shows the latest @indiehabitat posts on the homepage via the official Instagram API, refreshed hourly. Without a token, venue photos
          are shown instead.
        </p>
      </div>

      <dl className="grid gap-px border border-line bg-line text-sm sm:grid-cols-2">
        {[
          ["Status", !status.configured ? "Not connected" : status.lastError ? "Token saved · sync failing" : `Connected${status.username ? ` · @${status.username}` : ""}`],
          ["Token", status.configured ? `${status.masked} (${status.source === "env" ? "env var" : "saved in admin"})` : "—"],
          ["Last sync", fmt(status.lastSyncAt)],
          ["Token refreshed", fmt(status.refreshedAt)],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg p-3">
            <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
            <dd className={k === "Status" && status.configured ? (status.lastError ? "font-semibold text-danger" : "font-semibold text-amber") : "font-semibold"}>{v}</dd>
          </div>
        ))}
      </dl>
      {status.lastError && (
        <p role="alert" className="border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
          Last sync failed: {status.lastError}
        </p>
      )}

      {status.configured && (
        <div className="flex flex-wrap items-center gap-4">
          <form action={syncInstagram}>
            <Button type="submit" variant="outline" size="sm">
              <RefreshCw className="size-4" aria-hidden /> Sync now
            </Button>
          </form>
          {isAdmin && status.source === "database" && (
            <ConfirmButton action={disconnectInstagram} message="Disconnect Instagram? The homepage will fall back to venue photos.">
              <Unplug className="size-4" aria-hidden /> Disconnect
            </ConfirmButton>
          )}
        </div>
      )}

      {isAdmin && (
        <form action={action} className="grid gap-4">
          <AField
            name="instagramToken"
            label={status.configured ? "Replace access token" : "Long-lived access token"}
            errors={e}
            hint="Generated in the Meta developer dashboard for the @indiehabitat Professional account (see docs/deployment-guide.md). Stored server-side only; refreshed automatically."
          >
            <input id="instagramToken" name="instagramToken" type="password" autoComplete="off" spellCheck={false} className="field font-mono text-sm" placeholder="IGAA…" />
          </AField>
          <SubmitBar state={state} label={status.configured ? "Verify & replace" : "Verify & connect"} />
        </form>
      )}
    </section>
  );
}

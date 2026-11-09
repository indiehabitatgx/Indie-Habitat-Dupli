"use client";

import { useCallback, useState } from "react";
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client";
import { RealtimeProvider, useLiveQuery } from "@neon/realtime-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

type SettingRow = { key: string; value: string };

type Props = {
  realtimeUrl: string;
  sealedQuery: SealedLiveQuery<SettingRow>;
  initialData: SettingRow[];
  fallbackText: string;
};

function toAnnouncement(rows: readonly SettingRow[], fallbackText: string) {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const enabled = (map.announcementEnabled ?? "true") === "true";
  const text = map.announcement ?? fallbackText;
  return enabled && text ? text : null;
}

function LiveBar({ sealedQuery, initialData, fallbackText }: Omit<Props, "realtimeUrl">) {
  // Keep the first sealed query; renewals go through refreshQuery (a new object would restart the subscription).
  const [query] = useState(sealedQuery);
  const refreshQuery = useCallback(async () => {
    const res = await fetch("/api/live/announcement", { method: "POST" });
    if (!res.ok) throw new Error(`Could not renew the live announcement (${res.status})`);
    return (await res.json()) as SealedLiveQuery<SettingRow>;
  }, []);
  const { data, status } = useLiveQuery(query, { refreshQuery, initialData });
  const text = toAnnouncement(data ?? initialData, fallbackText);
  if (!text) return null;
  return <AnnouncementBar text={text} live={status === "live"} />;
}

/** Announcement bar that updates instantly (Neon Realtime) when an admin changes it in Admin → Settings. */
export function LiveAnnouncement({ realtimeUrl, ...rest }: Props) {
  // One client per mounted app, created in the browser tree (it never connects during the server render).
  const [client] = useState(() => createRealtimeClient({ url: realtimeUrl }));
  return (
    <RealtimeProvider client={client}>
      <LiveBar {...rest} />
    </RealtimeProvider>
  );
}

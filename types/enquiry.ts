export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM";

/** Shape returned by every public form endpoint. */
export type FormResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

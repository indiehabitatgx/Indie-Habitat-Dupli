"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUp, ArrowUpRight, RotateCcw, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { ChatLink } from "@/lib/assistant/engine";
import { OPEN_ASSISTANT_EVENT } from "@/components/layout/MobileTabBar";

type Msg = {
  id: string;
  role: "user" | "assistant";
  /** full text received so far */
  text: string;
  /** characters revealed by the typewriter */
  shown: number;
  links?: ChatLink[];
  status: "thinking" | "typing" | "done" | "error";
  streamDone?: boolean;
};

const STORE = "habitat-assistant-v1";
const SUGGESTIONS = ["What's on tonight?", "Ticket prices", "Book a private event", "How do I get there?", "Can I perform at an open mic?"];
const THINKING = ["Reading the line-up", "Checking house rules", "Looking up the rooms", "Putting it together"];

const WELCOME: Msg = {
  id: "welcome",
  role: "assistant",
  text: "Hey, I'm the Habitat assistant. Ask me about shows and tickets, the rooms, private and corporate bookings, house rules, getting here — or how to grab an open-mic spot.",
  shown: Number.MAX_SAFE_INTEGER,
  status: "done",
};

const uid = () => Math.random().toString(36).slice(2, 10);

function Mark({ className }: { className?: string }) {
  // Official circled-H mark (white); inverted where it sits on amber.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/brand/habitat-mark-w.png" alt="" width={192} height={192} className={className} />;
}

function Avatar({ busy }: { busy?: boolean }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center">
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--brand-primary),transparent_35%,var(--brand-primary)_70%,transparent)] opacity-60",
          busy ? "animate-[orbit_1.1s_linear_infinite] opacity-100" : "animate-[orbit_6s_linear_infinite]",
        )}
        aria-hidden
      />
      <span className="relative grid size-8 place-items-center rounded-full bg-bg">
        <Mark className="size-5" />
      </span>
    </span>
  );
}

/** Renders plain text with "• " bullet lines as a list. */
function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: string) => {
    if (bullets.length) {
      blocks.push(
        <ul key={k} className="my-1.5 space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("• ")) bullets.push(line.slice(2));
    else {
      flush(`u${i}`);
      if (line.trim()) blocks.push(<p key={`p${i}`} className="[&+p]:mt-2">{line}</p>);
    }
  });
  flush("end");
  return <>{blocks}</>;
}

function Thinking() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % THINKING.length), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3 py-1" role="status" aria-label="Assistant is thinking">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((d) => (
          <span key={d} className="size-1.5 rounded-full bg-amber" style={{ animation: `typing-dot 1.1s ${d * 0.15}s ease-in-out infinite` }} />
        ))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="shimmer-text text-sm font-semibold"
        >
          {THINKING[i]}…
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function LinkChips({ links, onInternal }: { links: ChatLink[]; onInternal: () => void }) {
  return (
    <motion.ul
      className="mt-3 flex flex-wrap gap-1.5"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {links.map((l) => {
        const cls =
          "inline-flex min-h-8 items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[0.78rem] font-semibold text-amber transition hover:border-amber hover:bg-amber hover:text-amber-ink";
        return (
          <motion.li key={l.href + l.label} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
            {l.external ? (
              <a href={l.href} target={l.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>
                {l.label} <ArrowUpRight className="size-3.5" aria-hidden />
                {!l.href.startsWith("tel:") && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            ) : (
              <Link href={l.href} className={cls} onClick={onInternal}>
                {l.label} <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"ai" | "local">("local");
  const [announce, setAnnounce] = useState("");
  const [nudge, setNudge] = useState(false);
  const busy = messages.some((m) => m.status === "thinking" || m.status === "typing");
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Restore conversation for this tab.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null") as Msg[] | null;
      if (saved?.length) queueMicrotask(() => setMessages(saved));
      if (!sessionStorage.getItem(`${STORE}-nudged`)) {
        const t = setTimeout(() => setNudge(true), 6000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // Persist finished messages.
  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.filter((m) => m.status === "done").slice(-30)));
    } catch {}
  }, [messages, busy]);

  // Typewriter: reveal received text smoothly, faster when there's a backlog.
  useEffect(() => {
    const target = messages.find((m) => m.status === "typing");
    if (!target) return;
    const raf = requestAnimationFrame(() => {
      setMessages((list) =>
        list.map((m) => {
          if (m.id !== target.id) return m;
          const backlog = m.text.length - m.shown;
          if (backlog <= 0) return m.streamDone ? { ...m, status: "done" } : m;
          return { ...m, shown: m.shown + Math.max(2, Math.ceil(backlog / 14)) };
        }),
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [messages]);

  // Announce completed replies once (the visible log isn't a live region, to avoid per-character chatter).
  const lastDone = [...messages].reverse().find((m) => m.role === "assistant" && m.status === "done" && m.id !== "welcome");
  useEffect(() => {
    if (lastDone) queueMicrotask(() => setAnnounce(lastDone.text));
  }, [lastDone?.id, lastDone?.text]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the newest message in view.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.shown, open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile tab bar "Ask" button.
  useEffect(() => {
    const onOpen = () => {
      setNudge(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => launcher.current?.focus({ preventScroll: true }), 50);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function send(text: string) {
    const q = text.trim().slice(0, 600);
    if (!q || busy) return;
    setInput("");
    const user: Msg = { id: uid(), role: "user", text: q, shown: q.length, status: "done" };
    const reply: Msg = { id: uid(), role: "assistant", text: "", shown: 0, status: "thinking" };
    const history = [...messages, user].filter((m) => m.status === "done" && m.id !== "welcome");
    setMessages((m) => [...m, user, reply]);

    const update = (patch: Partial<Msg> | ((m: Msg) => Partial<Msg>)) =>
      setMessages((list) => list.map((m) => (m.id === reply.id ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) } : m)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.text.slice(0, 600) })) }),
      });
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const raw = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!raw) continue;
          const ev = JSON.parse(raw) as { type: string; mode?: "ai" | "local"; links?: ChatLink[]; text?: string };
          if (ev.type === "meta") {
            if (ev.mode) setMode(ev.mode);
            update({ links: ev.links ?? [] });
          } else if (ev.type === "delta" && ev.text) {
            const t = ev.text;
            update((m) => ({ text: m.text + t, status: "typing" }));
          } else if (ev.type === "done") {
            update((m) => ({ streamDone: true, status: m.text ? "typing" : "done" }));
          }
        }
      }
    } catch (e) {
      update({
        status: "error",
        text: `${(e as Error).message} You can also call +91 98333 58492.`,
        shown: Number.MAX_SAFE_INTEGER,
        links: [{ label: "Contact the team", href: "/contact" }],
      });
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };
  const reset = () => {
    setMessages([WELCOME]);
    try {
      sessionStorage.removeItem(STORE);
    } catch {}
  };
  const onInternal = () => {
    if (window.innerWidth < 640) setOpen(false);
  };
  const conversationStarted = messages.some((m) => m.role === "user");

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-8 right-8 z-[60] hidden lg:block">
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              onClick={() => {
                setNudge(false);
                setOpen(true);
                try {
                  sessionStorage.setItem(`${STORE}-nudged`, "1");
                } catch {}
              }}
              className="liquid-glass liquid-glass-dark absolute bottom-full right-0 mb-3 w-max max-w-[16rem] rounded-2xl rounded-br-sm px-4 py-2.5 text-left text-sm"
            >
              <span className="font-semibold">Questions about a show?</span>
              <span className="block text-xs text-muted">Ask me — I know the line-up, rooms & rules.</span>
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          ref={launcher}
          type="button"
          onClick={() => {
            setNudge(false);
            try {
              sessionStorage.setItem(`${STORE}-nudged`, "1");
            } catch {}
            setOpen((o) => !o);
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-expanded={open}
          aria-controls="habitat-assistant"
          aria-label={open ? "Close assistant" : "Open the Habitat assistant"}
          className={cn(
            "relative grid size-14 place-items-center rounded-full bg-amber text-amber-ink shadow-[0_14px_40px_-8px_rgba(252,178,50,0.55)] ring-1 ring-black/10",
            open && "max-sm:hidden",
          )}
        >
          {!open && <span className="absolute inset-0 animate-ping rounded-full bg-amber/40 [animation-duration:2.6s] motion-reduce:hidden" aria-hidden />}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="size-6" aria-hidden />
              </motion.span>
            ) : (
              <motion.span key="h" className="relative" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                <Mark className="size-8 invert" />
                <Sparkles className="absolute -right-2.5 -top-2 size-3.5 fill-amber-ink" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="habitat-assistant"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="liquid-glass liquid-glass-dark fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-2 right-2 top-[max(0.5rem,env(safe-area-inset-top))] z-[61] flex flex-col overflow-hidden rounded-[1.75rem] sm:left-auto sm:right-4 sm:top-auto sm:h-[min(680px,calc(100svh-2rem))] sm:w-[420px] lg:bottom-28 lg:right-8 lg:h-[min(640px,calc(100svh-9rem))] lg:w-[400px]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Avatar busy={busy} />
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="flex items-center gap-1.5 font-display text-sm font-extrabold uppercase tracking-wide">
                  Habitat Assistant <Sparkles className="size-3.5 text-amber" aria-hidden />
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]" aria-hidden />
                  {busy ? "Thinking…" : "Online · replies in seconds"}
                </p>
              </div>
              {conversationStarted && (
                <button type="button" onClick={reset} className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg" aria-label="Start a new chat">
                  <RotateCcw className="size-4" aria-hidden />
                </button>
              )}
              <button type="button" onClick={close} className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg" aria-label="Close assistant">
                <X className="size-5" aria-hidden />
              </button>
            </header>

            {/* Messages */}
            <div ref={scroller} role="log" aria-live="off" aria-label="Conversation" className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("flex gap-2.5", m.role === "user" && "justify-end")}
                >
                  {m.role === "assistant" && <Avatar busy={m.status === "thinking" || m.status === "typing"} />}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-amber font-medium text-amber-ink"
                        : cn("rounded-tl-md border border-white/10 bg-white/[0.06]", m.status === "error" && "border-danger/50"),
                    )}
                  >
                    {m.status === "thinking" ? (
                      <Thinking />
                    ) : (
                      <>
                        <RichText text={m.text.slice(0, m.shown)} />
                        {m.status === "typing" && (
                          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-amber animate-[caret_0.9s_steps(1)_infinite]" aria-hidden />
                        )}
                        {(m.status === "done" || m.status === "error") && m.links && m.links.length > 0 && <LinkChips links={m.links} onInternal={onInternal} />}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {!conversationStarted && (
                <motion.div className="flex flex-wrap gap-2 pl-11" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}>
                  {SUGGESTIONS.map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                      onClick={() => void send(s)}
                      className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[0.8rem] font-medium transition hover:border-amber hover:text-amber"
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {announce}
            </p>

            {/* Composer */}
            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-black/30 p-1.5 pl-3.5 transition focus-within:border-amber/70">
                <label htmlFor="assistant-input" className="sr-only">
                  Ask a question
                </label>
                <textarea
                  id="assistant-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={600}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={busy ? "Thinking…" : "Ask about shows, tickets, rooms…"}
                  className="max-h-[120px] min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] outline-none placeholder:text-muted"
                />
                <motion.button
                  type="submit"
                  disabled={busy || !input.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber text-amber-ink transition disabled:bg-white/10 disabled:text-muted"
                  aria-label="Send"
                >
                  <ArrowUp className="size-4.5" aria-hidden />
                </motion.button>
              </div>
              <p className="mt-2 px-1 text-center text-[0.68rem] leading-snug text-muted">
                {mode === "ai" ? "AI answers powered by Claude, grounded in" : "Answers come from"} The Habitat&apos;s published info. Confirm show times on BookMyShow.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

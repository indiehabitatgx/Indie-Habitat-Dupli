import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  size = "lg",
  align = "left",
  action,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-4xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        {typeof title === "string" ? (
          <TextReveal as={Tag} id={id} text={title} className={size === "lg" ? "display-lg" : "display-md"} />
        ) : (
          <Tag id={id} className={size === "lg" ? "display-lg" : "display-md"}>
            {title}
          </Tag>
        )}
        {intro && <div className="mt-5 max-w-2xl text-lg text-current/75">{intro}</div>}
      </Reveal>
      {action && <Reveal delay={0.1} className="shrink-0">{action}</Reveal>}
    </div>
  );
}

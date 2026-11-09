import { cn } from "@/lib/utils";

/**
 * Hollow headline text that fills with amber, left → right, on hover (pure CSS, see `.text-outline` in globals.css).
 * The fill layer is generated content with empty alt text, so screen readers read the word once.
 */
export function OutlineText({ children, className, style }: { children: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn("text-outline", className)} data-text={children} style={style}>
      {children}
    </span>
  );
}

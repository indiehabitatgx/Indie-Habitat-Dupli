import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/btn relative inline-flex min-h-12 select-none items-center justify-center gap-2 overflow-hidden rounded-[2px] px-6 font-display text-[0.8rem] font-bold uppercase tracking-[0.14em] transition-[color,background-color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98] [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg:last-of-type]:translate-x-0.5 hover:[&_svg:last-of-type]:-translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "isolate bg-amber text-amber-ink ring-1 ring-inset ring-amber before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-bg before:transition-transform before:duration-500 before:ease-out-expo hover:text-amber hover:before:scale-x-100",
        outline: "text-fg ring-1 ring-inset ring-fg/60 hover:bg-fg hover:text-bg",
        ghost: "text-fg hover:text-amber px-0 min-h-10",
        dark: "bg-paper-ink text-paper hover:bg-black",
        danger: "bg-danger/10 text-danger ring-1 ring-inset ring-danger/60 hover:bg-danger hover:text-bg",
      },
      size: {
        md: "",
        sm: "min-h-10 px-4 text-[0.72rem]",
        lg: "min-h-14 px-8 text-[0.85rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant, size, asChild, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  );
});

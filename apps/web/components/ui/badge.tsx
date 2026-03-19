import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-stone-950/10 bg-stone-950 text-stone-50",
        outline: "border-stone-950/15 bg-white/80 text-stone-950",
        accent: "border-[#e76f51]/20 bg-[#e76f51]/15 text-[#7d2f20]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

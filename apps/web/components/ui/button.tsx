import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.15rem] text-sm font-semibold tracking-[-0.02em] shadow-ink transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ea7ff]/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#101726] text-white hover:bg-[#1a2234]",
        accent: "bg-[linear-gradient(135deg,#1ea7ff,#8758e2_55%,#d42eb5)] text-white hover:opacity-95",
        secondary: "border border-[#101726]/8 bg-white/88 text-[#111827] shadow-none backdrop-blur hover:bg-white",
        outline: "border border-[#101726]/10 bg-white/40 text-[#111827] shadow-none backdrop-blur hover:bg-white/70",
        ghost: "bg-transparent text-[#111827] shadow-none hover:bg-white/55"
      },
      size: {
        default: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        sm: "h-10 px-4 text-sm",
        icon: "size-11 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

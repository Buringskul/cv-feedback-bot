import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, ...props }, ref) => (
  <div className="relative w-full">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm",
        "border border-white/10 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full",
          "bg-gradient-to-r from-[#10B981] to-[#34D399]",
          "shadow-[0_0_12px_rgba(16,185,129,0.45)]",
          "transition-all duration-500 ease-out"
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>

    {/* WHITE PERCENTAGE TEXT */}
    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
      {value}%
    </span>
  </div>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

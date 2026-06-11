import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

const decorIconVariants = cva("pointer-events-none absolute z-10 shrink-0", {
  variants: {
    position: {
      "top-left": "top-0 left-0",
      "top-right": "top-0 right-0",
      "bottom-right": "right-0 bottom-0",
      "bottom-left": "bottom-0 left-0",
    },
    size: {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    },
    weight: {
      thin: "stroke-[0.75px]",
      normal: "stroke-[1px]",
      medium: "stroke-[1.5px]",
      thick: "stroke-[2px]",
    },
    color: {
      default: "stroke-muted-foreground/50",
      subtle: "stroke-muted-foreground/25",
      accent: "stroke-primary/50",
      destructive: "stroke-destructive/50",
    },
    offset: {
      none: "",
      sm: "-m-px",
      md: "-m-0.5",
      lg: "-m-1",
    },
  },
  defaultVariants: {
    position: "top-left",
    size: "sm",
    weight: "normal",
    color: "default",
    offset: "none",
  },
})

type DecorIconProps = Omit<React.ComponentProps<"svg">, "color"> &
  VariantProps<typeof decorIconVariants>

const pathMap: Record<
  NonNullable<VariantProps<typeof decorIconVariants>["position"]>,
  string
> = {
  "top-left": "M12 1H1V12",
  "top-right": "M0 1H11V12",
  "bottom-right": "M0 11H11V0",
  "bottom-left": "M12 11H1V0",
}

export function DecorIcon({
  position = "top-left",
  size,
  weight,
  color,
  offset,
  className,
  ...props
}: DecorIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        decorIconVariants({ position, size, weight, color, offset }),
        className
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={pathMap[position ?? "top-left"]} />
    </svg>
  )
}

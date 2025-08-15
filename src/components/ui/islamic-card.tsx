import * as React from "react"
import { cn } from "@/lib/utils"

const IslamicCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "prayer" | "blessed" | "sacred"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-card shadow-sacred",
    prayer: "bg-card shadow-blessed animate-prayer-pulse gradient-peaceful",
    blessed: "bg-card shadow-divine gradient-primary text-primary-foreground",
    sacred: "bg-card shadow-golden animate-blessing-glow pattern-geometric"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
IslamicCard.displayName = "IslamicCard"

const IslamicCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
IslamicCardHeader.displayName = "IslamicCardHeader"

const IslamicCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
IslamicCardTitle.displayName = "IslamicCardTitle"

const IslamicCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
IslamicCardDescription.displayName = "IslamicCardDescription"

const IslamicCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
IslamicCardContent.displayName = "IslamicCardContent"

const IslamicCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
IslamicCardFooter.displayName = "IslamicCardFooter"

export {
  IslamicCard,
  IslamicCardHeader,
  IslamicCardTitle,
  IslamicCardDescription,
  IslamicCardContent,
  IslamicCardFooter,
}
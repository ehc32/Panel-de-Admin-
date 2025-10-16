import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fieldgroup"
      className={cn("space-y-4", className)}
      {...props}
    />
  )
}

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("space-y-2", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="fieldlabel"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="fielddescription"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { children: React.ReactNode }) {
  return (
    <div
      data-slot="fieldseparator"
      className={cn("relative flex items-center", className)}
      {...props}
    >
      <Separator className="flex-1" />
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {children}
        </span>
      </div>
      <Separator className="flex-1" />
    </div>
  )
}

export { FieldGroup, Field, FieldLabel, FieldDescription, FieldSeparator }
"use client"

import type { ReactNode } from "react"

// ---------------------------------------------------------------------------
// Toggle switch (Published/Hidden, Visible/Hidden, Solo/Group)
// ---------------------------------------------------------------------------
export function Toggle({
  checked,
  onChange,
  onLabel = "On",
  offLabel = "Off",
  disabled,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  onLabel?: string
  offLabel?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-neutral-900" : "bg-neutral-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </span>
      <span
        className={[
          "text-sm font-medium",
          checked ? "text-neutral-900" : "text-neutral-500",
        ].join(" ")}
      >
        {checked ? onLabel : offLabel}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Segmented control (e.g. Solo / Group)
// ---------------------------------------------------------------------------
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (next: T) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-300 bg-neutral-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-800",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Labeled field wrapper
// ---------------------------------------------------------------------------
export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      {children}
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </label>
  )
}

const inputClasses =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[inputClasses, props.className ?? ""].join(" ")} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[inputClasses, "min-h-28 resize-y leading-relaxed", props.className ?? ""].join(" ")}
    />
  )
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger"
}

export function Btn({ variant = "secondary", className = "", ...props }: BtnProps) {
  const styles: Record<string, string> = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-700 disabled:bg-neutral-400",
    secondary:
      "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 disabled:opacity-50",
    danger:
      "border border-red-300 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50",
  }
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
        styles[variant],
        className,
      ].join(" ")}
    />
  )
}

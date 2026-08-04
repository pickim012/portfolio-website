"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveContacts } from "@/app/admin/(dashboard)/actions"
import type { ContactField } from "@/lib/content-types"
import { Btn, TextArea, TextInput, Toggle } from "./ui"

export function ContactsEditor({ initial }: { initial: ContactField[] }) {
  const router = useRouter()
  const [fields, setFields] = useState<ContactField[]>(initial)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function update(id: string, patch: Partial<ContactField>) {
    setSaved(false)
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await saveContacts(fields)
      router.refresh()
      setSaved(true)
    })
  }

  const fixed = fields.filter((f) => f.kind === "fixed")
  const custom = fields.filter((f) => f.kind === "custom")

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      {fixed.map((field) => (
        <div key={field.id} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900">{field.label}</span>
            <Toggle
              checked={field.visible}
              onChange={(v) => update(field.id, { visible: v })}
              onLabel="Visible"
              offLabel="Hidden"
            />
          </div>
          <TextInput
            className="mt-3"
            value={field.value}
            onChange={(e) => update(field.id, { value: e.target.value })}
            placeholder={field.id === "email" ? "studio@example.com" : "@handle"}
          />
        </div>
      ))}

      <div className="pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Custom Sections
        </h2>
      </div>

      {custom.map((field, i) => (
        <div key={field.id} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <TextInput
              value={field.label}
              onChange={(e) => update(field.id, { label: e.target.value })}
              placeholder={`Custom Section ${i + 1} title (e.g. Studio)`}
              className="max-w-xs"
            />
            <Toggle
              checked={field.visible}
              onChange={(v) => update(field.id, { visible: v })}
              onLabel="Visible"
              offLabel="Hidden"
            />
          </div>
          <TextArea
            className="mt-3"
            rows={3}
            value={field.value}
            onChange={(e) => update(field.id, { value: e.target.value })}
            placeholder="Section content. Line breaks are preserved."
          />
        </div>
      ))}

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <Btn variant="primary" onClick={handleSave} disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Btn>
        {saved && <span className="text-sm text-green-600">Saved and published.</span>}
      </div>
    </div>
  )
}

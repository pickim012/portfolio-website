"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveCv } from "@/app/admin/(dashboard)/actions"
import type { CvSection } from "@/lib/content-types"
import { Btn, TextArea, TextInput, Toggle } from "./ui"

export function CvEditor({ initial }: { initial: CvSection[] }) {
  const router = useRouter()
  const [sections, setSections] = useState<CvSection[]>(initial)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function update(id: string, patch: Partial<CvSection>) {
    setSaved(false)
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await saveCv(sections)
      router.refresh()
      setSaved(true)
    })
  }

  const fixed = sections.filter((s) => s.kind === "fixed")
  const custom = sections.filter((s) => s.kind === "custom")

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      {fixed.map((section) => (
        <div key={section.id} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900">{section.label}</span>
            <Toggle
              checked={section.visible}
              onChange={(v) => update(section.id, { visible: v })}
              onLabel="Visible"
              offLabel="Hidden"
            />
          </div>
          <TextArea
            className="mt-3"
            rows={4}
            value={section.content}
            onChange={(e) => update(section.id, { content: e.target.value })}
            placeholder="One entry per line. Line breaks are preserved."
          />
        </div>
      ))}

      <div className="pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Custom Sections
        </h2>
      </div>

      {custom.map((section, i) => (
        <div key={section.id} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <TextInput
              value={section.label}
              onChange={(e) => update(section.id, { label: e.target.value })}
              placeholder={`Custom Section ${i + 1} title (e.g. Residencies)`}
              className="max-w-xs"
            />
            <Toggle
              checked={section.visible}
              onChange={(v) => update(section.id, { visible: v })}
              onLabel="Visible"
              offLabel="Hidden"
            />
          </div>
          <TextArea
            className="mt-3"
            rows={4}
            value={section.content}
            onChange={(e) => update(section.id, { content: e.target.value })}
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

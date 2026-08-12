"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { saveCv } from "@/app/admin/(dashboard)/actions"
import type { CvLink, CvSection } from "@/lib/content-types"
import { Btn, TextArea, TextInput, Toggle } from "./ui"

type CvInitial = { intro: string; sections: CvSection[]; links: CvLink[] }

function makeLinkId() {
  return `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function CvEditor({ initial }: { initial: CvInitial }) {
  const router = useRouter()
  const [intro, setIntro] = useState(initial.intro)
  const [sections, setSections] = useState<CvSection[]>(initial.sections)
  const [links, setLinks] = useState<CvLink[]>(initial.links)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function update(id: string, patch: Partial<CvSection>) {
    setSaved(false)
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function updateLink(id: string, patch: Partial<CvLink>) {
    setSaved(false)
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function addLink() {
    setSaved(false)
    setLinks((prev) => [...prev, { id: makeLinkId(), title: "", url: "" }])
  }

  function removeLink(id: string) {
    setSaved(false)
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  function moveLink(index: number, dir: -1 | 1) {
    setSaved(false)
    setLinks((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function handleSave() {
    setSaved(false)
    startTransition(async () => {
      await saveCv(intro, sections, links)
      router.refresh()
      setSaved(true)
    })
  }

  const fixed = sections.filter((s) => s.kind === "fixed")
  const custom = sections.filter((s) => s.kind === "custom")

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <span className="text-sm font-semibold text-neutral-900">Short Bio</span>
        <TextArea
          className="mt-3"
          rows={4}
          value={intro}
          onChange={(e) => {
            setIntro(e.target.value)
            setSaved(false)
          }}
          placeholder="A brief introduction to the artist."
        />
      </div>

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

      <div className="pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Links</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Shown as clickable links at the bottom of the CV. Entries without a title or URL are skipped.
        </p>
      </div>

      {links.length > 0 && (
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <div
              key={link.id}
              className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex flex-1 flex-col gap-2">
                <TextInput
                  value={link.title}
                  onChange={(e) => updateLink(link.id, { title: e.target.value })}
                  placeholder="Link title (e.g. Download full CV)"
                />
                <TextInput
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  placeholder="https://example.com/cv.pdf"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  aria-label="Move link up"
                  onClick={() => moveLink(i, -1)}
                  disabled={i === 0}
                  className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Move link down"
                  onClick={() => moveLink(i, 1)}
                  disabled={i === links.length - 1}
                  className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Remove link"
                  onClick={() => removeLink(link.id)}
                  className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <Btn variant="secondary" onClick={addLink} className="gap-2">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Link
        </Btn>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <Btn variant="primary" onClick={handleSave} disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Btn>
        {saved && <span className="text-sm text-green-600">Saved and published.</span>}
      </div>
    </div>
  )
}

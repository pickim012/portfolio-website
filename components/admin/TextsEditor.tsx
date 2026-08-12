"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { saveTexts } from "@/app/admin/(dashboard)/actions"
import type { CvLink } from "@/lib/content-types"
import { Btn, TextInput } from "./ui"

function makeLinkId() {
  return `text-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function TextsEditor({ initial }: { initial: CvLink[] }) {
  const router = useRouter()
  const [links, setLinks] = useState(initial)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function updateLink(id: string, patch: Partial<CvLink>) {
    setSaved(false)
    setLinks((current) => current.map((link) => (link.id === id ? { ...link, ...patch } : link)))
  }

  function moveLink(index: number, direction: -1 | 1) {
    setSaved(false)
    setLinks((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function addLink() {
    setSaved(false)
    setLinks((current) => [...current, { id: makeLinkId(), title: "", url: "" }])
  }

  function save() {
    startTransition(async () => {
      await saveTexts(links)
      router.refresh()
      setSaved(true)
    })
  }

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      <p className="text-sm leading-relaxed text-neutral-500">
        Add one link per line. Only the title is shown publicly, and links appear in the order below.
      </p>
      {links.map((link, index) => (
        <div key={link.id} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-1 flex-col gap-2">
            <TextInput value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} placeholder="Text title" />
            <TextInput value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} placeholder="https://example.com/text" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <button type="button" aria-label="Move link up" onClick={() => moveLink(index, -1)} disabled={index === 0} className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">
              <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Move link down" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1} className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Remove link" onClick={() => { setSaved(false); setLinks((current) => current.filter((item) => item.id !== link.id)) }} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50">
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ))}
      <div>
        <Btn variant="secondary" onClick={addLink} className="gap-2">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Link
        </Btn>
      </div>
      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <Btn variant="primary" onClick={save} disabled={pending}>{pending ? "Saving..." : "Save"}</Btn>
        {saved && <span className="text-sm text-green-600">Saved and published.</span>}
      </div>
    </div>
  )
}

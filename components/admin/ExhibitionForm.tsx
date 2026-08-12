"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import {
  createExhibition,
  deleteExhibition,
  updateExhibition,
} from "@/app/admin/(dashboard)/actions"
import type { AdminExhibition, CvLink } from "@/lib/content-types"
import { Btn, Field, Segmented, TextArea, TextInput, Toggle } from "./ui"
import { ImageUrlList, makeImageItems, type ImageItem } from "./ImageUrlList"

export function ExhibitionForm({
  item,
  onDone,
}: {
  // Undefined = create (Upload) mode; provided = edit mode.
  item?: AdminExhibition
  onDone: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(item)

  const [kind, setKind] = useState<"solo" | "group">(item?.kind ?? "solo")
  const [title, setTitle] = useState(item?.title ?? "")
  const [date, setDate] = useState(item?.date ?? "")
  const [gallery, setGallery] = useState(item?.gallery ?? "")
  const [address, setAddress] = useState(item?.address ?? "")
  const [images, setImages] = useState<ImageItem[]>(makeImageItems(item?.images ?? []))
  const [about, setAbout] = useState(item?.about ?? "")
  const [links, setLinks] = useState<CvLink[]>(item?.links ?? [])
  const [published, setPublished] = useState(item?.published ?? true)
  const [pending, startTransition] = useTransition()

  function buildInput() {
    return {
      kind,
      title: title.trim(),
      date: date.trim(),
      gallery: gallery.trim(),
      address: address.trim(),
      images: images.map((i) => i.url.trim()).filter(Boolean),
      // Preserve line breaks and spacing exactly as typed (no trim).
      about,
      links,
      published,
    }
  }

  function handleSubmit() {
    startTransition(async () => {
      if (isEdit && item) {
        await updateExhibition(item.id, buildInput())
      } else {
        await createExhibition(buildInput())
      }
      router.refresh()
      onDone()
    })
  }

  function updateLink(id: string, patch: Partial<CvLink>) {
    setLinks((current) => current.map((link) => (link.id === id ? { ...link, ...patch } : link)))
  }

  function moveLink(index: number, direction: -1 | 1) {
    setLinks((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this exhibition? This action cannot be undone.",
      )
    ) {
      return
    }
    startTransition(async () => {
      if (item) await deleteExhibition(item.id)
      router.refresh()
      onDone()
    })
  }

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-6">
      <Field label="Category">
        <div>
          <Segmented
            value={kind}
            onChange={setKind}
            options={[
              { value: "solo", label: "Solo" },
              { value: "group", label: "Group" },
            ]}
          />
        </div>
      </Field>

      <Field label="Title">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiet Fields" />
      </Field>

      <Field label="Date">
        <TextInput
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="4 March – 12 April 2026"
        />
      </Field>

      <Field label="Gallery">
        <TextInput value={gallery} onChange={(e) => setGallery(e.target.value)} placeholder="Baik Art" />
      </Field>

      <Field label="Address">
        <TextInput
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="58 Samcheong-ro, Jongno-gu, Seoul"
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-800">Image Links</span>
        <ImageUrlList items={images} onItemsChange={setImages} />
      </div>

      <Field label="About" hint="Optional. Shown below the images. Line breaks are preserved.">
        <TextArea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="A short description of the exhibition…"
          rows={5}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-800">Links</span>
        <span className="text-xs text-neutral-500">Shown at the bottom of the exhibition entry.</span>
        {links.map((link, i) => (
          <div key={link.id} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex flex-1 flex-col gap-2">
              <TextInput
                value={link.title}
                onChange={(e) => updateLink(link.id, { title: e.target.value })}
                placeholder="Link title"
              />
              <TextInput
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <button type="button" aria-label="Move link up" onClick={() => moveLink(i, -1)} disabled={i === 0} className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">
                <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="button" aria-label="Move link down" onClick={() => moveLink(i, 1)} disabled={i === links.length - 1} className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30">
                <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="button" aria-label="Remove link" onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
        <div>
          <Btn variant="secondary" onClick={() => setLinks((current) => [...current, { id: crypto.randomUUID(), title: "", url: "" }])} className="gap-2">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Link
          </Btn>
        </div>
      </div>

      <Field label="Status">
        <div>
          <Toggle
            checked={published}
            onChange={setPublished}
            onLabel="Published"
            offLabel="Hidden"
          />
        </div>
      </Field>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        {isEdit ? (
          <>
            <Btn variant="primary" onClick={handleSubmit} disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Btn>
            <Btn variant="danger" onClick={handleDelete} disabled={pending}>
              Delete
            </Btn>
          </>
        ) : (
          <Btn variant="primary" onClick={handleSubmit} disabled={pending}>
            {pending ? "Publishing..." : "Publish"}
          </Btn>
        )}
        <Btn variant="secondary" onClick={onDone} disabled={pending}>
          Cancel
        </Btn>
      </div>
    </div>
  )
}

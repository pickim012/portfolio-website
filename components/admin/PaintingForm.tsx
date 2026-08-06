"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  createPainting,
  deletePainting,
  updatePainting,
} from "@/app/admin/(dashboard)/actions"
import type { AdminPainting } from "@/lib/content-types"
import { Btn, Field, TextInput } from "./ui"
import { ImageUrlList, makeImageItems, type ImageItem } from "./ImageUrlList"

const CURRENT_YEAR = new Date().getFullYear()

export function PaintingForm({
  item,
  onDone,
}: {
  item?: AdminPainting
  onDone: () => void
}) {
  const router = useRouter()
  const isEdit = Boolean(item)

  const [year, setYear] = useState<string>(String(item?.year ?? CURRENT_YEAR))
  const [title, setTitle] = useState(item?.title ?? "")
  const [details, setDetails] = useState(item?.details ?? "")
  const [images, setImages] = useState<ImageItem[]>(makeImageItems(item?.images ?? []))
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function buildInput() {
    return {
      year: Number(year),
      // Date field removed from the Paintings form; keep the input shape intact.
      date: "",
      title: title.trim(),
      details: details.trim(),
      images: images.map((i) => i.url.trim()).filter(Boolean),
    }
  }

  function handleSubmit() {
    const y = Number(year)
    if (!Number.isInteger(y) || y < 1900 || y > 2200) {
      setError("Please enter a valid year (e.g. 2026).")
      return
    }
    setError(null)
    startTransition(async () => {
      if (isEdit && item) {
        await updatePainting(item.id, buildInput())
      } else {
        await createPainting(buildInput())
      }
      router.refresh()
      onDone()
    })
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this painting? This action cannot be undone.",
      )
    ) {
      return
    }
    startTransition(async () => {
      if (item) await deletePainting(item.id)
      router.refresh()
      onDone()
    })
  }

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-6">
      <Field label="Year" hint="Used to group paintings by year on the front-end.">
        <TextInput
          type="number"
          inputMode="numeric"
          min={1900}
          max={2200}
          step={1}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="max-w-40"
        />
      </Field>

      <Field label="Title">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sage Interval" />
      </Field>

      <Field label="Details">
        <TextInput
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Oil on canvas, 162 × 130 cm, 2026"
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-800">Image Links</span>
        <ImageUrlList items={images} onItemsChange={setImages} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

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

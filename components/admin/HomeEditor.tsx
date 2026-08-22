"use client"

import { useState, useTransition } from "react"
import { saveHome } from "@/app/admin/(dashboard)/actions"
import { Btn, Field, TextArea, TextInput } from "./ui"

export function HomeEditor({
  initial,
}: {
  initial: { imageUrl: string; body: string }
}) {
  const [imageUrl, setImageUrl] = useState(initial.imageUrl)
  const [body, setBody] = useState(initial.body)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit() {
    setSaved(false)
    startTransition(async () => {
      await saveHome({ imageUrl, body })
      setSaved(true)
    })
  }

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      <Field label="Image" hint="Paste an image URL. A preview appears below once it loads.">
        <TextInput
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value)
            setSaved(false)
          }}
          placeholder="/home/featured.png or https://..."
        />
      </Field>

      <div className="flex h-56 w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Homepage preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.opacity = "0.15"
            }}
          />
        ) : (
          <span className="text-sm text-neutral-400">No image</span>
        )}
      </div>

      <Field label="Text" hint="Line breaks are preserved exactly as typed.">
        <TextArea
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            setSaved(false)
          }}
          rows={6}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Btn variant="primary" onClick={handleSubmit} disabled={pending}>
          {pending ? "Uploading..." : "Upload"}
        </Btn>
        {saved && <span className="text-sm text-green-600">Saved and published.</span>}
      </div>
    </div>
  )
}

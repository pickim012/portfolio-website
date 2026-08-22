"use client"

import { useState, useTransition } from "react"
import { saveHome } from "@/app/admin/(dashboard)/actions"
import { Btn, Field, TextInput } from "./ui"

type Pair = { imageSrc: string; caption: string }

export function HomeEditor({ initial }: { initial: { imageUrl: string; body: string } }) {
  const initialPairs: Pair[] = (() => {
    try {
      const parsed = JSON.parse(initial.imageUrl)
      return Array.isArray(parsed) ? parsed.slice(0, 5).map((p) => ({ imageSrc: p.imageSrc ?? "", caption: p.caption ?? "" })) : [{ imageSrc: initial.imageUrl, caption: "" }]
    } catch { return [{ imageSrc: initial.imageUrl, caption: "" }] }
  })()
  const [pairs, setPairs] = useState<Pair[]>([...initialPairs, ...Array.from({ length: 5 - initialPairs.length }, () => ({ imageSrc: "", caption: "" }))].slice(0, 5))
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function update(index: number, key: keyof Pair, value: string) {
    setPairs((current) => current.map((pair, i) => i === index ? { ...pair, [key]: value } : pair))
    setSaved(false)
  }

  function handleSubmit() {
    setSaved(false)
    startTransition(async () => {
      await saveHome({ imageUrl: pairs[0].imageSrc, imagePairs: pairs.filter((pair) => pair.imageSrc.trim()) })
      setSaved(true)
    })
  }

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-6">
      {pairs.map((pair, index) => (
        <div key={index} className="flex flex-col gap-3 border-t border-neutral-200 pt-5">
          <Field label={`Image ${index + 1}`} hint="Paste an image URL.">
            <TextInput value={pair.imageSrc} onChange={(e) => update(index, "imageSrc", e.target.value)} placeholder="/home/image.png or https://..." />
          </Field>
          <div className="flex h-40 w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
            {pair.imageSrc ? <img src={pair.imageSrc} alt={`Homepage image ${index + 1} preview`} className="h-full w-full object-cover" /> : <span className="text-sm text-neutral-400">No image</span>}
          </div>
          <Field label="Caption" hint="Optional caption shown with this image.">
            <TextInput value={pair.caption} onChange={(e) => update(index, "caption", e.target.value)} placeholder="Caption" />
          </Field>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Btn variant="primary" onClick={handleSubmit} disabled={pending}>{pending ? "Uploading..." : "Upload"}</Btn>
        {saved && <span className="text-sm text-green-600">Saved and published.</span>}
      </div>
    </div>
  )
}

"use client"

import { useId } from "react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { Btn } from "./ui"

// Each image URL is tracked with a stable key so drag/reorder is smooth even
// while the URL text is still being typed.
export type ImageItem = { key: string; url: string }

export function makeImageItems(urls: string[]): ImageItem[] {
  return urls.map((url, i) => ({ key: `img-${i}-${Math.random().toString(36).slice(2)}`, url }))
}

function SortableRow({
  item,
  onChange,
  onRemove,
}: {
  item: ImageItem
  onChange: (url: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.key })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        "flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3",
        isDragging ? "z-10 shadow-lg" : "",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="mt-1 cursor-grab touch-none text-neutral-400 hover:text-neutral-700 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>

      {/* Thumbnail preview appears as soon as a URL is entered */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
        {item.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url || "/placeholder.svg"}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.opacity = "0.15"
            }}
            onLoad={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          />
        ) : (
          <span className="text-[10px] text-neutral-400">No image</span>
        )}
      </div>

      <input
        value={item.url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or /images/artwork.png"
        className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />

      <button
        type="button"
        aria-label="Remove image"
        onClick={onRemove}
        className="mt-1 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export function ImageUrlList({
  items,
  onItemsChange,
}: {
  items: ImageItem[]
  onItemsChange: (next: ImageItem[]) => void
}) {
  const dndId = useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.key === active.id)
    const newIndex = items.findIndex((i) => i.key === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onItemsChange(arrayMove(items, oldIndex, newIndex))
  }

  function updateUrl(key: string, url: string) {
    onItemsChange(items.map((i) => (i.key === key ? { ...i, url } : i)))
  }

  function remove(key: string) {
    onItemsChange(items.filter((i) => i.key !== key))
  }

  function add() {
    onItemsChange([
      ...items,
      { key: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`, url: "" },
    ])
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <SortableRow
                key={item.key}
                item={item}
                onChange={(url) => updateUrl(item.key, url)}
                onRemove={() => remove(item.key)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-300 px-3 py-4 text-center text-sm text-neutral-400">
          No images yet.
        </p>
      )}

      <div>
        <Btn type="button" variant="secondary" onClick={add}>
          + Add another image
        </Btn>
      </div>
    </div>
  )
}

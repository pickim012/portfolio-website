"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { GripVertical } from "lucide-react"
import { reorderPaintings } from "@/app/admin/(dashboard)/actions"
import type { AdminPainting } from "@/lib/content-types"
import { PageHeader } from "./PageHeader"
import { Btn } from "./ui"
import { PaintingForm } from "./PaintingForm"

type View = "menu" | "upload" | "edit"

export function PaintingsManager({ paintings }: { paintings: AdminPainting[] }) {
  const [view, setView] = useState<View>("menu")
  const [editing, setEditing] = useState<AdminPainting | null>(null)

  const years = Array.from(new Set(paintings.map((p) => p.year))).sort((a, b) => b - a)

  if (view === "upload") {
    return (
      <div>
        <PageHeader title="Upload Painting" description="Add and publish a new painting." />
        <PaintingForm onDone={() => setView("menu")} />
      </div>
    )
  }

  if (view === "edit" && editing) {
    return (
      <div>
        <PageHeader title="Edit Painting" description="Update this painting, or delete it." />
        <PaintingForm
          item={editing}
          onDone={() => {
            setEditing(null)
            setView("edit")
          }}
        />
      </div>
    )
  }

  if (view === "edit") {
    return (
      <div>
        <PageHeader title="Edit Paintings" description="Reorder or edit existing paintings by year." />
        <div className="mt-4">
          <Btn variant="secondary" onClick={() => setView("menu")}>
            ← Back
          </Btn>
        </div>
        <div className="mt-6 flex flex-col gap-10">
          {years.length === 0 && (
            <p className="rounded-lg border border-dashed border-neutral-300 px-3 py-6 text-center text-sm text-neutral-400">
              No paintings yet.
            </p>
          )}
          {years.map((year) => (
            <YearList
              key={year}
              year={year}
              items={paintings.filter((p) => p.year === year)}
              onEdit={(item) => {
                setEditing(item)
                setView("edit")
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Paintings" description="Add a new painting or edit existing ones." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <MenuCard
          title="Upload"
          description="Create and publish a new painting."
          onClick={() => setView("upload")}
        />
        <MenuCard
          title="Edit"
          description="Update, reorder, or remove existing paintings."
          onClick={() => setView("edit")}
        />
      </div>
    </div>
  )
}

function MenuCard({
  title,
  description,
  onClick,
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start rounded-xl border border-neutral-200 bg-white p-6 text-left transition-colors hover:border-neutral-400"
    >
      <span className="text-base font-semibold text-neutral-900">{title}</span>
      <span className="mt-1 text-sm text-neutral-500">{description}</span>
    </button>
  )
}

function YearList({
  year,
  items,
  onEdit,
}: {
  year: number
  items: AdminPainting[]
  onEdit: (item: AdminPainting) => void
}) {
  const router = useRouter()
  const [order, setOrder] = useState(items)
  const [dirty, setDirty] = useState(false)
  const [pending, startTransition] = useTransition()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    setOrder(items)
    setDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => `${i.id}:${i.title}:${i.date}`).join("|")])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = order.findIndex((i) => i.id === active.id)
    const newIndex = order.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    setOrder(arrayMove(order, oldIndex, newIndex))
    setDirty(true)
  }

  function saveOrder() {
    startTransition(async () => {
      await reorderPaintings(year, order.map((i) => i.id))
      router.refresh()
      setDirty(false)
    })
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{year}</h2>
        {dirty && (
          <Btn variant="primary" onClick={saveOrder} disabled={pending}>
            {pending ? "Saving..." : "Save Order"}
          </Btn>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-3 flex flex-col gap-2">
            {order.map((item) => (
              <Row key={item.id} item={item} onEdit={onEdit} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  )
}

function Row({
  item,
  onEdit,
}: {
  item: AdminPainting
  onEdit: (item: AdminPainting) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onDoubleClick={() => onEdit(item)}
      title="Double-click to edit"
      className={[
        "flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-3",
        isDragging ? "z-10 shadow-lg" : "",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-neutral-400 hover:text-neutral-700 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
        {item.title || "(untitled)"}
      </span>
    </li>
  )
}

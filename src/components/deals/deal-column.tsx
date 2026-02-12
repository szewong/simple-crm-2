"use client"

import { Droppable } from "@hello-pangea/dnd"
import { DealCard } from "./deal-card"
import { formatCurrency } from "@/lib/utils"

interface DealColumnProps {
  stage: {
    id: string
    name: string
    color: string | null
  }
  deals: {
    id: string
    title: string
    value: number | null
    expected_close_date: string | null
    company?: { id: string; name: string } | null
  }[]
}

export function DealColumn({ stage, deals }: DealColumnProps) {
  const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div
        className="rounded-t-lg border-t-[3px] bg-muted/50 px-3 py-2"
        style={{ borderTopColor: stage.color || "hsl(var(--primary))" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{stage.name}</h3>
          <span className="text-xs text-muted-foreground">{deals.length}</span>
        </div>
        <p className="text-xs text-muted-foreground">{formatCurrency(totalValue)}</p>
      </div>

      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[200px] flex-1 flex-col gap-2 rounded-b-lg border border-t-0 p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-primary/5" : "bg-background"
            }`}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

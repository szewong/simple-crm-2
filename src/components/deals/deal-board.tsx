"use client"

import { useState } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { toast } from "sonner"
import { DealColumn } from "./deal-column"
import { moveDeal } from "@/lib/actions/deals"

interface StageWithDeals {
  id: string
  name: string
  color: string | null
  display_order: number
  is_won: boolean
  is_lost: boolean
  deals: {
    id: string
    title: string
    value: number | null
    stage_id: string
    position: number
    expected_close_date: string | null
    company?: { id: string; name: string } | null
  }[]
}

interface DealBoardProps {
  stages: StageWithDeals[]
}

export function DealBoard({ stages: initialStages }: DealBoardProps) {
  const [stages, setStages] = useState(initialStages)

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return

    // Optimistic update
    const prevStages = stages
    const newStages = stages.map((stage) => ({
      ...stage,
      deals: [...stage.deals],
    }))

    const sourceStage = newStages.find((s) => s.id === source.droppableId)
    const destStage = newStages.find((s) => s.id === destination.droppableId)

    if (!sourceStage || !destStage) return

    const [movedDeal] = sourceStage.deals.splice(source.index, 1)
    movedDeal.stage_id = destination.droppableId
    destStage.deals.splice(destination.index, 0, movedDeal)

    // Update positions
    destStage.deals.forEach((deal, i) => {
      deal.position = i
    })

    setStages(newStages)

    try {
      await moveDeal({
        deal_id: draggableId,
        stage_id: destination.droppableId,
        position: destination.index,
      })
    } catch {
      setStages(prevStages)
      toast.error("Failed to move deal")
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <DealColumn
            key={stage.id}
            stage={stage}
            deals={stage.deals}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

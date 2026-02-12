"use client"

import Link from "next/link"
import { Draggable } from "@hello-pangea/dnd"
import { Calendar, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

interface DealCardProps {
  deal: {
    id: string
    title: string
    value: number | null
    expected_close_date: string | null
    company?: { id: string; name: string } | null
  }
  index: number
}

export function DealCard({ deal, index }: DealCardProps) {
  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link href={`/deals/${deal.id}`}>
            <Card
              className={`cursor-pointer py-3 transition-shadow hover:shadow-md ${
                snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
              }`}
            >
              <CardContent className="space-y-2 px-3">
                <p className="truncate text-sm font-medium">{deal.title}</p>
                {deal.value != null && (
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(deal.value)}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {deal.company && (
                    <span className="flex items-center gap-1 truncate">
                      <User className="size-3" />
                      {deal.company.name}
                    </span>
                  )}
                  {deal.expected_close_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatDate(deal.expected_close_date)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </Draggable>
  )
}

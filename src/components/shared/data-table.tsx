"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  header: string
  accessor: keyof T | string
  sortable?: boolean
  className?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

type SortDirection = "asc" | "desc" | null

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  function handleSort(accessor: string) {
    if (sortKey === accessor) {
      if (sortDir === "asc") setSortDir("desc")
      else if (sortDir === "desc") {
        setSortKey(null)
        setSortDir(null)
      }
    } else {
      setSortKey(accessor)
      setSortDir("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const aVal = getNestedValue(a, sortKey)
    const bVal = getNestedValue(b, sortKey)
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1
    return 0
  })

  function SortIcon({ accessor }: { accessor: string }) {
    if (sortKey !== accessor) return <ArrowUpDown className="ml-1 size-3.5 text-foreground-subtle" />
    if (sortDir === "asc") return <ArrowUp className="ml-1 size-3.5" />
    return <ArrowDown className="ml-1 size-3.5" />
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.accessor)}
                className={cn(
                  col.sortable && "cursor-pointer select-none",
                  col.className
                )}
                onClick={
                  col.sortable
                    ? () => handleSort(String(col.accessor))
                    : undefined
                }
              >
                <span className="flex items-center">
                  {col.header}
                  {col.sortable && (
                    <SortIcon accessor={String(col.accessor)} />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, i) => (
            <TableRow
              key={i}
              className={cn(onRowClick && "cursor-pointer")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => {
                const value = getNestedValue(row, String(col.accessor))
                return (
                  <TableCell key={String(col.accessor)} className={col.className}>
                    {col.render ? col.render(value, row) : String(value ?? "")}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

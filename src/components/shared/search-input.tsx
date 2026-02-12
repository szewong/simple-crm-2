"use client"

import { useRef } from "react"
import { Search, X } from "lucide-react"
import { useQueryState, parseAsString } from "nuqs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps {
  placeholder?: string
  paramName?: string
}

export function SearchInput({
  placeholder = "Search...",
  paramName = "q",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useQueryState(
    paramName,
    parseAsString.withDefault("").withOptions({ shallow: false, throttleMs: 300 })
  )

  // useDebounce is not needed here since nuqs handles throttling,
  // but we keep the import available for other consumers
  useDebounce(search, 300)

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value || null)}
        className="pl-8 pr-8"
      />
      {search && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0.5 top-1/2 size-7 -translate-y-1/2"
          onClick={() => {
            setSearch(null)
            inputRef.current?.focus()
          }}
        >
          <X className="size-3.5" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createNote, deleteNote } from "@/lib/actions/notes"
import { formatRelativeDate } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import type { Note } from "@/types"

interface NoteSectionProps {
  notes: Note[]
  contactId?: string
  companyId?: string
  dealId?: string
}

export function NoteSection({ notes, contactId, companyId, dealId }: NoteSectionProps) {
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleAddNote() {
    if (!content.trim()) return
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("content", content)
      if (contactId) formData.append("contact_id", contactId)
      if (companyId) formData.append("company_id", companyId)
      if (dealId) formData.append("deal_id", dealId)
      await createNote(formData)
      setContent("")
      toast.success("Note added")
    } catch {
      toast.error("Failed to add note")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      await deleteNote(id)
      toast.success("Note deleted")
    } catch {
      toast.error("Failed to delete note")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button onClick={handleAddNote} disabled={saving || !content.trim()} size="sm">
          {saving ? "Saving..." : "Add Note"}
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No notes yet.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="py-3">
              <CardContent className="flex items-start justify-between gap-2 px-4">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeDate(note.created_at)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="size-3.5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

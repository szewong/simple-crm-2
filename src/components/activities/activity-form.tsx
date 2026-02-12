"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { activitySchema, type ActivityFormValues } from "@/lib/validations/activity"
import { createActivity } from "@/lib/actions/activities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface ActivityFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts?: { id: string; first_name: string; last_name: string }[]
  deals?: { id: string; title: string }[]
}

export function ActivityForm({ open, onOpenChange, contacts = [], deals = [] }: ActivityFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: "task",
      title: "",
      description: "",
      due_date: "",
      contact_id: "",
      deal_id: "",
    },
  })

  async function onSubmit(values: ActivityFormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== "") formData.append(key, String(val))
      })
      await createActivity(formData)
      toast.success("Activity created")
      reset()
      onOpenChange(false)
    } catch {
      toast.error("Failed to create activity")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Log Activity</SheetTitle>
          <SheetDescription>
            Record a new activity in your CRM.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={watch("type")}
              onValueChange={(val) =>
                setValue("type", val as ActivityFormValues["type"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-title">Title *</Label>
            <Input id="activity-title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-description">Description</Label>
            <Textarea id="activity-description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-due-date">Due Date</Label>
            <Input
              id="activity-due-date"
              type="datetime-local"
              {...register("due_date")}
            />
          </div>

          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label>Contact</Label>
              <Select
                value={watch("contact_id") || ""}
                onValueChange={(val) =>
                  setValue("contact_id", val === "_none" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {deals.length > 0 && (
            <div className="space-y-2">
              <Label>Deal</Label>
              <Select
                value={watch("deal_id") || ""}
                onValueChange={(val) =>
                  setValue("deal_id", val === "_none" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {deals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Log Activity"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

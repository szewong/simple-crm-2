"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { dealSchema, type DealFormValues } from "@/lib/validations/deal"
import { createDeal, updateDeal } from "@/lib/actions/deals"
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

interface DealFormProps {
  defaultValues?: Partial<DealFormValues>
  dealId?: string
  stages: { id: string; name: string }[]
  companies: { id: string; name: string }[]
}

export function DealForm({ defaultValues, dealId, stages, companies }: DealFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!dealId

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema) as any,
    defaultValues: {
      title: "",
      value: undefined,
      currency: "USD",
      stage_id: stages[0]?.id ?? "",
      company_id: "",
      expected_close_date: "",
      probability: undefined,
      description: "",
      ...defaultValues,
    },
  })

  async function onSubmit(values: DealFormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val))
      })

      if (isEdit) {
        await updateDeal(dealId, formData)
        toast.success("Deal updated")
        router.push(`/deals/${dealId}`)
      } else {
        await createDeal(formData)
        toast.success("Deal created")
        router.push("/deals")
      }
    } catch {
      toast.error(isEdit ? "Failed to update deal" : "Failed to create deal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            {...register("value")}
          />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={watch("currency")}
            onValueChange={(val) => setValue("currency", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Stage *</Label>
          <Select
            value={watch("stage_id")}
            onValueChange={(val) => setValue("stage_id", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage_id && (
            <p className="text-sm text-destructive">{errors.stage_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Select
            value={watch("company_id") || ""}
            onValueChange={(val) => setValue("company_id", val === "_none" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">None</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="expected_close_date">Expected Close Date</Label>
          <Input
            id="expected_close_date"
            type="date"
            {...register("expected_close_date")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min={0}
            max={100}
            {...register("probability")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { companySchema, type CompanyFormValues } from "@/lib/validations/company"
import { createCompany, updateCompany } from "@/lib/actions/companies"
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

interface CompanyFormProps {
  defaultValues?: Partial<CompanyFormValues>
  companyId?: string
}

export function CompanyForm({ defaultValues, companyId }: CompanyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!companyId

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      domain: "",
      industry: "",
      size: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      notes: "",
      ...defaultValues,
    },
  })

  async function onSubmit(values: CompanyFormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined) formData.append(key, String(val))
      })

      if (isEdit) {
        await updateCompany(companyId, formData)
        toast.success("Company updated")
        router.push(`/companies/${companyId}`)
      } else {
        await createCompany(formData)
        toast.success("Company created")
        router.push("/companies")
      }
    } catch {
      toast.error(isEdit ? "Failed to update company" : "Failed to create company")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" placeholder="example.com" {...register("domain")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
        </div>
        <div className="space-y-2">
          <Label>Company Size</Label>
          <Select
            value={watch("size") || ""}
            onValueChange={(val) => setValue("size", val === "_none" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Not specified</SelectItem>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="500+">500+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register("country")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Company" : "Create Company"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

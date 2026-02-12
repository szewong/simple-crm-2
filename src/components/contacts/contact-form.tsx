"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import { createContact, updateContact } from "@/lib/actions/contacts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactFormProps {
  defaultValues?: Partial<ContactFormValues>
  contactId?: string
  companies: { id: string; name: string }[]
}

export function ContactForm({ defaultValues, contactId, companies }: ContactFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEdit = !!contactId

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      job_title: "",
      company_id: "",
      status: "active",
      source: "",
      ...defaultValues,
    },
  })

  async function onSubmit(values: ContactFormValues) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined) formData.append(key, String(val))
      })

      if (isEdit) {
        await updateContact(contactId, formData)
        toast.success("Contact updated")
        router.push(`/contacts/${contactId}`)
      } else {
        await createContact(formData)
        toast.success("Contact created")
        router.push("/contacts")
      }
    } catch (error) {
      toast.error(isEdit ? "Failed to update contact" : "Failed to create contact")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && (
            <p className="text-sm text-destructive">{errors.first_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && (
            <p className="text-sm text-destructive">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="job_title">Job Title</Label>
          <Input id="job_title" {...register("job_title")} />
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
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(val) => setValue("status", val as "active" | "inactive" | "lead")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            value={watch("source") || ""}
            onValueChange={(val) => setValue("source", val === "_none" ? "" : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">None</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="cold-call">Cold Call</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

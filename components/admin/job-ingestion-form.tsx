"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Loader2, CheckCircle } from "lucide-react";
import { COUNTRIES, SECTORS, JOB_TYPES } from "@/lib/constants";
import { JobInput } from "@/lib/types";

interface JobIngestionFormProps {
  onCreated: () => void;
}

const emptyForm: JobInput = {
  title: "",
  organization: "",
  country: "",
  sector: "",
  jobType: "",
  applicationUrl: "",
  description: "",
  closingDate: "",
};

export function JobIngestionForm({ onCreated }: JobIngestionFormProps) {
  const [form, setForm] = useState<JobInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof JobInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create job.");
        return;
      }
      setForm(emptyForm);
      setSuccess(true);
      onCreated();
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
          <PlusCircle className="h-5 w-5 text-emerald-600" />
          Data Ingestion Desk
        </CardTitle>
        <p className="text-sm text-slate-500">Manually append a new job listing.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Program Officer, Youth Digital Skills"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              required
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              placeholder="e.g. BuildUp Liberia Foundation"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select value={form.country} onValueChange={(v) => update("country", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter((c) => c.name !== "All West Africa").map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Sector</Label>
            <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Job Type</Label>
            <Select value={form.jobType} onValueChange={(v) => update("jobType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="applicationUrl">Application URL</Label>
            <Input
              id="applicationUrl"
              type="url"
              required
              value={form.applicationUrl}
              onChange={(e) => update("applicationUrl", e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="closingDate">Closing Date</Label>
            <Input
              id="closingDate"
              type="date"
              required
              value={form.closingDate}
              onChange={(e) => update("closingDate", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Role summary, responsibilities, requirements…"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="sm:col-span-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700 sm:col-span-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                Job published to the active inventory.
              </AlertDescription>
            </Alert>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Listing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

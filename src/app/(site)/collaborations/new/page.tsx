"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiCheck, FiInfo } from "react-icons/fi";

const collaborationSchema = z.object({
  type: z.enum(["RESEARCH", "OPEN_SOURCE_PROJECT", "STARTUP_COFOUNDER"]),
  title: z.string().min(3, "Title is required").max(120),
  fullName: z.string().min(2, "Full name is required").max(120),
  organization: z.string().max(120).optional().or(z.literal("")),
  description: z.string().min(30, "Description must be at least 30 characters").max(2000),
  link: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type CollaborationInput = z.infer<typeof collaborationSchema>;

export default function PublishCollaborationPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CollaborationInput>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      type: "RESEARCH",
    },
  });

  const description = watch("description");
  const descriptionLength = description?.length || 0;

  const onSubmit = async (values: CollaborationInput) => {
    setSubmitted(false);
    const payload = {
      ...values,
      organization: values.organization || undefined,
      link: values.link || undefined,
    };
    const res = await fetch("/api/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Unable to submit" }));
      toast.error(data.message ?? "Unable to submit");
      return;
    }
    reset();
    setSubmitted(true);
    toast.success("Submitted for review");
    setTimeout(() => router.push("/collaborations"), 2000);
  };

  return (
    <div className="container-grid py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <div className="card space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <FiInfo className="h-5 w-5 text-slate-600" />
              </div>
              <h1 className="text-xl font-semibold text-slate-950">Submission Guidelines</h1>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-950" />
                <span>Share a concise but descriptive brief that clearly outlines your request.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-950" />
                <span>Include timelines, desired outcomes, and required skills or expertise.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-950" />
                <span>Add supporting links to context, previous work, or relevant materials.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-950" />
                <span>We'll review and approve quality submissions within 24 hours.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="card p-6">
          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="collab-type" className="text-sm font-medium text-slate-950">
                Collaboration Type <span className="text-rose-600">*</span>
              </label>
              <select 
                id="collab-type"
                {...register("type")} 
                aria-invalid={errors.type ? "true" : "false"}
                aria-describedby={errors.type ? "collab-type-error" : undefined}
                className={errors.type ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
              >
                <option value="RESEARCH">Research</option>
                <option value="OPEN_SOURCE_PROJECT">Open Source Project</option>
                <option value="STARTUP_COFOUNDER">Startup Co-Founder</option>
              </select>
              {errors.type && (
                <p id="collab-type-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                  {errors.type.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="collab-title" className="text-sm font-medium text-slate-950">
                Title <span className="text-rose-600">*</span>
              </label>
              <input 
                id="collab-title"
                placeholder="What is the request about?" 
                {...register("title")} 
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby={errors.title ? "collab-title-error" : undefined}
                className={errors.title ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
              />
              {errors.title && (
                <p id="collab-title-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                  {errors.title.message}
                </p>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="collab-fullname" className="text-sm font-medium text-slate-950">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input 
                  id="collab-fullname"
                  placeholder="Your name" 
                  {...register("fullName")} 
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "collab-fullname-error" : undefined}
                  className={errors.fullName ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
                />
                {errors.fullName && (
                  <p id="collab-fullname-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="collab-org" className="text-sm font-medium text-slate-950">
                  Organization
                </label>
                <input 
                  id="collab-org"
                  placeholder="Optional" 
                  {...register("organization")} 
                  aria-invalid={errors.organization ? "true" : "false"}
                  aria-describedby={errors.organization ? "collab-org-error" : undefined}
                />
                {errors.organization && (
                  <p id="collab-org-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="collab-desc" className="text-sm font-medium text-slate-950">
                  Description <span className="text-rose-600">*</span>
                </label>
                <span className="text-xs text-slate-500" aria-live="polite">
                  {descriptionLength}/2000 characters
                </span>
              </div>
              <textarea 
                id="collab-desc"
                rows={6} 
                placeholder="Include goals, timelines, and ideal partners" 
                {...register("description")}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={errors.description ? "collab-desc-error" : undefined}
                className={errors.description ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
              />
              {errors.description && (
                <p id="collab-desc-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="collab-link" className="text-sm font-medium text-slate-950">
                Link (optional)
              </label>
              <input 
                id="collab-link"
                placeholder="https://" 
                {...register("link")}
                aria-invalid={errors.link ? "true" : "false"}
                aria-describedby={errors.link ? "collab-link-error" : undefined}
                className={errors.link ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
              />
              {errors.link && (
                <p id="collab-link-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                  {errors.link.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : submitted ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  Submitted successfully!
                </>
              ) : (
                "Submit for Review"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

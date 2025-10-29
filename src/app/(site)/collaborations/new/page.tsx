"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  } = useForm<CollaborationInput>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      type: "RESEARCH",
    },
  });

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
        <div className="card space-y-4 p-8">
          <span className="badge-soft">Guidance</span>
          <h1 className="text-3xl font-semibold text-slate-900">Publish a collaboration request</h1>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• Share a concise but descriptive brief.</li>
            <li>• Include timelines, desired outcomes, and required skills.</li>
            <li>• Add any supporting links to context or previous work.</li>
            <li>• We’ll review and approve within 24 hours.</li>
          </ul>
        </div>
        <div className="card p-8">
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Type</label>
              <select {...register("type")}>
                <option value="RESEARCH">Research</option>
                <option value="OPEN_SOURCE_PROJECT">Open Source Project</option>
                <option value="STARTUP_COFOUNDER">Startup Co-Founder</option>
              </select>
              {errors.type && <p className="text-sm text-rose-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Title</label>
              <input placeholder="What is the request about?" {...register("title")} />
              {errors.title && <p className="text-sm text-rose-500">{errors.title.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Full Name</label>
                <input placeholder="Your name" {...register("fullName")} />
                {errors.fullName && <p className="text-sm text-rose-500">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Organization</label>
                <input placeholder="Optional" {...register("organization")} />
                {errors.organization && <p className="text-sm text-rose-500">{errors.organization.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Description</label>
              <textarea rows={6} placeholder="Include goals, timelines, and ideal partners" {...register("description")} />
              {errors.description && <p className="text-sm text-rose-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Link (optional)</label>
              <input placeholder="https://" {...register("link")} />
              {errors.link && <p className="text-sm text-rose-500">{errors.link.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : submitted ? "Submitted. It will appear once approved." : "Submit for Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

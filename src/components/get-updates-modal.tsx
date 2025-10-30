"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
});

type SubscribeInput = z.infer<typeof subscribeSchema>;

export function GetUpdatesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
  });

  const onSubmit = async (values: SubscribeInput) => {
    setSuccess(false);
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSuccess(true);
      toast.success("You're on the list!");
      reset();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      const data = await res.json().catch(() => ({ message: "Something went wrong" }));
      toast.error(data.message ?? "Unable to subscribe");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Get Updates</h3>
            <p className="mt-1 text-sm text-slate-600">Stay informed about new collaborations and posts.</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-950" htmlFor="subscribe-email">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="you@company.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "subscribe-email-error" : undefined}
              className={errors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""}
            />
            {errors.email && (
              <p id="subscribe-email-error" role="alert" className="text-sm font-medium text-rose-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting || success}
          >
            {isSubmitting ? "Subscribing..." : success ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiMail, FiCheck } from "react-icons/fi";

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
    } else {
      const data = await res.json().catch(() => ({ message: "Something went wrong" }));
      toast.error(data.message ?? "Unable to subscribe");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-blue-50 p-4 ring-1 ring-brand-200/50">
            {success ? (
              <FiCheck className="h-10 w-10 text-brand-600" />
            ) : (
              <FiMail className="h-10 w-10 text-brand-600" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Get CrossField Updates</h3>
            <p className="text-sm text-slate-600">We never spam — expect thoughtful drops, and check spam just in case.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="subscribe-email">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="you@company.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "subscribe-email-error" : undefined}
              className={errors.email ? "ring-2 ring-rose-500 focus:ring-rose-500" : ""}
            />
            {errors.email && (
              <p id="subscribe-email-error" role="alert" className="flex items-center gap-1 text-sm font-medium text-rose-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? "Subscribing..." : success ? "You're on the list!" : "Subscribe"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

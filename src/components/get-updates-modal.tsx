"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

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
      toast.success("You’re on the list!");
      reset();
    } else {
      const data = await res.json().catch(() => ({ message: "Something went wrong" }));
      toast.error(data.message ?? "Unable to subscribe");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-semibold text-slate-900">Get CrossField Updates</h3>
          <p className="text-sm text-slate-500">We never spam — expect thoughtful drops, and check spam just in case.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="subscribe-email">
              Email
            </label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="you@company.com"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : success ? "You’re on the list!" : "Subscribe"}
          </button>
          <button type="button" onClick={onClose} className="w-full text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

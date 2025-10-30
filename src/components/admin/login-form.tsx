"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Invalid credentials" }));
      toast.error(data.message ?? "Invalid credentials");
      return;
    }
    toast.success("Welcome back");
    const redirectTo = params.get("from") ?? "/admin";
    window.location.href = redirectTo;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Username</label>
        <input {...register("username")} placeholder="Admin" />
        {errors.username && <p className="text-sm text-rose-500">{errors.username.message}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Password</label>
        <input type="password" {...register("password")} placeholder="••••••" />
        {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

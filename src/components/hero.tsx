import { ReactNode } from "react";

export function Hero({ actions }: { actions?: ReactNode }) {
  return (
    <section className="container-grid relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-blue-50 to-cyan-50 opacity-70 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute right-32 bottom-1/4 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
        </div>
      </div>
      <div className="relative z-10 max-w-3xl space-y-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-50 to-blue-50 px-4 py-2 ring-1 ring-brand-200/50">
          <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            CrossField
          </span>
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Discover today's top{" "}
          <span className="gradient-text">collaborations</span> & ideas
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          A curated field journal for researchers, builders, and co-founders in search of their next big collaboration.
        </p>
        {actions}
      </div>
    </section>
  );
}

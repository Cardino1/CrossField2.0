import { ReactNode } from "react";

export function Hero({ actions }: { actions?: ReactNode }) {
  return (
    <section className="container-grid relative overflow-hidden py-16 sm:py-24">
      <div className="relative z-10 max-w-3xl space-y-6">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          CrossField
        </span>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Discover today’s top collaborations & ideas
        </h1>
        <p className="text-lg text-slate-600">
          A curated field journal for researchers, builders, and co-founders in search of their next big collaboration.
        </p>
        {actions}
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-1/2 rounded-l-[4rem] bg-gradient-to-br from-brand-100 via-white to-slate-100/60 shadow-inner md:block" />
    </section>
  );
}

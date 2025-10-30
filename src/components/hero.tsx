import { ReactNode } from "react";

export function Hero({ actions }: { actions?: ReactNode }) {
  return (
    <section className="container-grid py-20 sm:py-28">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Discover today's top collaborations & ideas
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          A curated field journal for researchers, builders, and co-founders in search of their next big collaboration.
        </p>
        {actions}
      </div>
    </section>
  );
}
